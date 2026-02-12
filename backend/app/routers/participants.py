from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app import crud, schemas
from app.database import get_db

router = APIRouter(prefix="/api/participants", tags=["participants"])

@router.post("", response_model=schemas.ParticipantResponse)
def register_participant(participant: schemas.ParticipantCreate, db: Session = Depends(get_db)):
    """
    Register a new participant for the quiz.
    
    - Validates all required fields
    - Checks email uniqueness
    - Returns participant_id on success
    """
    # Check if email already exists
    existing_participant = crud.get_participant_by_email(db, participant.email)
    if existing_participant:
        raise HTTPException(
            status_code=400,
            detail="Email already registered. Please use a different email address."
        )
    
    try:
        db_participant = crud.create_participant(db, participant)
        return schemas.ParticipantResponse(
            participant_id=db_participant.id,
            message="Registration successful"
        )
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Email already registered. Please use a different email address."
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
