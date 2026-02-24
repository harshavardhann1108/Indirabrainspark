import os
import sys
from sqlalchemy import create_engine, text

import dotenv
dotenv.load_dotenv(dotenv_path='backend/.env')
DATABASE_URL = os.getenv('DATABASE_URL')

def inspect_db():
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        print("--- LEADERBOARD ---")
        res = conn.execute(text("SELECT * FROM leaderboard;"))
        for row in res:
            print(row._asdict())
            
        print("\n--- QUIZ RESPONSES ---")
        res = conn.execute(text("SELECT * FROM quiz_responses;"))
        for row in res:
            print(row._asdict())
            
        print("\n--- PARTICIPANTS ---")
        res = conn.execute(text("SELECT id, full_name, application_number FROM participants;"))
        for row in res:
            print(row._asdict())

if __name__ == '__main__':
    inspect_db()
