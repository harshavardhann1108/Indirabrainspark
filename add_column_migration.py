import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path='backend/.env')

# Get database URL
DATABASE_URL = os.getenv('DATABASE_URL')

if not DATABASE_URL:
    print("Error: DATABASE_URL not found in backend/.env")
    exit(1)

def migrate():
    print(f"Connecting to database...")
    engine = create_engine(DATABASE_URL)
    
    try:
        with engine.connect() as connection:
            print("Adding 'application_number' column to 'participants' table...")
            # Using text() for raw SQL execution
            connection.execute(text("ALTER TABLE participants ADD COLUMN IF NOT EXISTS application_number VARCHAR(255) DEFAULT '';"))
            connection.commit()
            print("Migration successful: 'application_number' column added.")
    except Exception as e:
        print(f"Migration failed: {e}")

if __name__ == "__main__":
    migrate()
