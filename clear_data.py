import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv(dotenv_path='backend/.env')
DATABASE_URL = os.getenv('DATABASE_URL')

if not DATABASE_URL:
    print("Error: DATABASE_URL not found in backend/.env")
    exit(1)

def clear_data():
    engine = create_engine(DATABASE_URL)
    
    try:
        with engine.connect() as connection:
            print("Clearing data from tables...")
            
            # Using TRUNCATE with CASCADE is efficient for PostgreSQL
            # It deletes all rows from the specified tables and recursively from tables that have foreign keys referencing them.
            connection.execute(text("TRUNCATE TABLE participants CASCADE;"))
            
            connection.commit()
            print("Data successfully cleared from participants, leaderboard, and quiz_responses.")
    except Exception as e:
        print(f"Failed to clear data: {e}")

if __name__ == "__main__":
    clear_data()
