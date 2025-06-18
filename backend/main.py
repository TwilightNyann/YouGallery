from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from database import engine, Base
from routers import auth, galleries, scenes, photos, users, contact

# Create tables only if they don't exist
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully")
except Exception as e:
    logger.error(f"Error creating database tables: {e}")

app = FastAPI(title="YouGallery API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "YouGallery API is running"}

# Include routers with /api prefix
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(galleries.router, prefix="/api/galleries", tags=["galleries"])
app.include_router(scenes.router, prefix="/api/galleries", tags=["scenes"])
app.include_router(photos.router, prefix="/api/photos", tags=["photos"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(contact.router, prefix="/api/contact", tags=["contact"])

# Create uploads directory if it doesn't exist
os.makedirs("uploads", exist_ok=True)

# Mount static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
