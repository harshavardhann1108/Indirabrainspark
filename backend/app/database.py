from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/indira_brainstorm")

engine = create_engine(
    DATABASE_URL,
    pool_size=20,          # Base connections to keep open
    max_overflow=10,       # Additional connections to open when pool is full
    pool_timeout=30,       # Wait time before giving up on connection
    pool_recycle=1800      # Recycle connections every 30 minutes
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
