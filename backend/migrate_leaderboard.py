"""
Migration script to add combined_score column to leaderboard table
Run this script to update the existing leaderboard table structure
"""

import sys
import os

# Add parent directory to path to import app modules
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import engine
from sqlalchemy import text

def migrate():
    """Add combined_score column to leaderboard table"""
    
    with engine.connect() as conn:
        try:
            # Check if column exists
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='leaderboard' AND column_name='combined_score'
            """))
            
            if result.fetchone():
                print("✓ Column 'combined_score' already exists in leaderboard table")
                return
            
            # Add the column
            print("Adding 'combined_score' column to leaderboard table...")
            conn.execute(text("""
                ALTER TABLE leaderboard 
                ADD COLUMN combined_score DOUBLE PRECISION
            """))
            conn.commit()
            print("✓ Successfully added 'combined_score' column")
            
        except Exception as e:
            print(f"✗ Error during migration: {e}")
            conn.rollback()
            raise

if __name__ == "__main__":
    print("Starting leaderboard table migration...")
    migrate()
    print("Migration completed!")
