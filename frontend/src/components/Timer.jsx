import './Timer.css';

function Timer({ timeLeft }) {
    const getTimerClass = () => {
        if (timeLeft <= 3) return 'danger';
        if (timeLeft <= 5) return 'warning';
        return '';
    };

    return (
        <div className="timer-container">
            <div className="timer-circle">
                <div className={`timer-display ${getTimerClass()}`}>
                    {timeLeft}
                </div>
            </div>
            <div className="timer-label">Seconds Left</div>
        </div>
    );
}

export default Timer;
