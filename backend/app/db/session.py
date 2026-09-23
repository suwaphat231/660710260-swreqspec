import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg://localhost/booking")
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_db():
    """เปิด session ฐานข้อมูลสำหรับ endpoint ที่เรียกใช้งานตาม CON-TECH-01."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()