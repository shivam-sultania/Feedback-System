import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Use env variable if set, else fallback to local SQLite
DATABASE_URL = os.getenv("postgresql://shivam:WblI45htr5hu6mORRELTd6dlXx8roWSL@dpg-d1f5qeali9vc739kp2bg-a.singapore-postgres.render.com/feedback_db_wdg3", "sqlite:///./test.db")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
