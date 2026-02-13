import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PixelBlast from './PixelBlast';
import iuLogo from '../assets/iu_logo.jpg';
import './Welcome.css';

function Welcome() {
    const navigate = useNavigate();
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        // Generate random particles for background animation
        const newParticles = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            animationDuration: 3 + Math.random() * 4,
            size: 2 + Math.random() * 4,
            delay: Math.random() * 5
        }));
        setParticles(newParticles);
    }, []);

    const handleStartQuiz = () => {
        navigate('/register');
    };

    return (
        <div className="welcome-container">
            {/* Navigation Bar with Logo */}
            <nav className="welcome-navbar">
                <div className="navbar-logo-container">
                    <img src={iuLogo} alt="Indira University" className="navbar-logo" />
                </div>
            </nav>

            {/* PixelBlast Animated Background - Commented out for debugging */}
            {/* <div className="pixel-blast-background">
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
            </div> */}

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

            <div className="welcome-content">
                {/* Glowing logo container */}
                <div className="logo-container">
                    <div className="logo-glow"></div>
                    <h1 className="welcome-title">
                        <span className="title-line">Indira</span>
                        <span className="title-line gradient-text">BrainSpark</span>
                    </h1>
                </div>

                <p className="welcome-tagline">
                    <span className="tagline-icon">⚡</span>
                    Think Fast. Think Smart.
                    <span className="tagline-icon">⚡</span>
                </p>

                <div className="info-cards">
                    <div className="info-card">
                        <div className="card-icon">🎯</div>
                        <div className="card-number">10</div>
                        <div className="card-label">Questions</div>
                    </div>
                    <div className="info-card">
                        <div className="card-icon">⏱️</div>
                        <div className="card-number">10</div>
                        <div className="card-label">Seconds Each</div>
                    </div>
                    <div className="info-card">
                        <div className="card-icon">🏆</div>
                        <div className="card-number">100</div>
                        <div className="card-label">Points Max</div>
                    </div>
                </div>

                <div className="quiz-description">
                    <p className="description-text">
                        Test your knowledge across General Knowledge, Science, Current Affairs, and more.
                        <br />
                        <span className="highlight">Fast-paced. Challenging. Exciting.</span>
                    </p>
                </div>

                <button className="start-button" onClick={handleStartQuiz}>
                    <span className="button-glow"></span>
                    <span className="button-text">
                        Start Quiz
                        <span className="arrow">→</span>
                    </span>
                </button>

                <div className="footer-text">
                    <p>Powered by Indira University</p>
                    <button
                        onClick={() => navigate('/admin')}
                        style={{
                            marginTop: '1rem',
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.3)',
                            color: 'rgba(255,255,255,0.7)',
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                        }}
                    >
                        Admin Login
                    </button>
                    <button
                        onClick={() => navigate('/test')}
                        style={{
                            marginTop: '1rem',
                            marginLeft: '1rem',
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.3)',
                            color: 'rgba(255,255,255,0.7)',
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                        }}
                    >
                        Test Page
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Welcome;
