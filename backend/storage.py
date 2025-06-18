import os
import logging
import uuid
from typing import Optional, Tuple
from minio import Minio
from minio.error import S3Error
from config import settings
from io import BytesIO

logger = logging.getLogger(__name__)

class MinIOStorageService:
    def __init__(self):
        self.client = Minio(
            settings.MINIO_ENDPOINT,
            access_key=settings.MINIO_ROOT_USER,
            secret_key=settings.MINIO_ROOT_PASSWORD,
            secure=settings.MINIO_SECURE
        )
        self.bucket_name = settings.MINIO_BUCKET_NAME
        self._ensure_bucket_exists()

    def _ensure_bucket_exists(self):
        """Ensure the bucket exists, create if it doesn't"""
        try:
            if not self.client.bucket_exists(self.bucket_name):
                self.client.make_bucket(self.bucket_name)
                logger.info(f"Created bucket: {self.bucket_name}")
        except S3Error as e:
            logger.error(f"Error ensuring bucket exists: {e}")

    def upload_file(self, file_data: bytes, filename: str, content_type: str = "application/octet-stream") -> str:
        """Upload file to MinIO and return unique filename"""
        try:
            # Generate unique filename if not provided
            if not filename or filename == "":
                file_extension = ".jpg"  # default extension
                unique_filename = f"{uuid.uuid4()}{file_extension}"
            else:
                # Keep original extension but generate unique name
                file_extension = os.path.splitext(filename)[1] or ".jpg"
                unique_filename = f"{uuid.uuid4().hex}{file_extension}"
            
            # Upload file to MinIO
            self.client.put_object(
                self.bucket_name,
                unique_filename,
                BytesIO(file_data),
                length=len(file_data),
                content_type=content_type
            )
            
            logger.info(f"Successfully uploaded file: {unique_filename}")
            return unique_filename
            
        except S3Error as e:
            logger.error(f"Error uploading file {filename}: {e}")
            raise Exception(f"Failed to upload file: {str(e)}")

    def get_file_url(self, file_path: str) -> str:
        """Generate URL for accessing the file"""
        try:
            # Для публічного доступу через API endpoint
            return f"{settings.API_BASE_URL}/api/photos/view/{file_path}"
        except Exception as e:
            logger.error(f"Error generating file URL for {file_path}: {e}")
            return f"{settings.API_BASE_URL}/api/photos/view/{file_path}"

    def get_file(self, file_path: str) -> bytes:
        """Get file data from MinIO"""
        try:
            response = self.client.get_object(self.bucket_name, file_path)
            data = response.read()
            response.close()
            response.release_conn()
            logger.info(f"Successfully retrieved file: {file_path}, size: {len(data)} bytes")
            return data
        except S3Error as e:
            logger.error(f"Error getting file {file_path}: {e}")
            raise Exception(f"Failed to get file: {str(e)}")

    def get_file_data(self, filename: str) -> Tuple[bytes, str]:
        """Get file data and content type"""
        try:
            logger.info(f"Getting file data for {filename}")
            
            # Get file data
            response = self.client.get_object(self.bucket_name, filename)
            data = response.read()
            response.close()
            response.release_conn()
            
            # Try to get content type from object metadata
            try:
                stat = self.client.stat_object(self.bucket_name, filename)
                content_type = stat.content_type or "image/jpeg"
            except:
                # Guess content type from extension
                ext = os.path.splitext(filename)[1].lower()
                content_type_map = {
                    '.jpg': 'image/jpeg',
                    '.jpeg': 'image/jpeg',
                    '.png': 'image/png',
                    '.gif': 'image/gif',
                    '.webp': 'image/webp'
                }
                content_type = content_type_map.get(ext, 'image/jpeg')
            
            logger.info(f"Retrieved file: {filename}, size: {len(data)} bytes, type: {content_type}")
            return data, content_type
            
        except S3Error as e:
            logger.error(f"Error getting file data for {filename}: {e}")
            raise Exception(f"Failed to get file data: {str(e)}")

    def delete_file(self, file_path: str) -> bool:
        """Delete file from MinIO"""
        try:
            self.client.remove_object(self.bucket_name, file_path)
            logger.info(f"Successfully deleted file: {file_path}")
            return True
        except S3Error as e:
            logger.error(f"Error deleting file {file_path}: {e}")
            return False

    def file_exists(self, file_path: str) -> bool:
        """Check if file exists in MinIO"""
        try:
            self.client.stat_object(self.bucket_name, file_path)
            return True
        except S3Error:
            return False

    def get_image_dimensions(self, file_data: bytes) -> tuple:
        """Get image dimensions from file data"""
        try:
            from PIL import Image
            image = Image.open(BytesIO(file_data))
            return image.size  # (width, height)
        except Exception as e:
            logger.error(f"Error getting image dimensions: {e}")
            return None, None

# Create a global instance
storage_service = MinIOStorageService()

# Alias for compatibility
minio_client = storage_service
