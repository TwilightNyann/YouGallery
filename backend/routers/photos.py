from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Path
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from database import get_db
from models import Photo, Scene, Gallery, User, UserFavorite
from schemas import Photo as PhotoSchema, PhotoWithUrl, FavoriteCreate
from auth import get_current_active_user, get_optional_current_user
from storage import storage_service
import logging
import io

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/{photo_id}/view")
async def view_photo(
    photo_id: int,
    db: Session = Depends(get_db)
):
    """Endpoint для перегляду фото за ID"""
    logger.info(f"Viewing photo by ID {photo_id}")
    
    # Знайти фото в базі даних
    photo = db.query(Photo).filter(Photo.id == photo_id).first()
    
    if not photo:
        logger.error(f"Photo {photo_id} not found in database")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Photo not found"
        )
    
    try:
        # Отримати файл з сховища
        logger.info(f"Getting file {photo.filename} from storage")
        file_data = storage_service.get_file(photo.filename)
        
        if not file_data:
            logger.error(f"Photo file {photo.filename} not found in storage")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Photo file not found in storage"
            )
        
        logger.info(f"Successfully retrieved file {photo.filename}, size: {len(file_data)} bytes")
        
        # Повернути файл як StreamingResponse
        return StreamingResponse(
            io.BytesIO(file_data),
            media_type=photo.mime_type or "image/jpeg",
            headers={
                "Content-Disposition": f"inline; filename={photo.original_filename}",
                "Cache-Control": "public, max-age=3600"
            }
        )
        
    except Exception as e:
        logger.error(f"Error serving photo {photo_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error serving photo: {str(e)}"
        )

@router.get("/view/{filename}")
async def view_photo_by_filename(
    filename: str = Path(..., description="Filename of the photo"),
    db: Session = Depends(get_db)
):
    """Endpoint для перегляду фото за filename"""
    logger.info(f"Viewing photo by filename {filename}")
    
    try:
        # Отримати файл з сховища напряму за filename
        file_data, content_type = storage_service.get_file_data(filename)
        
        if not file_data:
            logger.error(f"Photo file {filename} not found in storage")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Photo file not found in storage"
            )
        
        logger.info(f"Successfully retrieved file {filename}, size: {len(file_data)} bytes, type: {content_type}")
        
        # Повернути файл як StreamingResponse
        return StreamingResponse(
            io.BytesIO(file_data),
            media_type=content_type,
            headers={
                "Content-Disposition": f"inline; filename={filename}",
                "Cache-Control": "public, max-age=3600"
            }
        )
        
    except Exception as e:
        logger.error(f"Error serving photo {filename}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error serving photo: {str(e)}"
        )

@router.delete("/{photo_id}")
def delete_photo(
    photo_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    photo = db.query(Photo).join(Scene).join(Gallery).filter(
        Photo.id == photo_id,
        Gallery.owner_id == current_user.id
    ).first()
    
    if not photo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Photo not found"
        )
    
    # Delete from storage
    storage_service.delete_file(photo.filename)
    
    # Delete from database
    db.delete(photo)
    db.commit()
    
    return {"message": "Photo deleted successfully"}

@router.put("/{photo_id}/set-cover")
def set_as_gallery_cover(
    photo_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Find the photo and verify ownership
    photo = db.query(Photo).join(Scene).join(Gallery).filter(
        Photo.id == photo_id,
        Gallery.owner_id == current_user.id
    ).first()
    
    if not photo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Photo not found"
        )
    
    # Update gallery cover
    gallery = db.query(Gallery).join(Scene).filter(
        Scene.id == photo.scene_id,
        Gallery.owner_id == current_user.id
    ).first()
    
    if gallery:
        gallery.cover_photo_id = photo_id
        db.commit()
        db.refresh(gallery)
    
    return {"message": "Photo set as gallery cover successfully"}

@router.post("/favorites", response_model=dict)
def toggle_favorite(
    favorite: FavoriteCreate,
    current_user: User = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    logger.info(f"Toggle favorite for photo {favorite.photo_id}, user: {current_user.id if current_user else 'anonymous'}, session: {favorite.session_id}")
    
    # Check if photo exists
    photo = db.query(Photo).filter(Photo.id == favorite.photo_id).first()
    if not photo:
        logger.error(f"Photo {favorite.photo_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Photo not found"
        )
    
    # Find existing favorite
    existing_favorite = None
    if current_user:
        existing_favorite = db.query(UserFavorite).filter(
            UserFavorite.user_id == current_user.id,
            UserFavorite.photo_id == favorite.photo_id
        ).first()
    elif favorite.session_id:
        existing_favorite = db.query(UserFavorite).filter(
            UserFavorite.session_id == favorite.session_id,
            UserFavorite.photo_id == favorite.photo_id
        ).first()
    
    if existing_favorite:
        # Remove favorite
        logger.info(f"Removing favorite for photo {favorite.photo_id}")
        db.delete(existing_favorite)
        db.commit()
        return {"is_favorite": False}
    else:
        # Add favorite
        logger.info(f"Adding favorite for photo {favorite.photo_id}")
        new_favorite = UserFavorite(
            user_id=current_user.id if current_user else None,
            session_id=favorite.session_id if not current_user else None,
            photo_id=favorite.photo_id
        )
        db.add(new_favorite)
        db.commit()
        return {"is_favorite": True}

@router.get("/favorites", response_model=List[PhotoWithUrl])
def get_user_favorites(
    session_id: str = None,
    current_user: User = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    logger.info(f"Getting favorites for user: {current_user.id if current_user else 'anonymous'}, session: {session_id}")
    
    if current_user:
        favorites = db.query(UserFavorite).filter(
            UserFavorite.user_id == current_user.id
        ).all()
        logger.info(f"Found {len(favorites)} favorites for user {current_user.id}")
    elif session_id:
        favorites = db.query(UserFavorite).filter(
            UserFavorite.session_id == session_id
        ).all()
        logger.info(f"Found {len(favorites)} favorites for session {session_id}")
    else:
        logger.info("No user or session ID provided, returning empty list")
        return []
    
    photos_with_urls = []
    for favorite in favorites:
        photo = db.query(Photo).filter(Photo.id == favorite.photo_id).first()
        if photo:
            photo_with_url = PhotoWithUrl(
                **photo.__dict__,
                url=storage_service.get_file_url(photo.filename),
                is_favorite=True
            )
            photos_with_urls.append(photo_with_url)
        else:
            logger.warning(f"Favorite references non-existent photo ID {favorite.photo_id}")
    
    logger.info(f"Returning {len(photos_with_urls)} favorite photos")
    return photos_with_urls

# OPTIONS handlers для CORS
@router.options("/{photo_id}")
async def delete_photo_options():
    return {"message": "OK"}

@router.options("/{photo_id}/view")
async def view_photo_options():
    return {"message": "OK"}

@router.options("/view/{filename}")
async def view_photo_by_filename_options():
    return {"message": "OK"}

@router.options("/{photo_id}/set-cover")
async def set_cover_options():
    return {"message": "OK"}

@router.options("/favorites")
async def favorites_options():
    return {"message": "OK"}
