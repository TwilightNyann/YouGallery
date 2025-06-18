from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None

class UserPasswordUpdate(BaseModel):
    current_password: str
    new_password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# Gallery schemas
class GalleryBase(BaseModel):
    name: str
    shooting_date: datetime
    is_public: bool = False
    is_password_protected: bool = False

    @field_validator('shooting_date', mode='before')
    def parse_shooting_date(cls, v):
        if isinstance(v, str):
            if 'T' not in v:
                v = f"{v}T00:00:00"
            return datetime.fromisoformat(v.replace('Z', '+00:00'))
        return v

class GalleryCreate(GalleryBase):
    password: Optional[str] = None

class GalleryUpdate(BaseModel):
    name: Optional[str] = None
    shooting_date: Optional[datetime] = None
    is_public: Optional[bool] = None
    is_password_protected: Optional[bool] = None
    password: Optional[str] = None

    @field_validator('shooting_date', mode='before')
    def parse_shooting_date(cls, v):
        if v is None:
            return v
        if isinstance(v, str):
            if 'T' not in v:
                v = f"{v}T00:00:00"
            return datetime.fromisoformat(v.replace('Z', '+00:00'))
        return v

class GalleryPasswordCheck(BaseModel):
    password: str

class Gallery(GalleryBase):
    id: int
    owner_id: int
    view_count: int = 0
    cover_photo_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Scene schemas
class SceneBase(BaseModel):
    name: str
    order_index: Optional[int] = 0

class SceneCreate(SceneBase):
    pass

class SceneUpdate(BaseModel):
    name: Optional[str] = None
    order_index: Optional[int] = None

class Scene(SceneBase):
    id: int
    gallery_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    photo_count: Optional[int] = 0

    class Config:
        from_attributes = True

# Photo schemas
class PhotoBase(BaseModel):
    filename: str
    original_filename: str
    file_size: int
    mime_type: str
    width: Optional[int] = None
    height: Optional[int] = None
    order_index: int = 0

class PhotoCreate(PhotoBase):
    scene_id: int

class PhotoUpdate(BaseModel):
    order_index: Optional[int] = None

class Photo(PhotoBase):
    id: int
    scene_id: int
    file_path: str
    created_at: datetime
    url: Optional[str] = None
    is_favorite: Optional[bool] = False

    class Config:
        from_attributes = True

class PhotoWithUrl(Photo):
    url: str

# Scene with photos
class SceneWithPhotos(Scene):
    photos: List[Photo] = []

    class Config:
        from_attributes = True

# Gallery with scenes
class GalleryWithScenes(Gallery):
    scenes: List[SceneWithPhotos] = []

    class Config:
        from_attributes = True

# Contact schemas
class ContactMessageBase(BaseModel):
    name: str
    email: EmailStr
    message: str

class ContactMessageCreate(ContactMessageBase):
    pass

class ContactMessage(ContactMessageBase):
    id: int
    is_read: bool = False
    created_at: datetime

    class Config:
        from_attributes = True

# Favorite schemas
class FavoriteCreate(BaseModel):
    photo_id: int
    session_id: Optional[str] = None

class Favorite(BaseModel):
    id: int
    photo_id: int
    user_id: Optional[int] = None
    session_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Update forward references
GalleryWithScenes.model_rebuild()
SceneWithPhotos.model_rebuild()
