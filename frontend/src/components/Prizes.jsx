import { useNavigate } from 'react-router-dom';
import prizesImage from '../assets/prizes.jpg';
import iuLogo from '../assets/iu_logo.jpg';
import './Prizes.css';

function Prizes() {
    const navigate = useNavigate();

    const handleRegisterNow = () => {
        navigate('/welcome');
    };

    return (
        <div className="prizes-container">
            {/* Navigation Bar with Logo */}
            <nav className="prizes-navbar">
                <div className="navbar-logo-container">
                    <img src={iuLogo} alt="Indira University" className="navbar-logo" />
                </div>
            </nav>

            <div className="prizes-content">
                {/* Prizes Image Section */}
                <div className="prizes-image-section">
                    <img
                        src={prizesImage}
                        alt="Indira BrainSpark Quiz Prizes"
                        className="prizes-image"
                        loading="lazy"
                        decoding="async"
                        width="900"
                        height="600"
                    />
                </div>

                {/* Register Button */}
                <button className="register-button" onClick={handleRegisterNow}>
                    <span className="button-glow"></span>
                    <span className="button-text">
                        Register Now
                        <span className="arrow">→</span>
                    </span>
                </button>

                {/* Terms and Conditions Section */}
                <div className="terms-section">
                    <h2 className="terms-title">Terms & Conditions</h2>
                    <div className="terms-content">
                        <ol className="terms-list">
                            <li>The quiz is open to eligible students as specified by the Indira University.</li>
                            <li>Each participant is allowed to attempt the quiz only once. Multiple entries from the same participant will lead to disqualification.</li>
                            <li>Participants who answer all 10 questions correctly will qualify for the winner selection round.</li>
                            <li>In case of multiple participants scoring full marks, winners will be selected through a lucky draw. The decision of the organizers will be final and binding.</li>
                            <li>The use of external assistance including Google, ChatGPT, AI tools, books, or help from others is strictly prohibited.</li>
                            <li>Any form of malpractice, unfair means, or violation of rules will result in immediate disqualification.</li>
                            <li>The organizers reserve the right to modify, suspend, or cancel the quiz at any time without prior notice.</li>
                            <li>By participating in the quiz, participants agree to abide by all the above terms and conditions.</li>
                        </ol>
                    </div>
                </div>

                <div className="footer-text">
                    <p>Powered by Indira University</p>
                </div>
            </div>
        </div>
    );
}

export default Prizes;
