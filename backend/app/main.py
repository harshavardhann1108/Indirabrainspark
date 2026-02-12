from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import participants, quiz, results, admin
from app.database import engine, Base
import os
from dotenv import load_dotenv

load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Indira BrainSpark Quiz API",
    description="Backend API for the Indira University quiz application",
    version="1.0.0"
)

# Configure CORS
# Get allowed origins from environment variable or default to "*"
allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "*")
allowed_origins = [origin.strip() for origin in allowed_origins_str.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("=" * 50)
print("CORS Configuration:")
print("Allowed Origins:", allowed_origins)
print("=" * 50)

# Include routers
app.include_router(participants.router)
app.include_router(quiz.router)
app.include_router(results.router)
app.include_router(admin.router)

@app.get("/")
def root():
    return {
        "message": "Welcome to Indira BrainSpark Quiz API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
