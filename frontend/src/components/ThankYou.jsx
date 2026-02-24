import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PixelBlast from './PixelBlast';
import { safeSessionStorage } from '../utils/storage';
import './ThankYou.css';

function ThankYou() {
    const navigate = useNavigate();
    const participantName = safeSessionStorage.getItem('participantName');
    const score = safeSessionStorage.getItem('quizScore');
    const totalQuestions = safeSessionStorage.getItem('totalQuestions');
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        // Prevent going back to quiz
        const handlePopState = () => {
            navigate('/thank-you', { replace: true });
        };

        window.addEventListener('popstate', handlePopState);

        // Generate random particles for background animation (same as Welcome page)
        const newParticles = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            animationDuration: 3 + Math.random() * 4,
            size: 2 + Math.random() * 4,
            delay: Math.random() * 5
        }));
        setParticles(newParticles);

        return () => window.removeEventListener('popstate', handlePopState);
    }, [navigate]);

    const percentage = totalQuestions ? Math.round((score / totalQuestions) * 100) : 0;

    const handleAdmissionsClick = () => {
        window.open('https://admissions.indirauniversity.edu.in/?_gl=1*4kltz0*_gcl_au*MTE2NjQyNDM3Mi4xNzcwNjU5OTY2*_ga*ODE3MzgxNTA5LjE3NzA2NTk5Njc.*_ga_E7M1VJHCFW*czE3NzA2NTk5NjYkbzEkZzAkdDE3NzA2NTk5NjYkajYwJGwwJGgxODE2MDgwMTc3', '_blank');
    };

    return (
        <div className="thankyou-container">
            {/* PixelBlast Animated Background */}
            <div className="pixel-blast-background">
                <PixelBlast
                    variant="square"
                    pixelSize={4}
                    color="#FFFFFF"
                    patternScale={2}
                    patternDensity={1}
                    pixelSizeJitter={0}
                    enableRipples
                    rippleSpeed={0.4}
                    rippleThickness={0.12}
                    rippleIntensityScale={1.5}
                    liquid={false}
                    liquidStrength={0.12}
                    liquidRadius={1.2}
                    liquidWobbleSpeed={5}
                    speed={0.5}
                    edgeFade={0.25}
                    transparent
                />
            </div>

            {/* Animated particle background */}
            <div className="particles-bg">
                {particles.map(particle => (
                    <div
                        key={particle.id}
                        className="particle"
                        style={{
                            left: `${particle.left}%`,
                            animationDuration: `${particle.animationDuration}s`,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            animationDelay: `${particle.delay}s`
                        }}
                    />
                ))}
            </div>

            {/* Animated gradient orbs */}
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>

            <div className="thankyou-content">
                {/* Medal Icon */}
                <div className="medal-container">
                    <div className="medal-icon">🏅</div>
                </div>

                {/* Percentage Display */}
                <div className="percentage-display">{percentage}%</div>

                {/* Congratulations Message */}
                <h1 className="congrats-title">Congrats!</h1>

                {/* Participant Name */}
                {participantName && (
                    <p className="participant-message">
                        {participantName}, you just passed the test level
                    </p>
                )}

                {/* Score Display */}
                <p className="score-text">Score: {score} / {totalQuestions}</p>

                {/* Admissions Button */}
                <button className="admissions-button" onClick={handleAdmissionsClick}>
                    <span className="button-glow"></span>
                    <span className="button-text">
                        🎓 Admissions Open
                    </span>
                </button>

                {/* University Info Link */}
                <a
                    href="https://www.indirauniversity.edu.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="university-link"
                >
                    Learn more about Indira University
                </a>
            </div>
        </div>
    );
}

export default ThankYou;
