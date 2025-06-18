from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from database import get_db
from models import Scene, Photo, Gallery, User, UserFavorite
from schemas import SceneCreate, SceneUpdate, Scene as SceneSchema, SceneWithPhotos, PhotoWithUrl
from auth import get_current_active_user, get_optional_current_user
from storage import storage_service
import logging
import io
from PIL import Image

logger = logging.getLogger(__name__)
router = APIRouter()

# Get scenes for a gallery
@router.get("/{gallery_id}/scenes", response_model=List[SceneSchema])
def get_scenes(
    gallery_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all scenes for a gallery"""
    # Check if gallery exists and belongs to user
    gallery = db.query(Gallery).filter(
        Gallery.id == gallery_id,
        Gallery.owner_id == current_user.id
    ).first()
    
    if not gallery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gallery not found"
        )
    
    scenes = db.query(Scene).filter(Scene.gallery_id == gallery_id).order_by(Scene.order_index).all()
    logger.info(f"Found {len(scenes)} scenes for gallery {gallery_id}")
    return scenes

# Create a new scene
@router.post("/{gallery_id}/scenes", response_model=SceneSchema)
def create_scene(
    gallery_id: int,
    scene: SceneCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new scene in a gallery"""
    # Check if gallery exists and belongs to user
    gallery = db.query(Gallery).filter(
        Gallery.id == gallery_id,
        Gallery.owner_id == current_user.id
    ).first()
    
    if not gallery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gallery not found"
        )
    
    # Get max order_index
    max_order = db.query(Scene).filter(Scene.gallery_id == gallery_id).order_by(Scene.order_index.desc()).first()
    order_index = (max_order.order_index + 1) if max_order else 0
    
    # Create scene
    db_scene = Scene(
        name=scene.name,
        gallery_id=gallery_id,
        order_index=scene.order_index if scene.order_index is not None else order_index
    )
    
    db.add(db_scene)
    db.commit()
    db.refresh(db_scene)
    
    return db_scene

# Get scenes for public gallery viewing
@router.get("/{gallery_id}/scenes/public", response_model=List[SceneSchema])
def get_public_scenes(
    gallery_id: int,
    db: Session = Depends(get_db)
):
    """Get all scenes for a public gallery"""
    # Check if gallery exists and is public
    gallery = db.query(Gallery).filter(
        Gallery.id == gallery_id,
        Gallery.is_public == True
    ).first()
    
    if not gallery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gallery not found or not public"
        )
    
    scenes = db.query(Scene).filter(Scene.gallery_id == gallery_id).order_by(Scene.order_index).all()
    return scenes

# Scene management endpoints
@router.get("/scenes/{scene_id}", response_model=SceneWithPhotos)
async def get_scene(
    scene_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    logger.info(f"Getting scene {scene_id} by user {current_user.email}")
    
    scene = db.query(Scene).filter(Scene.id == scene_id).first()
    if not scene:
        logger.warning(f"Scene {scene_id} not found")
        raise HTTPException(status_code=404, detail="Scene not found")
    
    # Check if user has access to the gallery
    gallery = db.query(Gallery).filter(Gallery.id == scene.gallery_id).first()
    if gallery.owner_id != current_user.id:
        logger.warning(f"User {current_user.email} doesn't own gallery for scene {scene_id}")
        raise HTTPException(status_code=403, detail="Not authorized to access this scene")
    
    # Get photos for this scene
    photos = db.query(Photo).filter(Photo.scene_id == scene_id).order_by(Photo.order_index).all()
    
    photos_data = []
    for photo in photos:
        photo_data = {
            "id": photo.id,
            "filename": photo.filename,
            "original_filename": photo.original_filename,
            "file_size": photo.file_size,
            "mime_type": photo.mime_type,
            "width": photo.width,
            "height": photo.height,
            "order_index": photo.order_index,
            "scene_id": photo.scene_id,
            "created_at": photo.created_at,
            "url": f"/api/photos/{photo.id}/view",
            "is_favorite": False
        }
        photos_data.append(photo_data)
    
    return {
        "id": scene.id,
        "name": scene.name,
        "order_index": scene.order_index,
        "gallery_id": scene.gallery_id,
        "created_at": scene.created_at,
        "updated_at": scene.updated_at,
        "photo_count": len(photos_data),
        "photos": photos_data
    }

@router.put("/scenes/{scene_id}", response_model=SceneSchema)
def update_scene(
    scene_id: int,
    scene_update: SceneUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update a scene"""
    # Check if scene exists and belongs to user
    db_scene = db.query(Scene).join(Gallery).filter(
        Scene.id == scene_id,
        Gallery.owner_id == current_user.id
    ).first()
    
    if not db_scene:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scene not found"
        )
    
    # Update scene
    if scene_update.name is not None:
        db_scene.name = scene_update.name
    
    if scene_update.order_index is not None:
        db_scene.order_index = scene_update.order_index
    
    db.commit()
    db.refresh(db_scene)
    
    return db_scene

@router.delete("/scenes/{scene_id}")
def delete_scene(
    scene_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a scene"""
    # Check if scene exists and belongs to user
    db_scene = db.query(Scene).join(Gallery).filter(
        Scene.id == scene_id,
        Gallery.owner_id == current_user.id
    ).first()
    
    if not db_scene:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scene not found"
        )
    
    # Delete all photos in the scene
    photos = db.query(Photo).filter(Photo.scene_id == scene_id).all()
    for photo in photos:
        # Delete from storage
        storage_service.delete_file(photo.filename)
        # Delete from database
        db.delete(photo)
    
    # Delete scene
    db.delete(db_scene)
    db.commit()
    
    return {"message": "Scene deleted successfully"}

@router.get("/scenes/{scene_id}/photos", response_model=List[PhotoWithUrl])
def get_photos(
    scene_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all photos in a scene"""
    # Check if scene exists and belongs to user
    db_scene = db.query(Scene).join(Gallery).filter(
        Scene.id == scene_id,
        Gallery.owner_id == current_user.id
    ).first()
    
    if not db_scene:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scene not found"
        )
    
    logger.info(f"Getting photos for scene {scene_id} by user {current_user.email}")
    
    # Get photos
    photos = db.query(Photo).filter(Photo.scene_id == scene_id).order_by(Photo.order_index).all()
    
    # Add URLs to photos
    photos_with_urls = []
    for photo in photos:
        photo_with_url = PhotoWithUrl(
            **photo.__dict__,
            url=storage_service.get_file_url(photo.filename),
            is_favorite=False  # Default value
        )
        photos_with_urls.append(photo_with_url)
    
    logger.info(f"Found {len(photos)} photos for scene {scene_id}")
    return photos_with_urls

@router.get("/scenes/{scene_id}/photos/public", response_model=List[PhotoWithUrl])
def get_public_photos(
    scene_id: int,
    session_id: Optional[str] = None,
    current_user: User = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Get all photos in a public scene"""
    # Check if scene exists and belongs to a public gallery
    db_scene = db.query(Scene).join(Gallery).filter(
        Scene.id == scene_id,
        Gallery.is_public == True
    ).first()
    
    if not db_scene:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scene not found or not public"
        )
    
    # Get photos
    photos = db.query(Photo).filter(Photo.scene_id == scene_id).order_by(Photo.order_index).all()
    
    # Get user favorites
    user_favorites = set()
    if current_user:
        favorites = db.query(UserFavorite).filter(
            UserFavorite.user_id == current_user.id
        ).all()
        user_favorites = {fav.photo_id for fav in favorites}
    elif session_id:
        favorites = db.query(UserFavorite).filter(
            UserFavorite.session_id == session_id
        ).all()
        user_favorites = {fav.photo_id for fav in favorites}
    
    # Add URLs to photos
    photos_with_urls = []
    for photo in photos:
        photo_with_url = PhotoWithUrl(
            **photo.__dict__,
            url=storage_service.get_file_url(photo.filename),
            is_favorite=photo.id in user_favorites
        )
        photos_with_urls.append(photo_with_url)
    
    return photos_with_urls

@router.post("/scenes/{scene_id}/photos/upload")
async def upload_photos(
    scene_id: int,
    files: List[UploadFile] = File(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Upload photos to a scene"""
    # Check if scene exists and belongs to user
    db_scene = db.query(Scene).join(Gallery).filter(
        Scene.id == scene_id,
        Gallery.owner_id == current_user.id
    ).first()
    
    if not db_scene:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scene not found"
        )
    
    logger.info(f"Uploading {len(files)} photos to scene {scene_id} by user {current_user.email}")
    
    # Get max order_index
    max_order = db.query(Photo).filter(Photo.scene_id == scene_id).order_by(Photo.order_index.desc()).first()
    order_index = (max_order.order_index + 1) if max_order else 0
    
    uploaded_photos = []
    
    for i, file in enumerate(files):
        try:
            # Read file content
            file_content = await file.read()
            
            # Check if file is an image
            try:
                img = Image.open(io.BytesIO(file_content))
                width, height = img.size
            except Exception as e:
                logger.error(f"File {file.filename} is not a valid image: {str(e)}")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"File {file.filename} is not a valid image"
                )
            
            # Upload file to storage
            filename = storage_service.upload_file(
                file_content,
                file.filename,
                file.content_type or "image/jpeg"
            )
            
            # Create photo in database - ВИПРАВЛЕНО: додано file_path
            db_photo = Photo(
                filename=filename,
                original_filename=file.filename,
                file_path=f"/uploads/{filename}",  # ДОДАНО це поле
                mime_type=file.content_type or "image/jpeg",
                file_size=len(file_content),
                width=width,
                height=height,
                scene_id=scene_id,
                order_index=order_index + i
            )
            
            db.add(db_photo)
            db.commit()
            db.refresh(db_photo)
            
            # Add URL to photo
            photo_with_url = PhotoWithUrl(
                **db_photo.__dict__,
                url=storage_service.get_file_url(filename),
                is_favorite=False
            )
            
            uploaded_photos.append(photo_with_url)
            logger.info(f"Uploaded photo {db_photo.id} to scene {scene_id}")
            
        except Exception as e:
            # Rollback transaction on error
            db.rollback()
            logger.error(f"Error uploading photo: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error uploading photo: {str(e)}"
            )
    
    logger.info(f"Successfully uploaded {len(uploaded_photos)} photos to scene {scene_id}")
    return uploaded_photos

# OPTIONS handlers для CORS
@router.options("/{gallery_id}/scenes")
async def get_scenes_options():
    return {"message": "OK"}

@router.options("/{gallery_id}/scenes/public")
async def get_public_scenes_options():
    return {"message": "OK"}

@router.options("/scenes/{scene_id}")
async def update_scene_options():
    return {"message": "OK"}

@router.options("/scenes/{scene_id}/photos")
async def get_photos_options():
    return {"message": "OK"}

@router.options("/scenes/{scene_id}/photos/public")
async def get_public_photos_options():
    return {"message": "OK"}

@router.options("/scenes/{scene_id}/photos/upload")
async def upload_photos_options():
    return {"message": "OK"}
