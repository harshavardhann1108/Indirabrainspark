from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas, models
from app.database import get_db
from typing import List

router = APIRouter(prefix="/api/quiz", tags=["quiz"])

@router.get("/questions", response_model=schemas.QuestionsListResponse)
def get_questions(db: Session = Depends(get_db)):
    """
    Get all 10 quiz questions with their options.
    
    - Returns questions in order (1-10)
    - Does NOT reveal which option is correct
    """
    questions = crud.get_all_questions(db)
    
    if not questions:
        return schemas.QuestionsListResponse(questions=[])
    
    questions_response = []
    for q in questions:
        questions_response.append(
            schemas.QuestionResponse(
                question_number=q.question_number,
                text=q.text,
                options=schemas.QuestionOption(
                    A=q.option1_text,
                    B=q.option2_text,
                    C=q.option3_text,
                    D=q.option4_text
                )
            )
        )
    
    return schemas.QuestionsListResponse(questions=questions_response)

@router.post("/submit", response_model=schemas.QuizSubmitResponse)
def submit_quiz(quiz_data: schemas.QuizSubmit, db: Session = Depends(get_db)):
    """
    Submit quiz responses and calculate score.
    
    - Accepts participant_id and array of responses
    - Calculates correctness for each answer
    - Stores all responses in database
    - Returns total score
    """
    # Verify participant exists
    participant = db.query(models.Participant).filter(
        models.Participant.id == quiz_data.participant_id
    ).first()
    
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    
    correct_count = 0
    total_questions = len(quiz_data.responses)
    
    # Process each response
    for response in quiz_data.responses:
        # Get the question to check correct answer
        question = crud.get_question_by_number(db, response.question_number)
        
        if not question:
            continue
        
        # Determine if answer is correct
        is_correct = False
        if response.selected_answer:
            option_map = {
                'A': question.option1_is_correct,
                'B': question.option2_is_correct,
                'C': question.option3_is_correct,
                'D': question.option4_is_correct
            }
            is_correct = option_map.get(response.selected_answer, False)
            if is_correct:
                correct_count += 1
        
        # Save response to database
        try:
            crud.create_quiz_response(
                db=db,
                participant_id=quiz_data.participant_id,
                question_number=response.question_number,
                selected_answer=response.selected_answer,
                time_taken=response.time_taken,
                is_correct=is_correct
            )
        except Exception as e:
            # Continue even if one response fails
            print(f"Error saving response for question {response.question_number}: {e}")
            continue
    
    return schemas.QuizSubmitResponse(
        message="Quiz submitted successfully",
        score=correct_count,
        total_questions=total_questions,
        correct_answers=correct_count
    )
