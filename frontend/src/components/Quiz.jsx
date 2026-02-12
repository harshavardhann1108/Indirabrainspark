import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuestions, submitQuiz } from '../services/api';
import QuestionCard from './QuestionCard';
import Timer from './Timer';
import './Quiz.css';

function Quiz() {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [questionStatuses, setQuestionStatuses] = useState([]);
    const [lockedQuestions, setLockedQuestions] = useState(new Set());
    const [questionTimeLeft, setQuestionTimeLeft] = useState(10); // 10 seconds per question
    const [isLoading, setIsLoading] = useState(true);
    const [questionStartTimes, setQuestionStartTimes] = useState({});

    // Fetch questions on component mount
    useEffect(() => {
        console.log('=== QUIZ COMPONENT MOUNTED ===');
        const participantId = sessionStorage.getItem('participantId');
        console.log('Participant ID from sessionStorage:', participantId);

        if (!participantId) {
            console.log('No participant ID found, redirecting to /register');
            navigate('/register');
            return;
        }

        const fetchQuestions = async () => {
            try {
                console.log('Fetching questions from API...');
                const data = await getQuestions();
                console.log('Questions received:', data);
                console.log('Number of questions:', data.questions?.length);

                setQuestions(data.questions);
                setQuestionStatuses(new Array(data.questions.length).fill('not-visited'));
                setQuestionStartTimes({});
                setIsLoading(false);
                console.log('Quiz initialized successfully');
            } catch (error) {
                console.error('=== ERROR FETCHING QUESTIONS ===');
                console.error('Error object:', error);
                console.error('Error message:', error.message);
                console.error('Error response:', error.response);
                alert('Failed to load questions. Please try again.');
                navigate('/');
            }
        };

        fetchQuestions();
    }, [navigate]);

    // Define handleSubmitQuiz first (needed by handleTimeExpired)
    const handleSubmitQuiz = useCallback(async () => {
        const participantId = sessionStorage.getItem('participantId');
        console.log('Submitting quiz for participant:', participantId);

        // Build responses array
        const responses = questions.map((question, index) => {
            const answer = answers[index];
            const timeTaken = answer?.start_time
                ? Math.min(Math.floor((Date.now() - answer.start_time) / 1000), 10)
                : 10;

            return {
                question_number: question.question_number,
                selected_answer: answer?.selected_answer || null,
                time_taken: timeTaken
            };
        });

        try {
            const response = await submitQuiz({
                participant_id: parseInt(participantId),
                responses: responses
            });

            console.log('Quiz submitted successfully:', response);
            sessionStorage.setItem('quizScore', response.score);
            sessionStorage.setItem('totalQuestions', response.total_questions);
            navigate('/thank-you');
        } catch (error) {
            console.error('Error submitting quiz:', error);
            alert('Failed to submit quiz. Please try again.');
        }
    }, [questions, answers, questionStartTimes, navigate]);

    // Define handleTimeExpired (needs handleSubmitQuiz)
    const handleTimeExpired = useCallback(() => {
        try {
            console.log('Timer expired for question:', currentQuestionIndex);

            // Lock the current question
            setLockedQuestions(prev => new Set([...prev, currentQuestionIndex]));

            // Mark as not-answered if no answer was selected
            if (!answers[currentQuestionIndex]) {
                setQuestionStatuses(prev => {
                    const newStatuses = [...prev];
                    newStatuses[currentQuestionIndex] = 'not-answered';
                    return newStatuses;
                });
            }

            // Auto-skip to next question or submit if last question
            // Small delay to ensure state updates complete
            setTimeout(() => {
                if (currentQuestionIndex < questions.length - 1) {
                    console.log('Moving to next question');
                    setCurrentQuestionIndex(prev => prev + 1);
                } else {
                    console.log('Last question - submitting quiz');
                    handleSubmitQuiz();
                }
            }, 100);
        } catch (error) {
            console.error('Error in handleTimeExpired:', error);
            // Fallback: try to navigate to next question or submit
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                handleSubmitQuiz();
            }
        }
    }, [currentQuestionIndex, questions.length, answers, handleSubmitQuiz]);

    // Use a ref to access the latest handleTimeExpired callback in the timer effect
    // without triggering re-runs of the effect (which would reset the timer interval)
    const handleTimeExpiredRef = useRef(handleTimeExpired);

    useEffect(() => {
        handleTimeExpiredRef.current = handleTimeExpired;
    }, [handleTimeExpired]);

    // Reset timer when question changes
    useEffect(() => {
        if (questions.length > 0 && !lockedQuestions.has(currentQuestionIndex)) {
            setQuestionTimeLeft(10);
            if (!questionStartTimes[currentQuestionIndex]) {
                setQuestionStartTimes(prev => ({
                    ...prev,
                    [currentQuestionIndex]: Date.now()
                }));
            }
        }
    }, [currentQuestionIndex, questions.length, lockedQuestions]); // eslint-disable-line react-hooks/exhaustive-deps

    // Per-question timer countdown
    useEffect(() => {
        if (isLoading || questions.length === 0 || lockedQuestions.has(currentQuestionIndex)) return;

        const timer = setInterval(() => {
            setQuestionTimeLeft(prev => {
                if (prev <= 1) {
                    // Time's up for this question - lock it and move to next
                    if (handleTimeExpiredRef.current) {
                        handleTimeExpiredRef.current();
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isLoading, questions, currentQuestionIndex, lockedQuestions]);

    const handleAnswerSelect = (answer) => {
        if (lockedQuestions.has(currentQuestionIndex)) return;

        const questionNum = questions[currentQuestionIndex].question_number;

        setAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: {
                question_number: questionNum,
                selected_answer: answer,
                start_time: questionStartTimes[currentQuestionIndex]
            }
        }));

        // Update status to answered
        setQuestionStatuses(prev => {
            const newStatuses = [...prev];
            newStatuses[currentQuestionIndex] = 'answered';
            return newStatuses;
        });
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            // Mark current as not-answered if no answer selected and not already marked
            if (!answers[currentQuestionIndex] && questionStatuses[currentQuestionIndex] === 'not-visited') {
                setQuestionStatuses(prev => {
                    const newStatuses = [...prev];
                    newStatuses[currentQuestionIndex] = 'not-answered';
                    return newStatuses;
                });
            }
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    if (isLoading) {
        return (
            <div className="quiz-container">
                <div className="loading">Loading questions...</div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="quiz-container">
                <div className="error">No questions available.</div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswer = answers[currentQuestionIndex]?.selected_answer;
    const isCurrentLocked = lockedQuestions.has(currentQuestionIndex);

    return (
        <div className="quiz-container">
            <div className="quiz-header">
                <h1 className="quiz-title">Online Test - IU Quiz Preparation</h1>
                <div className="timer-wrapper">
                    <Timer timeLeft={questionTimeLeft} />
                </div>
            </div>

            <div className="quiz-main">
                <div className="quiz-content">
                    <QuestionCard
                        questionNumber={currentQuestionIndex + 1}
                        totalQuestions={questions.length}
                        questionText={currentQuestion?.text || 'Loading question...'}
                        options={currentQuestion?.options}
                        selectedAnswer={currentAnswer}
                        onAnswerSelect={handleAnswerSelect}
                        isLocked={isCurrentLocked}
                    />

                    <div className="quiz-controls">
                        {currentQuestionIndex < questions.length - 1 ? (
                            <button
                                className="control-btn next-btn"
                                onClick={handleNext}
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                className="control-btn submit-btn"
                                onClick={handleSubmitQuiz}
                            >
                                Submit Test
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Quiz;
