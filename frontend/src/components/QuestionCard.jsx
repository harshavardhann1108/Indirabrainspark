import './QuestionCard.css';

function QuestionCard({
    questionNumber,
    totalQuestions,
    questionText,
    options,
    selectedAnswer,
    onAnswerSelect,
    isLocked = false
}) {
    const optionLabels = ['A', 'B', 'C', 'D'];

    return (
        <div className="question-card">
            <div className="question-header">
                <h2 className="question-title">Question {questionNumber}</h2>
            </div>

            <div className="question-text">
                {questionText}
            </div>

            <div className="options-list">
                {options && optionLabels.map((label) => {
                    const optionKey = label;
                    const optionText = options[optionKey];
                    const isSelected = selectedAnswer === label;

                    if (!optionText) return null;

                    return (
                        <label
                            key={label}
                            className={`option-item ${isSelected ? 'selected' : ''} ${isLocked ? 'locked' : ''}`}
                        >
                            <input
                                type="radio"
                                name="quiz-option"
                                value={label}
                                checked={isSelected}
                                onChange={() => !isLocked && onAnswerSelect(label)}
                                className="option-radio"
                                disabled={isLocked}
                            />
                            <span className="option-label-text">
                                <strong>{label}.</strong> {optionText}
                            </span>
                        </label>
                    );
                })}
                {!options && <div className="error-message">Options not available</div>}
            </div>
        </div>
    );
}

export default QuestionCard;

