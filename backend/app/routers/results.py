from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import crud, schemas
from app.database import get_db

router = APIRouter(prefix="/api/results", tags=["results"])

@router.get("/statistics", response_model=schemas.StatisticsListResponse)
def get_all_statistics(db: Session = Depends(get_db)):
    """
    Get statistics for all participants.
    
    Returns:
    - participant_id: Unique participant identifier
    - full_name: Participant's full name
    - email: Participant's email
    - school_college: Participant's institution
    - total_questions: Number of questions answered
    - total_marks: Total correct answers (marks scored)
    - avg_time: Average time taken per question in seconds
    """
    results = crud.get_all_participant_statistics(db)
    
    statistics = []
    for row in results:
        statistics.append(
            schemas.ParticipantStatistics(
                participant_id=row.id,
                full_name=row.full_name,
                email=row.email,
                school_college=row.school_college,
                total_questions=row.total_questions or 0,
                total_marks=row.total_marks or 0,
                avg_time=round(float(row.avg_time or 0), 2)
            )
        )
    
    return schemas.StatisticsListResponse(statistics=statistics)
