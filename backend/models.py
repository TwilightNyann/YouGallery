from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    galleries = relationship("Gallery", back_populates="owner", cascade="all, delete-orphan")

class Gallery(Base):
    __tablename__ = "galleries"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    shooting_date = Column(DateTime, nullable=False)
    is_public = Column(Boolean, default=False)
    is_password_protected = Column(Boolean, default=False)
    password_hash = Column(String, nullable=True)
    cover_photo_id = Column(Integer, nullable=True)
    view_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner = relationship("User", back_populates="galleries")
    scenes = relationship("Scene", back_populates="gallery", cascade="all, delete-orphan")

class Scene(Base):
    __tablename__ = "scenes"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    gallery_id = Column(Integer, ForeignKey("galleries.id"), nullable=False)
    gallery = relationship("Gallery", back_populates="scenes")
    photos = relationship("Photo", back_populates="scene", cascade="all, delete-orphan")

class Photo(Base):
    __tablename__ = "photos"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    mime_type = Column(String, nullable=False)
    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    scene_id = Column(Integer, ForeignKey("scenes.id"), nullable=False)
    scene = relationship("Scene", back_populates="photos")
    favorites = relationship("UserFavorite", back_populates="photo", cascade="all, delete-orphan")

class UserFavorite(Base):
    __tablename__ = "user_favorites"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Nullable for anonymous users
    session_id = Column(String, nullable=True)  # For anonymous users
    photo_id = Column(Integer, ForeignKey("photos.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    photo = relationship("Photo", back_populates="favorites")

class ContactMessage(Base):
    __tablename__ = "contact_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
