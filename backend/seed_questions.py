"""
Seed script to populate the questions table with all 10 quiz questions.
Run this script after creating the database to populate questions.
"""
from app.database import SessionLocal, engine
from app.models import Base, Question

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

# Quiz questions with correct answers (based on research)
QUESTIONS = [
    {
        "question_number": 1,
        "text": "Which part of the human body contains the maximum number of bones?",
        "options": [
            ("Spine", False),
            ("Skull", False),
            ("Hands and feet", True),
            ("Rib cage", False)
        ]
    },
    {
        "question_number": 2,
        "text": "The Tropic of Capricorn passes through how many Indian states?",
        "options": [
            ("6", False),
            ("7", False),
            ("8", True),
            ("9", False)
        ]
    },
    {
        "question_number": 3,
        "text": "Which Indian state recently became the first to implement a comprehensive AI policy?",
        "options": [
            ("Karnataka", True),
            ("Telangana", False),
            ("Tamil Nadu", False),
            ("Maharashtra", False)
        ]
    },
    {
        "question_number": 4,
        "text": "Which Indian state hosted the Khelo India Youth Games 2024?",
        "options": [
            ("Madhya Pradesh", False),
            ("Maharashtra", False),
            ("Tamil Nadu", True),
            ("Gujarat", False)
        ]
    },
    {
        "question_number": 5,
        "text": "Who is known as the architect of India's Goods and Services Tax (GST)?",
        "options": [
            ("Dr. Manmohan Singh", False),
            ("Arun Jaitley", True),
            ("Nirmala Sitharaman", False),
            ("P. Chidambaram", False)
        ]
    },
    {
        "question_number": 6,
        "text": "Which Nobel Prize category was introduced last among the Nobel Prizes?",
        "options": [
            ("Literature", False),
            ("Peace", False),
            ("Economics", True),
            ("Chemistry", False)
        ]
    },
    {
        "question_number": 7,
        "text": "Mount Kilimanjaro is located in which country?",
        "options": [
            ("Kenya", False),
            ("Uganda", False),
            ("Tanzania", True),
            ("Ethiopia", False)
        ]
    },
    {
        "question_number": 8,
        "text": "The term \"Blue Economy\" is primarily related to:",
        "options": [
            ("Inland water transport", False),
            ("Sustainable use of ocean resources", True),
            ("Marine military strategy", False),
            ("Deep-sea mining only", False)
        ]
    },
    {
        "question_number": 9,
        "text": "Which Indian mission aims to study the Sun?",
        "options": [
            ("Chandrayaan-3", False),
            ("Gaganyaan", False),
            ("Aditya-L1", True),
            ("Mangalyaan", False)
        ]
    },
    {
        "question_number": 10,
        "text": "The term 'stagflation' refers to:",
        "options": [
            ("High inflation with high growth", False),
            ("Low inflation with low growth", False),
            ("High inflation with stagnant growth", True),
            ("Deflation with recession", False)
        ]
    }
]

def seed_questions():
    """Seed the database with quiz questions"""
    db = SessionLocal()
    
    try:
        # Check if questions already exist
        existing_count = db.query(Question).count()
        if existing_count > 0:
            print(f"Database already contains {existing_count} questions.")
            response = input("Do you want to delete and re-seed? (yes/no): ")
            if response.lower() != 'yes':
                print("Seeding cancelled.")
                return
            
            # Delete existing questions
            db.query(Question).delete()
            db.commit()
            print("Existing questions deleted.")
        
        # Insert all questions
        for q_data in QUESTIONS:
            question = Question(
                question_number=q_data["question_number"],
                text=q_data["text"],
                option1_text=q_data["options"][0][0],
                option1_is_correct=q_data["options"][0][1],
                option2_text=q_data["options"][1][0],
                option2_is_correct=q_data["options"][1][1],
                option3_text=q_data["options"][2][0],
                option3_is_correct=q_data["options"][2][1],
                option4_text=q_data["options"][3][0],
                option4_is_correct=q_data["options"][3][1]
            )
            db.add(question)
        
        db.commit()
        print(f"✅ Successfully seeded {len(QUESTIONS)} questions into the database!")
        
        # Verify
        total = db.query(Question).count()
        print(f"Total questions in database: {total}")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding questions: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("🌱 Seeding Indira BrainStorm Quiz Questions...")
    print("=" * 50)
    seed_questions()
