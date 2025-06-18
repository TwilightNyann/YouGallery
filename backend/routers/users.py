import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select
from database import get_db
from models import User, Gallery, Scene, Photo
from schemas import UserUpdate, UserPasswordUpdate, User as UserSchema
from auth import (
  get_current_active_user,
  verify_password,
  get_password_hash
)
from storage import storage_service

router = APIRouter()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.put("/profile", response_model=UserSchema)
def update_profile(
  user_update: UserUpdate,
  current_user: User = Depends(get_current_active_user),
  db: Session = Depends(get_db)
):
    logger.info(f"User {current_user.email} updating their profile.")
    if user_update.name is not None:
        current_user.name = user_update.name
    if user_update.phone is not None:
        current_user.phone = user_update.phone
    # Add email update logic if needed, typically requires verification
    
    db.commit()
    db.refresh(current_user)
    logger.info(f"Profile for user {current_user.email} updated successfully.")
    return current_user

@router.put("/password")
def update_password(
  password_update: UserPasswordUpdate,
  current_user: User = Depends(get_current_active_user),
  db: Session = Depends(get_db)
):
    logger.info(f"User {current_user.email} attempting to update password.")
    if not verify_password(password_update.current_password, current_user.hashed_password):
        logger.warning(f"Incorrect current password attempt for user {current_user.email}.")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password"
        )
    
    current_user.hashed_password = get_password_hash(password_update.new_password)
    db.commit()
    logger.info(f"Password for user {current_user.email} updated successfully.")
    return {"message": "Password updated successfully"}

@router.delete("/account")
def delete_account(
  current_user: User = Depends(get_current_active_user),
  db: Session = Depends(get_db)
):
    user_id_to_delete = current_user.id
    user_email_to_delete = current_user.email
    logger.info(f"User {user_email_to_delete} (ID: {user_id_to_delete}) attempting to delete their account.")

    # Fetch user with all related galleries, scenes, and photos
    user_to_delete = db.query(User).filter(User.id == user_id_to_delete)\
        .options(
            selectinload(User.galleries)
            .selectinload(Gallery.scenes)
            .selectinload(Scene.photos)
        ).first()

    if not user_to_delete:
        # This case should ideally not be reached if get_current_active_user is working
        logger.error(f"User {user_email_to_delete} (ID: {user_id_to_delete}) not found for deletion, though authenticated.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Authenticated user not found for deletion.")

    logger.info(f"Found user {user_email_to_delete} for account deletion. Proceeding to delete associated S3 photos.")
    
    photos_to_delete_s3 = []
    for gallery_item in user_to_delete.galleries:
        for scene_item in gallery_item.scenes:
            for photo_item in scene_item.photos:
                if photo_item.filename: # filename is the S3 key
                    photos_to_delete_s3.append(photo_item.filename)
    
    if photos_to_delete_s3:
        logger.info(f"Attempting to delete {len(photos_to_delete_s3)} photos from S3 for user {user_email_to_delete}: {photos_to_delete_s3}")
        for photo_s3_key in photos_to_delete_s3:
            try:
                storage_service.delete_file(photo_s3_key)
                logger.info(f"Successfully deleted photo {photo_s3_key} from S3 for user {user_email_to_delete}")
            except Exception as e:
                logger.error(f"Error deleting photo {photo_s3_key} from S3 for user {user_email_to_delete}: {e}. Continuing with DB deletion.")
                # Decide if you want to collect these errors and report them
    else:
        logger.info(f"No S3 photos found to delete for user {user_email_to_delete}")

    try:
        logger.info(f"Attempting to delete user account {user_email_to_delete} (ID: {user_id_to_delete}) from database.")
        db.delete(user_to_delete) # This should trigger cascades for galleries, scenes, photos in DB
        db.commit()
        logger.info(f"User account {user_email_to_delete} (ID: {user_id_to_delete}) and all associated data successfully deleted from database.")
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting user account {user_email_to_delete} (ID: {user_id_to_delete}) from database: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not delete user account from database."
        )

    return {"message": "Account and all associated data processed for deletion successfully"}
