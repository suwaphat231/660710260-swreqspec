"""เครื่องมือทดสอบ schema ของ T-01

>>> from sqlalchemy import create_engine, inspect
>>> test_engine = create_engine("sqlite:///:memory:")
>>> upgrade(test_engine)
>>> set(inspect(test_engine).get_table_names()) == {"slots", "bookings", "audit_logs"}
True
>>> "national_id" not in {column["name"] for column in inspect(test_engine).get_columns("bookings")}
True
"""

from collections.abc import Generator
from importlib import import_module

import pytest
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.models import Base

upgrade = import_module("app.db.migrations.001_init").upgrade


@pytest.fixture
def db_session() -> Generator[Session, None, None]:
    """เตรียมฐานข้อมูลจำลองสำหรับตรวจ schema ของ T-01 โดยไม่ใช้ PostgreSQL จริง."""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    upgrade(engine)
    session_factory = sessionmaker(bind=engine)
    with session_factory() as session:
        yield session
    Base.metadata.drop_all(engine)


@pytest.fixture
def schema_inspector(db_session: Session):
    """คืนตัวตรวจ schema เพื่อยืนยันว่าไม่มี national_id ตาม IF-HIS-01."""
    return inspect(db_session.bind)