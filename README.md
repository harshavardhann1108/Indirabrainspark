# Indira BrainSpark Quiz Application

A fast-paced, timed quiz application for Indira University built with React (Vite) and FastAPI.

## 🎯 Features

- **10-Second Timer**: Each question has a 10-second countdown with auto-advance
- **Modern UI**: Professional design with smooth animations and transitions
- **Real-time Validation**: Form validation with instant feedback
- **Score Tracking**: Automatic scoring and result display
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **PostgreSQL Database**: Robust data storage for participants and quiz responses

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.10 or higher) - [Download](https://www.python.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **pip** (Python package manager)
- **npm** (Node package manager)

---

## 🚀 Quick Start

### 1. Clone or Navigate to Project Directory

```bash
cd "c:\IU Quiz"
```

### 2. Database Setup

#### Option A: Local PostgreSQL

1. **Install PostgreSQL** if not already installed
2. **Create Database**:
   ```bash
   psql -U postgres
   CREATE DATABASE indira_brainstorm;
   \q
   ```

3. **Update Backend .env** file with your PostgreSQL credentials:
   ```
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/indira_brainstorm
   CORS_ORIGINS=http://localhost:5173
   ```

#### Option B: Cloud PostgreSQL (Recommended for Easy Setup)

Use a free cloud PostgreSQL service like **Supabase** or **Neon**:

1. Create a free account at [Supabase](https://supabase.com/) or [Neon](https://neon.tech/)
2. Create a new project and database
3. Copy the connection string
4. Update `backend/.env`:
   ```
   DATABASE_URL=your_cloud_postgres_connection_string
   CORS_ORIGINS=http://localhost:5173
   ```

### 3. Backend Setup

```bash
cd backend

# Install Python dependencies
pip install fastapi uvicorn[standard] sqlalchemy pydantic python-dotenv python-multipart

# For PostgreSQL connection, install ONE of these:
# Option 1: psycopg2-binary (may fail on Windows)
pip install psycopg2-binary

# Option 2: If above fails, use psycopg2 (requires PostgreSQL installed)
pip install psycopg2

# Option 3: Use asyncpg (async driver)
pip install asyncpg

# Seed the database with questions
python seed_questions.py
```

**Note**: If you encounter errors installing `psycopg2-binary` on Windows, you can:
- Install PostgreSQL locally first, then try `pip install psycopg2`
- Or use a cloud PostgreSQL service (Supabase/Neon) which doesn't require local PostgreSQL

### 4. Frontend Setup

```bash
cd ../frontend

# Dependencies are already installed during Vite setup
# If needed, run:
npm install
```

### 5. Run the Application

#### Terminal 1 - Backend Server:
```bash
cd backend
uvicorn app.main:app --reload
```
Backend will run on: **http://localhost:8000**

#### Terminal 2 - Frontend Server:
```bash
cd frontend
npm run dev
```
Frontend will run on: **http://localhost:5173**

### 6. Access the Application

Open your browser and navigate to: **http://localhost:5173**

---

## 📁 Project Structure

```
c:\IU Quiz\
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   │   ├── participants.py    # Participant registration API
│   │   │   ├── results.py         # Participant Results API
│   │   │   └── quiz.py            # Quiz questions & submission API
│   │   ├── __init__.py
│   │   ├── main.py                # FastAPI application
│   │   ├── database.py            # Database connection
│   │   ├── models.py              # SQLAlchemy models
│   │   ├── schemas.py             # Pydantic schemas
│   │   └── crud.py                # Database operations
│   ├── seed_questions.py          # Database seeding script
│   ├── requirements.txt           # Python dependencies
│   └── .env                       # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Welcome.jsx        # Welcome page
│   │   │   ├── RegistrationForm.jsx  # Registration form
│   │   │   ├── Quiz.jsx           # Main quiz component
│   │   │   ├── Timer.jsx          # Countdown timer
│   │   │   ├── ProgressBar.jsx    # Progress indicator
│   │   │   ├── QuestionCard.jsx   # Question display
│   │   │   └── ThankYou.jsx       # Thank you page
│   │   ├── services/
│   │   │   └── api.js             # API service layer
│   │   ├── App.jsx                # Main app with routing
│   │   ├── App.css
│   │   ├── index.css              # Global styles
│   │   └── main.jsx               # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── .env                       # Frontend environment variables
│
└── README.md                      # This file
```

---

## 🔌 API Endpoints

### Base URL: `http://localhost:8000`

#### 1. Register Participant
- **POST** `/api/participants`
- **Body**:
  ```json
  {
    "full_name": "John Doe",
    "contact_number": "9876543210",
    "email": "john@example.com",
    "school_college": "XYZ College"
  }
  ```
- **Response**:
  ```json
  {
    "participant_id": 1,
    "message": "Welcome to Indira BrainSpark Quiz API"
  }
  ```

#### 2. Get Quiz Questions
- **GET** `/api/quiz/questions`
- **Response**:
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
      }
      // ... 9 more questions
    ]
  }
  ```

#### 3. Submit Quiz
- **POST** `/api/quiz/submit`
- **Body**:
  ```json
  {
    "participant_id": 1,
    "responses": [
      {
        "question_number": 1,
        "selected_answer": "C",
        "time_taken": 7
      }
      // ... up to 10 responses
    ]
  }
  ```
- **Response**:
  ```json
  {
    "message": "Quiz submitted successfully",
    "score": 8,
    "total_questions": 10,
    "correct_answers": 8
  }
  ```

#### 4. API Documentation
- **Interactive Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

---

## 🗄️ Database Schema

### Table: `participants`
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| full_name | VARCHAR(255) | NOT NULL |
| contact_number | VARCHAR(15) | NOT NULL |
| email | VARCHAR(255) | NOT NULL, UNIQUE |
| school_college | VARCHAR(255) | NOT NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |

### Table: `questions`
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| question_number | INTEGER | NOT NULL, UNIQUE |
| text | TEXT | NOT NULL |
| option1_text | VARCHAR(500) | NOT NULL |
| option1_is_correct | BOOLEAN | NOT NULL |
| option2_text | VARCHAR(500) | NOT NULL |
| option2_is_correct | BOOLEAN | NOT NULL |
| option3_text | VARCHAR(500) | NOT NULL |
| option3_is_correct | BOOLEAN | NOT NULL |
| option4_text | VARCHAR(500) | NOT NULL |
| option4_is_correct | BOOLEAN | NOT NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |

### Table: `quiz_responses`
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| participant_id | INTEGER | FOREIGN KEY → participants(id) |
| question_number | INTEGER | NOT NULL |
| selected_answer | VARCHAR(1) | NULL (A, B, C, D) |
| time_taken | INTEGER | NULL (0-10 seconds) |
| is_correct | BOOLEAN | NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |

---

## 🎨 Design & Styling

### Color Scheme
- **Primary**: `#1e3a8a` (Deep Blue)
- **Secondary**: `#7c3aed` (Purple)
- **Success**: `#10b981` (Green)
- **Warning**: `#f59e0b` (Orange)
- **Danger**: `#ef4444` (Red)
- **Background**: `#f8fafc` (Light Gray)

### Key Features
- Modern gradient backgrounds
- Smooth animations and transitions
- Responsive design (mobile-first)
- Accessible focus states
- Professional typography

---

## 🧪 Testing the Application

### Manual Testing Checklist

1. **Welcome Page**:
   - ✅ Verify branding and tagline display
   - ✅ Click "Start Quiz" → navigates to registration

2. **Registration**:
   - ✅ Test form validation (email format, 10-digit phone)
   - ✅ Submit valid data → navigates to quiz
   - ✅ Try duplicate email → shows error

3. **Quiz**:
   - ✅ Timer counts down from 10 to 0
   - ✅ Auto-advances when timer hits 0
   - ✅ Select answer → highlights correctly
   - ✅ Progress bar updates
   - ✅ All 10 questions display
   - ✅ After Q10 → navigates to thank you page

4. **Thank You Page**:
   - ✅ Displays participant name
   - ✅ Shows score
   - ✅ Cannot navigate back to quiz

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: `psycopg2-binary` installation fails
- **Solution 1**: Install PostgreSQL locally, then `pip install psycopg2`
- **Solution 2**: Use cloud PostgreSQL (Supabase/Neon)
- **Solution 3**: Use `asyncpg` instead and update database.py

**Problem**: Database connection error
- **Solution**: Check `.env` file has correct `DATABASE_URL`
- Verify PostgreSQL is running: `pg_isready` (if local)

**Problem**: "No questions found" error
- **Solution**: Run `python seed_questions.py` to populate questions

### Frontend Issues

**Problem**: API calls fail with CORS error
- **Solution**: Ensure backend is running on port 8000
- Check `backend/.env` has `CORS_ORIGINS=http://localhost:5173`

**Problem**: Timer doesn't work
- **Solution**: Check browser console for errors
- Ensure questions are loaded from API

---

## 📦 Deployment

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy `dist/` folder
3. Set environment variable: `VITE_API_URL=https://your-backend-url.com`

### Backend (Render/Railway)
1. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
2. Set environment variables:
   - `DATABASE_URL` (production PostgreSQL)
   - `CORS_ORIGINS` (production frontend URL)

### Database (Cloud)
- Use Supabase, Neon, or Railway PostgreSQL
- Run `seed_questions.py` on production database

---

## 📝 Quiz Questions

The application includes 10 carefully curated questions covering:
- General Knowledge
- Indian Geography & Politics
- Current Affairs
- Science & Technology
- Economics

All questions are seeded from the `seed_questions.py` script based on content from `Inetractive Quiz.docx`.

---

## 🤝 Contributing

This is a project for Indira University. For modifications:
1. Update questions in `backend/seed_questions.py`
2. Modify UI components in `frontend/src/components/`
3. Test thoroughly before deployment

---

## 📄 License

© 2026 Indira University. All rights reserved.

---

## 🎓 About Indira University

**Admissions Open 2026-27**

For more information, visit: [Indira University Website]

---

## 💡 Support

For technical issues or questions:
- Check the troubleshooting section above
- Review API documentation at http://localhost:8000/docs
- Ensure all prerequisites are installed correctly

---

**Built with ❤️ for Indira University**
