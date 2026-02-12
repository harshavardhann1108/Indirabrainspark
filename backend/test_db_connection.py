import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/indira_brainstorm")

print(f"Testing connection to: {DATABASE_URL}")

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("✓ Database connection successful!")
        
        # Check if tables exist
        result = connection.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """))
        tables = [row[0] for row in result]
        print(f"\n✓ Found {len(tables)} tables: {', '.join(tables)}")
        
        # Check participants table
        if 'participants' in tables:
            result = connection.execute(text("SELECT COUNT(*) FROM participants"))
            count = result.scalar()
            print(f"✓ Participants table has {count} records")
        
except Exception as e:
    print(f"✗ Database connection failed!")
    print(f"Error: {str(e)}")
    print("\nPossible issues:")
    print("1. PostgreSQL service is not running")
    print("2. Database 'indira_brainstorm' does not exist")
    print("3. Incorrect credentials in .env file")
    print("4. PostgreSQL is not listening on localhost:5432")
