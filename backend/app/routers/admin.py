from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app import crud, schemas
from app.database import get_db
from typing import List

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.post("/questions/upload", response_model=schemas.QuestionUploadResponse)
def upload_questions(
    question_data: schemas.BulkQuestionUpload,
    db: Session = Depends(get_db)
):
    """
    Bulk upload or update quiz questions.
    
    - Accepts array of questions
    - Updates existing questions (by question_number)
    - Creates new questions if they don't exist
    - Returns count of added/updated questions
    """
    try:
        result = crud.bulk_create_questions(db, question_data.questions)
        
        return schemas.QuestionUploadResponse(
            message="Questions uploaded successfully",
            questions_added=result["added"],
            questions_updated=result["updated"],
            total_questions=result["total"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading questions: {str(e)}")

@router.post("/leaderboard/refresh", response_model=schemas.LeaderboardRefreshResponse)
def refresh_leaderboard(db: Session = Depends(get_db)):
    """
    Recalculate and update the leaderboard for all participants.
    
    - Calculates total marks and total time for each participant
    - Updates ranks by marks, time, and combined score
    - Should be called after quiz submissions or question updates
    """
    try:
        participants_updated = crud.refresh_leaderboard(db)
        
        return schemas.LeaderboardRefreshResponse(
            message="Leaderboard refreshed successfully",
            participants_updated=participants_updated
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error refreshing leaderboard: {str(e)}")

@router.get("/leaderboard", response_model=schemas.ToppersResponse)
def get_leaderboard(
    limit: int = Query(default=100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """
    Get the complete leaderboard of all participants.
    
    Ranking criteria:
    1. Highest total marks (more correct answers = better rank)
    2. Fastest total response time (tiebreaker - faster = better rank)
    
    Returns all participants sorted with toppers at the top.
    """
    # Get all participants from leaderboard, ordered by performance
    toppers_data = db.query(
        crud.models.Leaderboard,
        crud.models.Participant
    ).join(
        crud.models.Participant,
        crud.models.Leaderboard.participant_id == crud.models.Participant.id
    ).order_by(
        crud.models.Leaderboard.total_marks.desc(),  # Higher marks first
        crud.models.Leaderboard.total_time.asc()      # Faster time as tiebreaker
    ).limit(limit).all()
    
    toppers = []
    for rank, (leaderboard, participant) in enumerate(toppers_data, start=1):
        toppers.append(
            schemas.TopperEntry(
                rank=rank,
                participant_id=participant.id,
                full_name=participant.full_name,
                email=participant.email,
                school_college=participant.school_college,
                total_marks=leaderboard.total_marks,
                total_time=float(leaderboard.total_time),
                avg_time=float(leaderboard.avg_time),
                total_questions=leaderboard.total_questions
            )
        )
    
    return schemas.ToppersResponse(
        category="leaderboard",
        total_participants=len(toppers),
        toppers=toppers
    )

@router.get("/participants/scores", response_model=schemas.ParticipantsScoresResponse)
def get_participants_with_scores(db: Session = Depends(get_db)):
    """
    Get all participants with their scores, sorted by marks (toppers first).
    
    - Returns all participants with their quiz performance
    - Sorted by total_marks (descending), then avg_time (ascending)
    - Includes rank, marks, percentage, and contact info
    - Used for admin dashboard and PDF export
    """
    results = crud.get_all_participants_with_scores(db)
    
    participants = []
    for rank, result in enumerate(results, start=1):
        # Calculate percentage
        percentage = (result.total_marks / result.total_questions * 100) if result.total_questions > 0 else 0.0
        
        participants.append(
            schemas.ParticipantScoreEntry(
                rank=rank,
                participant_id=result.id,
                full_name=result.full_name,
                email=result.email,
                school_college=result.school_college,
                contact_number=result.contact_number,
                total_marks=result.total_marks or 0,
                total_questions=result.total_questions or 0,
                percentage=round(percentage, 2),
                avg_time=round(result.avg_time or 0.0, 2)
            )
        )
    
    return schemas.ParticipantsScoresResponse(
        participants=participants,
        total_participants=len(participants)
    )
