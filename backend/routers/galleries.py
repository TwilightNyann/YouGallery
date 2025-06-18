import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, Body
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from database import get_db
from models import Gallery, Scene, Photo, User, UserFavorite
from schemas import (
    Gallery as GallerySchema, 
    GalleryCreate, 
    GalleryUpdate, 
    GalleryWithScenes,
    SceneWithPhotos,
    PhotoWithUrl
)
from auth import get_current_active_user, get_optional_current_user
from storage import storage_service
from passlib.context import CryptContext

logger = logging.getLogger(__name__)
router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/", response_model=GallerySchema)
def create_gallery(
    gallery: GalleryCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    logger.info(f"User {current_user.email} creating gallery: {gallery.name}")
    password_hash = None
    if gallery.password:
        password_hash = pwd_context.hash(gallery.password)
    
    db_gallery = Gallery(
        name=gallery.name,
        shooting_date=gallery.shooting_date,
        is_public=True,  # Всі галереї публічні за замовчуванням
        is_password_protected=gallery.is_password_protected or False,
        password_hash=password_hash,
        owner_id=current_user.id
    )
    
    db.add(db_gallery)
    db.commit()
    db.refresh(db_gallery)
    
    default_scene = Scene(
        name="New Scene",
        gallery_id=db_gallery.id,
        order_index=0
    )
    db.add(default_scene)
    db.commit()
    logger.info(f"Gallery {db_gallery.id} created successfully with default scene.")
    return db_gallery

@router.get("/", response_model=List[GallerySchema])
def get_galleries(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    galleries = db.query(Gallery).filter(
        Gallery.owner_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    return galleries

@router.get("/{gallery_id}", response_model=GalleryWithScenes)
def get_gallery(
    gallery_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    logger.info(f"Getting gallery {gallery_id} for user {current_user.email}")
    
    # Get gallery with scenes and photos
    gallery = db.query(Gallery).filter(
        Gallery.id == gallery_id,
        Gallery.owner_id == current_user.id
    ).first()
    
    if not gallery:
        logger.error(f"Gallery {gallery_id} not found for user {current_user.email}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gallery not found"
        )
    
    # Get scenes for this gallery
    scenes = db.query(Scene).filter(
        Scene.gallery_id == gallery_id
    ).order_by(Scene.order_index).all()
    
    # Get photos for each scene
    scenes_with_photos = []
    for scene in scenes:
        photos = db.query(Photo).filter(
            Photo.scene_id == scene.id
        ).order_by(Photo.order_index).all()
        
        # Add URLs to photos
        photos_with_urls = []
        for photo in photos:
            photo_dict = photo.__dict__.copy()
            photo_dict["url"] = storage_service.get_file_url(photo.filename)
            
            # Check if photo is favorited
            is_favorite = db.query(UserFavorite).filter(
                UserFavorite.user_id == current_user.id,
                UserFavorite.photo_id == photo.id
            ).first() is not None
            
            photo_dict["is_favorite"] = is_favorite
            photos_with_urls.append(PhotoWithUrl(**photo_dict))
        
        scene_dict = scene.__dict__.copy()
        scene_dict["photos"] = photos_with_urls
        scenes_with_photos.append(SceneWithPhotos(**scene_dict))
    
    # Create response
    gallery_response = GalleryWithScenes(
        id=gallery.id,
        name=gallery.name,
        shooting_date=gallery.shooting_date,
        is_public=gallery.is_public,
        is_password_protected=gallery.is_password_protected,
        view_count=gallery.view_count,
        created_at=gallery.created_at,
        updated_at=gallery.updated_at,
        owner_id=gallery.owner_id,
        scenes=scenes_with_photos
    )

    logger.info(f"Found gallery {gallery_id} with {len(scenes_with_photos)} scenes")
    return gallery_response

@router.get("/{gallery_id}/public", response_model=GalleryWithScenes)
def get_public_gallery(
    gallery_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_optional_current_user)
):
    logger.info(f"Getting public gallery {gallery_id}")
    
    # Get gallery - всі галереї тепер публічні
    gallery = db.query(Gallery).filter(Gallery.id == gallery_id).first()
    
    if not gallery:
        logger.error(f"Gallery {gallery_id} does not exist")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gallery not found"
        )
    
    # Increment view count
    gallery.view_count += 1
    db.commit()
    
    # Get scenes for this gallery
    scenes = db.query(Scene).filter(
        Scene.gallery_id == gallery_id
    ).order_by(Scene.order_index).all()
    
    # Get photos for each scene
    scenes_with_photos = []
    for scene in scenes:
        photos = db.query(Photo).filter(
            Photo.scene_id == scene.id
        ).order_by(Photo.order_index).all()
        
        # Add URLs to photos
        photos_with_urls = []
        for photo in photos:
            photo_dict = photo.__dict__.copy()
            photo_dict["url"] = storage_service.get_file_url(photo.filename)
            
            # Check if photo is favorited by current user
            is_favorite = False
            if current_user:
                is_favorite = db.query(UserFavorite).filter(
                    UserFavorite.user_id == current_user.id,
                    UserFavorite.photo_id == photo.id
                ).first() is not None
            
            photo_dict["is_favorite"] = is_favorite
            photos_with_urls.append(PhotoWithUrl(**photo_dict))
        
        scene_dict = scene.__dict__.copy()
        scene_dict["photos"] = photos_with_urls
        scenes_with_photos.append(SceneWithPhotos(**scene_dict))
    
    # Create response
    gallery_response = GalleryWithScenes(
        id=gallery.id,
        name=gallery.name,
        shooting_date=gallery.shooting_date,
        is_public=gallery.is_public,
        is_password_protected=gallery.is_password_protected,
        view_count=gallery.view_count,
        created_at=gallery.created_at,
        updated_at=gallery.updated_at,
        owner_id=gallery.owner_id,
        scenes=scenes_with_photos
    )

    logger.info(f"Found public gallery {gallery_id} with {len(scenes_with_photos)} scenes")
    return gallery_response

@router.put("/{gallery_id}", response_model=GallerySchema)
def update_gallery(
    gallery_id: int,
    gallery_update: GalleryUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    logger.info(f"User {current_user.email} updating gallery {gallery_id}")
    gallery = db.query(Gallery).filter(
        Gallery.id == gallery_id,
        Gallery.owner_id == current_user.id
    ).first()
    
    if not gallery:
        logger.warning(f"Gallery {gallery_id} not found for update by user {current_user.email}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gallery not found"
        )
    
    update_data = gallery_update.model_dump(exclude_unset=True)
    
    # Handle password update
    if "password" in update_data:
        password = update_data.pop('password')
        if password:
            update_data['password_hash'] = pwd_context.hash(password)
            update_data['is_password_protected'] = True
        else:
            update_data['password_hash'] = None
            update_data['is_password_protected'] = False
    
    # Ensure gallery remains public
    if 'is_public' in update_data:
        update_data['is_public'] = True
    
    for key, value in update_data.items():
        setattr(gallery, key, value)
            
    db.commit()
    db.refresh(gallery)
    logger.info(f"Gallery {gallery_id} updated successfully.")
    return gallery

@router.delete("/{gallery_id}")
def delete_gallery(
    gallery_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    logger.info(f"User {current_user.email} attempting to delete gallery {gallery_id}")
    
    db_gallery = db.query(Gallery).filter(
        Gallery.id == gallery_id,
        Gallery.owner_id == current_user.id
    ).first()
    
    if not db_gallery:
        logger.warning(f"Gallery {gallery_id} not found for user {current_user.email}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gallery not found"
        )
    
    try:
        # Get all photos in the gallery to delete from storage
        photos = db.query(Photo).join(Scene).filter(Scene.gallery_id == gallery_id).all()
        
        # Delete photos from storage
        for photo in photos:
            try:
                storage_service.delete_file(photo.filename)
                logger.info(f"Deleted photo file: {photo.filename}")
            except Exception as e:
                logger.warning(f"Failed to delete photo file {photo.filename}: {e}")
        
        # Delete gallery (cascade will handle scenes and photos)
        db.delete(db_gallery)
        db.commit()
        
        logger.info(f"Successfully deleted gallery {gallery_id}")
        return {"message": "Gallery deleted successfully"}
        
    except Exception as e:
        logger.error(f"Error deleting gallery {gallery_id}: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete gallery: {str(e)}"
        )

@router.post("/{gallery_id}/check-password")
def check_gallery_password(
    gallery_id: int,
    password_data: dict = Body(...),
    db: Session = Depends(get_db)
):
    gallery = db.query(Gallery).filter(
        Gallery.id == gallery_id,
        Gallery.is_password_protected == True
    ).first()
    
    if not gallery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gallery not found or is not password protected"
        )
    
    password = password_data.get("password", "")
    
    if not gallery.password_hash or not pwd_context.verify(password, gallery.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password"
        )
    
    return {"access_granted": True}

@router.get("/{gallery_id}/favorites", response_model=List[PhotoWithUrl])
def get_gallery_favorites(
    gallery_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    logger.info(f"Getting ALL client favorites for gallery {gallery_id} by owner {current_user.email}")
    
    # Check if gallery exists and belongs to user
    gallery = db.query(Gallery).filter(
        Gallery.id == gallery_id,
        Gallery.owner_id == current_user.id
    ).first()
    
    if not gallery:
        logger.error(f"Gallery {gallery_id} not found for user {current_user.email}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gallery not found or you don't have permission"
        )
    
    # Get ALL photos in this gallery that are favorited by ANY user (including anonymous)
    # This includes both registered users and anonymous session-based favorites
    favorites = db.query(UserFavorite).join(Photo).join(Scene).filter(
        Scene.gallery_id == gallery_id
    ).all()
    
    logger.info(f"Found {len(favorites)} total client favorites for gallery {gallery_id}")
    
    photos_with_urls = []
    seen_photo_ids = set()  # To avoid duplicates if same photo is liked by multiple users
    
    for favorite in favorites:
        if favorite.photo_id not in seen_photo_ids:
            photo = db.query(Photo).filter(Photo.id == favorite.photo_id).first()
            if photo:
                photo_dict = photo.__dict__.copy()
                photo_dict["url"] = storage_service.get_file_url(photo.filename)
                photo_dict["is_favorite"] = True
                photos_with_urls.append(PhotoWithUrl(**photo_dict))
                seen_photo_ids.add(favorite.photo_id)
    
    logger.info(f"Returning {len(photos_with_urls)} unique favorite photos for gallery {gallery_id}")
    return photos_with_urls

# OPTIONS handlers для CORS
@router.options("/")
async def create_gallery_options():
    return {"message": "OK"}

@router.options("/{gallery_id}")
async def gallery_options():
    return {"message": "OK"}

@router.options("/{gallery_id}/public")
async def public_gallery_options():
    return {"message": "OK"}

@router.options("/{gallery_id}/check-password")
async def check_password_options():
    return {"message": "OK"}

@router.options("/{gallery_id}/favorites")
async def gallery_favorites_options():
    return {"message": "OK"}
