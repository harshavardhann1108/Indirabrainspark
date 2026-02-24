import os
import json
from sqlalchemy import create_engine, text
import dotenv

dotenv.load_dotenv(dotenv_path='backend/.env')
DATABASE_URL = os.getenv('DATABASE_URL')
engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    leaderboard = [dict(r._mapping) for r in conn.execute(text("SELECT * FROM leaderboard;"))]
    participants = [dict(r._mapping) for r in conn.execute(text("SELECT id, full_name, application_number FROM participants;"))]
    quiz_responses = [dict(r._mapping) for r in conn.execute(text("SELECT * FROM quiz_responses;"))]
    
    # We need to format datetime objects for JSON serialization
    for table in [leaderboard, participants, quiz_responses]:
        for row in table:
            for k, v in row.items():
                if hasattr(v, 'isoformat'):
                    row[k] = v.isoformat()
                    
    with open('db_dump.json', 'w', encoding='utf-8') as f:
        json.dump({
            "leaderboard": leaderboard,
            "participants": participants,
            "quiz_responses": quiz_responses
        }, f, indent=2)
