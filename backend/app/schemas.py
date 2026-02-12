from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List

# Participant Schemas
class ParticipantCreate(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=255)
    contact_number: str = Field(..., pattern=r'^\d{10}$')
    email: EmailStr
    school_college: str = Field(..., min_length=1, max_length=255)

class ParticipantResponse(BaseModel):
    participant_id: int
    message: str

# Question Schemas
class QuestionOption(BaseModel):
    A: str
    B: str
    C: str
    D: str

class QuestionResponse(BaseModel):
    question_number: int
    text: str
    options: QuestionOption

class QuestionsListResponse(BaseModel):
    questions: List[QuestionResponse]

# Quiz Response Schemas
class QuizAnswerSubmit(BaseModel):
    question_number: int
    selected_answer: Optional[str] = Field(None, pattern=r'^[A-D]$')
    time_taken: int = Field(..., ge=0, le=10)

class QuizSubmit(BaseModel):
    participant_id: int
    responses: List[QuizAnswerSubmit]

class QuizSubmitResponse(BaseModel):
    message: str
    score: int
    total_questions: int
    correct_answers: int

# Statistics Schemas
class ParticipantStatistics(BaseModel):
    participant_id: int
    full_name: str
    email: str
    school_college: str
    total_questions: int
    total_marks: int
    avg_time: float
    
    class Config:
        from_attributes = True

class StatisticsListResponse(BaseModel):
    statistics: List[ParticipantStatistics]

# Admin - Question Upload Schemas
class QuestionUpload(BaseModel):
    question_number: int = Field(..., ge=1)
    text: str = Field(..., min_length=10)
    option1_text: str = Field(..., min_length=1, max_length=500)
    option1_is_correct: bool
    option2_text: str = Field(..., min_length=1, max_length=500)
    option2_is_correct: bool
    option3_text: str = Field(..., min_length=1, max_length=500)
    option3_is_correct: bool
    option4_text: str = Field(..., min_length=1, max_length=500)
    option4_is_correct: bool

class BulkQuestionUpload(BaseModel):
    questions: List[QuestionUpload]

class QuestionUploadResponse(BaseModel):
    message: str
    questions_added: int
    questions_updated: int
    total_questions: int

# Admin - Topper/Leaderboard Schemas
class TopperEntry(BaseModel):
    rank: int
    participant_id: int
    full_name: str
    email: str
    school_college: str
    total_marks: int
    total_time: float  # Sum of all response times in seconds
    avg_time: float  # Average time per question
    total_questions: int
    
    class Config:
        from_attributes = True

class ToppersResponse(BaseModel):
    category: str  # "marks", "time", or "combined"
    total_participants: int
    toppers: List[TopperEntry]

class LeaderboardRefreshResponse(BaseModel):
    message: str
    participants_updated: int

# Admin - Participant Scores Schemas
class ParticipantScoreEntry(BaseModel):
    rank: int
    participant_id: int
    full_name: str
    email: str
    school_college: str
    contact_number: str
    total_marks: int
    total_questions: int
    percentage: float
    avg_time: float
    
    class Config:
        from_attributes = True

class ParticipantsScoresResponse(BaseModel):
    participants: List[ParticipantScoreEntry]
    total_participants: int
