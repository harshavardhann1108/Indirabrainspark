import './QuestionNavigation.css';

function QuestionNavigation({
    totalQuestions,
    currentQuestion,
    questionStatuses,
    lockedQuestions = new Set(),
    onQuestionClick
}) {
    const getStatusClass = (questionNum) => {
        const index = questionNum - 1;

        // Check if locked first
        if (lockedQuestions.has(index)) {
            return 'locked';
        }

        // Then check if current
        if (questionNum === currentQuestion) {
            return 'current';
        }

        // Finally check status
        const status = questionStatuses[index];
        return status || 'not-visited';
    };

    return (
        <div className="question-navigation">
            <div className="timer-section">
                <div className="time-label">Time Left</div>
                <div className="time-display" id="quiz-timer">
                    00:00:10
                </div>
            </div>

            <div className="questions-grid-container">
                <div className="section-title">Questions</div>
                <div className="questions-grid">
                    {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((num) => (
                        <button
                            key={num}
                            className={`question-btn ${getStatusClass(num)}`}
                            onClick={() => onQuestionClick(num)}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            </div>

            <div className="legend">
                <div className="legend-title">Legend</div>
                <div className="legend-items">
                    <div className="legend-item">
                        <span className="legend-box answered"></span>
                        <span>Answered</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-box not-answered"></span>
                        <span>Not Answered</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-box current"></span>
                        <span>Current</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-box marked"></span>
                        <span>Marked for Review</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-box locked"></span>
                        <span>Timed Out</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-box not-visited"></span>
                        <span>Not Visited</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QuestionNavigation;
