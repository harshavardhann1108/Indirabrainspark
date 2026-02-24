from sqlalchemy.orm import Session
from sqlalchemy import Integer
from app import models, schemas
from sqlalchemy.exc import IntegrityError

def create_participant(db: Session, participant: schemas.ParticipantCreate):
    """Create a new participant"""
    db_participant = models.Participant(
        full_name=participant.full_name,
        contact_number=participant.contact_number,
        email=participant.email,
        school_college=participant.school_college,
        application_number=participant.application_number
    )
    db.add(db_participant)
    db.commit()
    db.refresh(db_participant)
    return db_participant

def get_participant_by_email(db: Session, email: str):
    """Get participant by email"""
    return db.query(models.Participant).filter(models.Participant.email == email).first()

def get_all_questions(db: Session):
    """Get all questions ordered by question_number"""
    return db.query(models.Question).order_by(models.Question.question_number).all()

def get_question_by_number(db: Session, question_number: int):
    """Get a specific question by its number"""
    return db.query(models.Question).filter(models.Question.question_number == question_number).first()

def create_quiz_response(db: Session, participant_id: int, question_number: int, 
                         selected_answer: str, time_taken: int, is_correct: bool):
    """Create a quiz response"""
    db_response = models.QuizResponse(
        participant_id=participant_id,
        question_number=question_number,
        selected_answer=selected_answer,
        time_taken=time_taken,
        is_correct=is_correct
    )
    db.add(db_response)
    db.commit()
    db.refresh(db_response)
    return db_response

def get_participant_responses(db: Session, participant_id: int):
    """Get all responses for a participant"""
    return db.query(models.QuizResponse).filter(
        models.QuizResponse.participant_id == participant_id
    ).all()

def get_all_participant_statistics(db: Session):
    """Get statistics for all participants including total marks and average response time"""
    from sqlalchemy import func
    
    # Query to get participant info with their statistics
    results = db.query(
        models.Participant.id,
        models.Participant.full_name,
        models.Participant.email,
        models.Participant.school_college,
        models.Participant.application_number,
        func.count(models.QuizResponse.id).label('total_questions'),
        func.sum(models.QuizResponse.is_correct.cast(Integer)).label('total_marks'),
        func.avg(models.QuizResponse.time_taken).label('avg_time')
    ).outerjoin(
        models.QuizResponse, 
        models.Participant.id == models.QuizResponse.participant_id
    ).group_by(
        models.Participant.id,
        models.Participant.full_name,
        models.Participant.email,
        models.Participant.school_college,
        models.Participant.application_number
    ).all()
    
    return results

# ============= ADMIN CRUD FUNCTIONS =============

def bulk_create_questions(db: Session, questions: list):
    """Bulk create or update questions"""
    from sqlalchemy import func
    
    added_count = 0
    updated_count = 0
    
    for q in questions:
        existing = db.query(models.Question).filter(
            models.Question.question_number == q.question_number
        ).first()
        
        if existing:
            # Update existing question
            existing.text = q.text
            existing.option1_text = q.option1_text
            existing.option1_is_correct = q.option1_is_correct
            existing.option2_text = q.option2_text
            existing.option2_is_correct = q.option2_is_correct
            existing.option3_text = q.option3_text
            existing.option3_is_correct = q.option3_is_correct
            existing.option4_text = q.option4_text
            existing.option4_is_correct = q.option4_is_correct
            updated_count += 1
        else:
            # Create new question
            new_question = models.Question(
                question_number=q.question_number,
                text=q.text,
                option1_text=q.option1_text,
                option1_is_correct=q.option1_is_correct,
                option2_text=q.option2_text,
                option2_is_correct=q.option2_is_correct,
                option3_text=q.option3_text,
                option3_is_correct=q.option3_is_correct,
                option4_text=q.option4_text,
                option4_is_correct=q.option4_is_correct
            )
            db.add(new_question)
            added_count += 1
    
    db.commit()
    
    total_questions = db.query(func.count(models.Question.id)).scalar()
    
    return {
        "added": added_count,
        "updated": updated_count,
        "total": total_questions
    }

def refresh_leaderboard(db: Session):
    """Recalculate and update leaderboard for all participants"""
    from sqlalchemy import func, desc, case
    
    # Get all participants with their stats
    participant_stats = db.query(
        models.Participant.id,
        func.count(models.QuizResponse.id).label('total_questions'),
        func.sum(case((models.QuizResponse.is_correct == True, 1), else_=0)).label('total_marks'),
        func.max(models.Leaderboard.total_time).label('total_time')  # Get the fixed total_time from leaderboard
    ).outerjoin(
        models.QuizResponse,
        models.Participant.id == models.QuizResponse.participant_id
    ).outerjoin(
        models.Leaderboard,
        models.Participant.id == models.Leaderboard.participant_id
    ).group_by(models.Participant.id).all()
    
    # Update or create leaderboard entries
    for stat in participant_stats:
        leaderboard_entry = db.query(models.Leaderboard).filter(
            models.Leaderboard.participant_id == stat.id
        ).first()
        
        if leaderboard_entry:
            leaderboard_entry.total_questions = stat.total_questions or 0
            leaderboard_entry.total_marks = stat.total_marks or 0
            leaderboard_entry.total_time = int(stat.total_time or 0)
            leaderboard_entry.avg_time = int(stat.avg_time or 0)
        else:
            new_entry = models.Leaderboard(
                participant_id=stat.id,
                total_questions=stat.total_questions or 0,
                total_marks=stat.total_marks or 0,
                total_time=stat.total_time or 0,
                avg_time=0
            )
            db.add(new_entry)
    
    db.commit()
    
    # Calculate ranks by marks (higher is better, time as tiebreaker)
    ranked_by_marks = db.query(models.Leaderboard).order_by(
        desc(models.Leaderboard.total_marks),
        models.Leaderboard.total_time
    ).all()
    
    for rank, entry in enumerate(ranked_by_marks, start=1):
        entry.rank_by_marks = rank
    
    # Calculate ranks by time (lower is better, only for those who completed all questions)
    total_questions_count = db.query(func.count(models.Question.id)).scalar()
    ranked_by_time = db.query(models.Leaderboard).filter(
        models.Leaderboard.total_questions == total_questions_count
    ).order_by(models.Leaderboard.total_time).all()
    
    for rank, entry in enumerate(ranked_by_time, start=1):
        entry.rank_by_time = rank
    
    # Calculate combined rank (weighted score)
    # Score = (marks_weight * total_marks) - (time_weight * normalized_time)
    max_time = db.query(func.max(models.Leaderboard.total_time)).scalar() or 1
    
    for entry in db.query(models.Leaderboard).all():
        normalized_time = (entry.total_time / max_time) * 10 if max_time > 0 else 0
        entry.combined_score = (0.7 * entry.total_marks) - (0.3 * normalized_time)
    
    db.commit()
    
    # Rank by combined score
    ranked_combined = db.query(models.Leaderboard).order_by(
        desc(models.Leaderboard.combined_score)
    ).all()
    
    for rank, entry in enumerate(ranked_combined, start=1):
        entry.rank_combined = rank
    
    db.commit()
    
    return len(participant_stats)

def get_toppers_by_marks(db: Session, limit: int = 10):
    """Get top performers by marks"""
    toppers = db.query(
        models.Leaderboard,
        models.Participant
    ).join(
        models.Participant,
        models.Leaderboard.participant_id == models.Participant.id
    ).filter(
        models.Leaderboard.rank_by_marks.isnot(None)
    ).order_by(
        models.Leaderboard.rank_by_marks
    ).limit(limit).all()
    
    return toppers

def get_toppers_by_time(db: Session, limit: int = 10):
    """Get fastest performers (who completed all questions)"""
    toppers = db.query(
        models.Leaderboard,
        models.Participant
    ).join(
        models.Participant,
        models.Leaderboard.participant_id == models.Participant.id
    ).filter(
        models.Leaderboard.rank_by_time.isnot(None)
    ).order_by(
        models.Leaderboard.rank_by_time
    ).limit(limit).all()
    
    return toppers

def get_combined_toppers(db: Session, limit: int = 10):
    """Get top performers by combined score"""
    toppers = db.query(
        models.Leaderboard,
        models.Participant
    ).join(
        models.Participant,
        models.Leaderboard.participant_id == models.Participant.id
    ).filter(
        models.Leaderboard.rank_combined.isnot(None)
    ).order_by(
        models.Leaderboard.rank_combined
    ).limit(limit).all()
    
    return toppers

def get_all_participants_with_scores(db: Session):
    """Get all participants with their scores, sorted by marks (descending)"""
    from sqlalchemy import func, desc, case
    
    # Query participants with their quiz statistics
    results = db.query(
        models.Participant.id,
        models.Participant.full_name,
        models.Participant.email,
        models.Participant.school_college,
        models.Participant.contact_number,
        models.Participant.application_number,
        func.count(models.QuizResponse.id).label('total_questions'),
        func.sum(case((models.QuizResponse.is_correct == True, 1), else_=0)).label('total_marks'),
        func.max(models.Leaderboard.total_time).label('total_time')
    ).outerjoin(
        models.QuizResponse,
        models.Participant.id == models.QuizResponse.participant_id
    ).outerjoin(
        models.Leaderboard,
        models.Participant.id == models.Leaderboard.participant_id
    ).group_by(
        models.Participant.id,
        models.Participant.full_name,
        models.Participant.email,
        models.Participant.school_college,
        models.Participant.contact_number,
        models.Participant.application_number
    ).order_by(
        desc('total_marks'),
        'total_time'
    ).all()
    
    return results
