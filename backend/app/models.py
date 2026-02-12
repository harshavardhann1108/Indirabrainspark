from sqlalchemy import Column, Integer, String, Boolean, Text, ForeignKey, TIMESTAMP, Float
from sqlalchemy.sql import func
from app.database import Base

class Participant(Base):
    __tablename__ = "participants"
    
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    contact_number = Column(String(15), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    school_college = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

class Question(Base):
    __tablename__ = "questions"
    
    id = Column(Integer, primary_key=True, index=True)
    question_number = Column(Integer, nullable=False, unique=True, index=True)
    text = Column(Text, nullable=False)
    option1_text = Column(String(500), nullable=False)
    option1_is_correct = Column(Boolean, nullable=False)
    option2_text = Column(String(500), nullable=False)
    option2_is_correct = Column(Boolean, nullable=False)
    option3_text = Column(String(500), nullable=False)
    option3_is_correct = Column(Boolean, nullable=False)
    option4_text = Column(String(500), nullable=False)
    option4_is_correct = Column(Boolean, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

class QuizResponse(Base):
    __tablename__ = "quiz_responses"
    
    id = Column(Integer, primary_key=True, index=True)
    participant_id = Column(Integer, ForeignKey("participants.id", ondelete="CASCADE"), nullable=False)
    question_number = Column(Integer, nullable=False)
    selected_answer = Column(String(1), nullable=True)  # 'A', 'B', 'C', 'D', or NULL
    time_taken = Column(Integer, nullable=True)  # seconds (0-10)
    is_correct = Column(Boolean, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())

class Leaderboard(Base):
    __tablename__ = "leaderboard"
    
    id = Column(Integer, primary_key=True, index=True)
    participant_id = Column(Integer, ForeignKey("participants.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    total_questions = Column(Integer, nullable=False, default=0)
    total_marks = Column(Integer, nullable=False, default=0)
    total_time = Column(Integer, nullable=False, default=0)  # Sum of all response times
    avg_time = Column(Integer, nullable=False, default=0)  # Average time per question
    rank_by_marks = Column(Integer, nullable=True, index=True)
    rank_by_time = Column(Integer, nullable=True, index=True)
    rank_combined = Column(Integer, nullable=True, index=True)
    combined_score = Column(Float, nullable=True)  # Weighted score for combined ranking
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
