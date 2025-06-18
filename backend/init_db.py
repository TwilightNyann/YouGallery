#!/usr/bin/env python3

import asyncio
from sqlalchemy import create_engine
from models import Base
from config import settings

def create_tables():
    """Create all database tables"""
    engine = create_engine(settings.DATABASE_URL)
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    create_tables()
