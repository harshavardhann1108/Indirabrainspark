# Full-Stack Quiz Website Development Prompt for Cursor AI

## Project Overview
Create a complete full-stack quiz website called "Indira BrainStorm" - a fast-paced, timed quiz application for Indira University. The application should have a modern, professional UI with smooth transitions between pages.

## Tech Stack Requirements

### Frontend
- **React.js** (with Create React App or Vite)
- **CSS3** (or Tailwind CSS for modern styling)
- **React Router** for navigation
- **Axios** for API calls
- **React hooks** (useState, useEffect, useContext)

### Backend
- **Python 3.10+**
- **FastAPI** framework
- **Pydantic** for data validation
- **SQLAlchemy** as ORM
- **Psycopg2** or **asyncpg** for PostgreSQL connection
- **CORS middleware** enabled
- **Uvicorn** as ASGI server

### Database
- **PostgreSQL** (version 14 or higher)

---

## Important: Document Reference
**CRITICAL:** There is a Word document named `Inetractive_Quiz.docx` that contains ALL the quiz content including:
- Welcome page content and quiz rules
- All 10 quiz questions with their 4 options each
- Thank you page content
- Branding details (Indira BrainStorm, Indira University)

**YOU MUST:**
1. Read and extract ALL content from `Inetractive_Quiz.docx`
2. Use the EXACT questions and options from the document
3. Use the EXACT branding, tagline, and welcome text
4. Follow the page flow described in the document
5. Include all quiz rules and instructions from the document

---

## Application Flow & Pages

### Page 1: Welcome/Introduction Page
**Route:** `/`

**Content to extract from document:**
- Main heading: "Indira BrainStorm"
- Tagline: "Think Fast. Think Smart."
- Welcome message
- Quiz format details (10 questions, 10 seconds per question)
- Timer visibility notice
- Auto-advance explanation
- "All the best" message

**UI Requirements:**
- Eye-catching hero section
- Clean, modern design with Indira University branding
- Clear call-to-action button "Start Quiz" or "Begin"
- Responsive layout
- Professional color scheme (blue/purple tones recommended)

---

### Page 2: Participant Details Form
**Route:** `/register`

**Form Fields (as per document):**
1. Full Name (text input, required)
2. Contact Number (tel input, required, validation: 10 digits)
3. Email ID (email input, required, validation: valid email format)
4. Current School / College Name (text input, required)

**Validation Requirements:**
- All fields are mandatory
- Email must be valid format
- Contact number must be exactly 10 digits
- Show real-time validation errors
- Prevent duplicate email submissions (check in database)

**UI Requirements:**
- Clean form design with proper spacing
- Input field labels clearly visible
- Error messages displayed inline
- Submit button only enabled when form is valid
- Loading state while submitting

**Backend API:**
- `POST /api/participants` - Create new participant
- Return participant_id for tracking quiz responses
- Store participant data in PostgreSQL

---

### Page 3: Quiz Interface
**Route:** `/quiz`

**CRITICAL Requirements:**

1. **Question Display:**
   - Extract all 10 questions from `Inetractive_Quiz.docx`
   - Display question number (Question 1/10, Question 2/10, etc.)
   - Show question text clearly
   - Display 4 options as radio buttons or clickable cards
   - Options labeled as A, B, C, D

2. **Timer Functionality:**
   - 10-second countdown timer per question
   - Visible, prominent timer display (countdown format: 10, 9, 8...)
   - Timer should be visually attention-grabbing (color change when <5 seconds)
   - **AUTO-ADVANCE:** When timer reaches 0, automatically move to next question
   - If no answer selected when time expires, record as "not answered"
   - Reset timer to 10 seconds for each new question

3. **Answer Selection:**
   - User can select only one option per question
   - Visual feedback when option is selected (highlight/check mark)
   - User can change their answer before time expires
   - Record time taken to answer (for analytics)

4. **Progress Indicator:**
   - Show current question number / total questions
   - Progress bar showing quiz completion percentage
   - Optionally show which questions have been answered

5. **Navigation:**
   - No manual "Next" button - timer controls progression
   - No "Previous" button - cannot go back to previous questions
   - After Question 10, automatically navigate to thank you page

**State Management:**
- Track current question index
- Store selected answers for all questions
- Calculate time taken per question
- Store participant_id from registration

**Backend API:**
- `POST /api/quiz/submit` - Submit all quiz responses at the end
- Payload should include:
  - participant_id
  - Array of answers with question_number, selected_answer, time_taken

---

### Page 4: Thank You Page
**Route:** `/thank-you`

**Content to extract from document:**
- Thank you heading
- Success message
- Appreciation text about learners
- "Stay tuned for results" message
- Admissions information

**UI Requirements:**
- Celebratory/success design (confetti animation optional)
- Display participant's name (from registration)
- Professional closing message
- No navigation back to quiz (prevent retaking)
- Optional: Display quiz statistics (time taken, questions answered)

---

## Database Schema

### Table 1: `participants`
```sql
CREATE TABLE participants (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    contact_number VARCHAR(15) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    school_college VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table 2: `questions`
**CRITICAL SCHEMA - USE EXACTLY AS SPECIFIED:**

```sql
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    question_number INTEGER NOT NULL UNIQUE,
    text TEXT NOT NULL,
    option1_text VARCHAR(500) NOT NULL,
    option1_is_correct BOOLEAN NOT NULL,
    option2_text VARCHAR(500) NOT NULL,
    option2_is_correct BOOLEAN NOT NULL,
    option3_text VARCHAR(500) NOT NULL,
    option3_is_correct BOOLEAN NOT NULL,
    option4_text VARCHAR(500) NOT NULL,
    option4_is_correct BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Important:** 
- Exactly ONE option must have `is_correct = TRUE` per question
- All 10 questions from the document must be seeded into this table
- Extract questions and correct answers from `Inetractive_Quiz.docx`

### Table 3: `quiz_responses`
```sql
CREATE TABLE quiz_responses (
    id SERIAL PRIMARY KEY,
    participant_id INTEGER REFERENCES participants(id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL,
    selected_answer VARCHAR(1),  -- 'A', 'B', 'C', 'D', or NULL if not answered
    time_taken INTEGER,  -- seconds taken to answer (0-10)
    is_correct BOOLEAN,  -- calculated by comparing with questions table
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(participant_id, question_number)  -- One response per question per participant
);
```

---

## Backend API Endpoints

### 1. **POST /api/participants**
- Create new participant
- Validate email uniqueness
- Return participant_id and success message

**Request Body:**
```json
{
    "full_name": "John Doe",
    "contact_number": "9876543210",
    "email": "john@example.com",
    "school_college": "XYZ College"
}
```

**Response:**
```json
{
    "participant_id": 123,
    "message": "Registration successful"
}
```

### 2. **GET /api/questions**
- Fetch all 10 questions in order
- Return question text and options (without revealing correct answers)

**Response:**
```json
{
    "questions": [
        {
            "question_number": 1,
            "text": "Which part of the human body contains the maximum number of bones?",
            "options": {
                "A": "Spine",
                "B": "Skull",
                "C": "Hands and feet",
                "D": "Rib cage"
            }
        },
        // ... 9 more questions
    ]
}
```

### 3. **POST /api/quiz/submit**
- Submit all quiz responses
- Calculate correctness for each answer
- Store responses in database
- Return score and completion message

**Request Body:**
```json
{
    "participant_id": 123,
    "responses": [
        {
            "question_number": 1,
            "selected_answer": "C",
            "time_taken": 7
        },
        // ... up to 10 responses
    ]
}
```

**Response:**
```json
{
    "message": "Quiz submitted successfully",
    "score": 8,
    "total_questions": 10,
    "correct_answers": 8
}
```

### 4. **GET /api/admin/results** (Optional - for admin dashboard)
- Fetch all quiz results
- Include participant details and scores
- For administrative review

---

## Frontend Component Structure

```
src/
├── components/
│   ├── Welcome.jsx           # Page 1: Welcome screen
│   ├── RegistrationForm.jsx  # Page 2: Participant details form
│   ├── Quiz.jsx              # Page 3: Main quiz interface
│   │   ├── QuestionCard.jsx  # Individual question component
│   │   ├── Timer.jsx         # Countdown timer component
│   │   └── ProgressBar.jsx   # Quiz progress indicator
│   └── ThankYou.jsx          # Page 4: Thank you page
├── services/
│   └── api.js                # Axios API service functions
├── context/
│   └── QuizContext.js        # Global state management (optional)
├── App.jsx                   # Main app with routing
├── App.css                   # Global styles
└── index.js                  # Entry point
```

---

## Backend Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app initialization
│   ├── database.py          # PostgreSQL connection setup
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas for validation
│   ├── crud.py              # Database operations
│   └── routers/
│       ├── participants.py  # Participant endpoints
│       └── quiz.py          # Quiz endpoints
├── seed_questions.py        # Script to populate questions from document
├── requirements.txt         # Python dependencies
└── .env                     # Environment variables (DB credentials)
```

---

## Critical Implementation Details

### Timer Logic (React)
```javascript
// Use useEffect with setInterval
// Countdown from 10 to 0
// When timer hits 0:
//   - Save current answer (or null if not answered)
//   - Move to next question or finish quiz
//   - Reset timer to 10
```

### Auto-Advance Logic
- When timer reaches 0 OR user clicks an answer, wait 0.5 seconds then advance
- Smooth transition between questions
- Final question should navigate to thank you page

### Seed Script (Python)
Create a `seed_questions.py` script that:
1. Reads `Inetractive_Quiz.docx` using python-docx library
2. Extracts all 10 questions with their options
3. Determines correct answer for each (you may need to manually set this)
4. Inserts into `questions` table

**Note:** Since correct answers aren't explicitly marked in the document, create a separate reference file or hardcode them based on general knowledge.

---

## Environment Setup

### Frontend `.env`
```
REACT_APP_API_URL=http://localhost:8000/api
```

### Backend `.env`
```
DATABASE_URL=postgresql://username:password@localhost:5432/indira_brainstorm
CORS_ORIGINS=http://localhost:3000
```

---

## Dependencies

### Frontend `package.json` (key dependencies)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0"
  }
}
```

### Backend `requirements.txt`
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
pydantic==2.5.0
python-dotenv==1.0.0
python-multipart==0.0.6
python-docx==1.1.0
```

---

## Styling Guidelines

### Color Scheme (Suggested)
- Primary: #1e3a8a (Deep Blue - for Indira University branding)
- Secondary: #7c3aed (Purple - for accents)
- Success: #10b981 (Green - for correct answers, completion)
- Warning: #f59e0b (Orange - for timer warnings)
- Danger: #ef4444 (Red - for time running out)
- Background: #f8fafc (Light gray)
- Text: #1e293b (Dark gray)

### Design Principles
- Clean, modern interface
- Large, readable fonts
- High contrast for accessibility
- Smooth animations and transitions
- Mobile-responsive design (works on all screen sizes)
- Professional look suitable for educational institution

---

## Testing Checklist

### Frontend
- [ ] Welcome page displays correctly with content from document
- [ ] Registration form validates all fields
- [ ] Email uniqueness check works
- [ ] Quiz loads all 10 questions from API
- [ ] Timer counts down from 10 to 0
- [ ] Auto-advance works when timer hits 0
- [ ] Answer selection is tracked correctly
- [ ] Progress bar updates properly
- [ ] Thank you page shows participant name
- [ ] No ability to retake quiz without re-registering

### Backend
- [ ] All API endpoints return correct responses
- [ ] Database connections are stable
- [ ] CORS is properly configured
- [ ] Participant email uniqueness is enforced
- [ ] Quiz responses are saved correctly
- [ ] Correct answers are calculated properly
- [ ] Questions are seeded from document

### Database
- [ ] All tables are created with correct schema
- [ ] Foreign key relationships work
- [ ] All 10 questions are seeded correctly
- [ ] Duplicate participant emails are prevented

---

## Deployment Considerations

### Frontend Deployment (Vercel/Netlify)
- Build command: `npm run build`
- Output directory: `build/`
- Environment variables configured

### Backend Deployment (Render/Railway)
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Environment variables (DATABASE_URL, CORS_ORIGINS)
- Auto-deploy on git push

### Database (Supabase/Neon)
- PostgreSQL 14+ instance
- Run migrations to create tables
- Run seed script to populate questions

---

## Additional Features (Optional Enhancements)

1. **Admin Dashboard:**
   - View all participants and their scores
   - Export results to CSV
   - Analytics on question difficulty (which questions are answered incorrectly most often)

2. **Leaderboard:**
   - Show top scorers
   - Display average time per question

3. **Email Notifications:**
   - Send confirmation email on registration
   - Send results email after quiz completion

4. **Quiz Analytics:**
   - Track time spent per question
   - Identify most difficult questions
   - Generate performance reports

---

## Success Criteria

The project is complete when:
1. ✅ All 4 pages are fully functional
2. ✅ Timer works correctly with auto-advance
3. ✅ All 10 questions from document are displayed
4. ✅ User registration saves to database
5. ✅ Quiz responses are saved and scored correctly
6. ✅ Application is responsive on mobile and desktop
7. ✅ No bugs in core functionality
8. ✅ Code is clean, well-commented, and organized
9. ✅ README.md with setup instructions is included
10. ✅ Application can be deployed to production

---

## Development Workflow

1. **Phase 1: Setup**
   - Initialize React app
   - Setup FastAPI project structure
   - Create PostgreSQL database
   - Install all dependencies

2. **Phase 2: Database**
   - Create all tables
   - Write seed script to extract and populate questions from document
   - Test database connections

3. **Phase 3: Backend APIs**
   - Implement participant registration endpoint
   - Implement questions fetch endpoint
   - Implement quiz submission endpoint
   - Test all endpoints with Postman/Thunder Client

4. **Phase 4: Frontend - Static Pages**
   - Create Welcome page with content from document
   - Create Registration form
   - Create Thank you page
   - Setup React Router

5. **Phase 5: Frontend - Quiz Logic**
   - Build Quiz component
   - Implement timer with countdown
   - Implement auto-advance logic
   - Connect to backend APIs
   - Test end-to-end flow

6. **Phase 6: Styling & Polish**
   - Apply consistent styling
   - Add animations and transitions
   - Ensure responsive design
   - Test on different browsers

7. **Phase 7: Testing & Debugging**
   - Test all user flows
   - Fix any bugs
   - Optimize performance

8. **Phase 8: Deployment**
   - Deploy backend to Render/Railway
   - Deploy frontend to Vercel/Netlify
   - Deploy database to Supabase/Neon
   - Test production environment

---

## IMPORTANT REMINDERS

1. **READ THE DOCUMENT FIRST:** Before writing any code, extract ALL content from `Inetractive_Quiz.docx`
2. **EXACT CONTENT:** Use the exact questions, options, branding, and messages from the document
3. **DATABASE SCHEMA:** Follow the specified schema EXACTLY for the questions table
4. **TIMER AUTO-ADVANCE:** This is a critical feature - timer must automatically move to next question
5. **10 SECONDS PER QUESTION:** Strict timing requirement
6. **NO GOING BACK:** Users cannot navigate to previous questions
7. **PROFESSIONAL UI:** This is for a university - design should be polished and professional

---

## Expected Deliverables

1. Complete React frontend with all 4 pages
2. Complete FastAPI backend with all endpoints
3. PostgreSQL database with all tables and seeded questions
4. README.md with:
   - Setup instructions
   - How to run locally
   - How to seed the database
   - API documentation
   - Environment variables needed
5. Clean, well-organized code with comments
6. Working application that matches all requirements

---

**START BUILDING NOW!** Follow this prompt step-by-step and create a professional, fully-functional quiz website for Indira BrainStorm. Good luck! 🚀
