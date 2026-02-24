import { useState, useEffect } from 'react';
import { getLeaderboard, uploadQuestions, getParticipantsWithScores } from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './AdminDashboard.css';

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('leaderboard');
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [participantsData, setParticipantsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadStatus, setUploadStatus] = useState('');
    const [jsonInput, setJsonInput] = useState('');

    useEffect(() => {
        if (activeTab === 'leaderboard') {
            fetchLeaderboard();
        } else if (activeTab === 'participants') {
            fetchParticipants();
        }
    }, [activeTab]);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            const data = await getLeaderboard();
            setLeaderboardData(data.toppers || []);
        } catch (err) {
            setError('Failed to fetch leaderboard');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchParticipants = async () => {
        setLoading(true);
        try {
            const data = await getParticipantsWithScores();
            setParticipantsData(data.participants || []);
        } catch (err) {
            setError('Failed to fetch participants');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setJsonInput(e.target.result);
            };
            reader.readAsText(file);
        }
    };

    const handleUpload = async () => {
        if (!jsonInput) {
            setUploadStatus('Please select a file or paste JSON first');
            return;
        }

        try {
            const parsedData = JSON.parse(jsonInput);
            const dataToUpload = Array.isArray(parsedData) ? { questions: parsedData } : parsedData;

            if (!dataToUpload.questions || !Array.isArray(dataToUpload.questions)) {
                setUploadStatus('Invalid JSON format. Expected { "questions": [...] } or [...]');
                return;
            }

            setLoading(true);
            const result = await uploadQuestions(dataToUpload);
            setUploadStatus(`Success! Added: ${result.questions_added}, Updated: ${result.questions_updated}`);
            setJsonInput('');
        } catch (err) {
            setUploadStatus('Error uploading questions: ' + (err.response?.data?.detail || err.message));
        } finally {
            setLoading(false);
        }
    };

    const exportPDF = () => {
        try {
            console.log("Starting PDF export...");
            const doc = new jsPDF();

            // Add title
            doc.setFontSize(18);
            doc.text('Indira BrainSpark Quiz - Participant Results', 14, 22);
            doc.setFontSize(11);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

            // Define table columns
            const tableColumn = ["Rank", "Name", "App No.", "Email", "School/College", "Marks", "Score %", "Total Time (s)"];

            if (!participantsData || participantsData.length === 0) {
                alert("No participant data to export.");
                return;
            }

            // Define table rows with sanitization
            const tableRows = participantsData.map(participant => [
                participant.rank || '-',
                participant.full_name || 'Anonymous',
                participant.application_number || '-',
                participant.email || '-',
                participant.school_college || '-',
                `${participant.total_marks || 0}/10`,
                `${participant.percentage || 0}%`,
                `${participant.total_time || 0}s`
            ]);

            console.log("Generating table with rows:", tableRows.length);

            // Generate table using explicit function call
            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 35,
                theme: 'grid',
                styles: { fontSize: 9 },
                headStyles: { fillColor: [76, 175, 80] }
            });

            // Save PDF
            console.log("Saving PDF...");
            doc.save('quiz_participants_list.pdf'); // Changed filename to ensure fresh download
        } catch (err) {
            console.error("PDF Export Error:", err);
            alert(`Failed to export PDF: ${err.message}`);
        }
    };

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <h1>Admin Dashboard</h1>
                <nav className="admin-nav">
                    <button
                        className={`nav-btn ${activeTab === 'leaderboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('leaderboard')}
                    >
                        🏆 Leaderboard
                    </button>
                    <button
                        className={`nav-btn ${activeTab === 'upload' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upload')}
                    >
                        📤 Upload Questions
                    </button>
                    <button
                        className={`nav-btn ${activeTab === 'participants' ? 'active' : ''}`}
                        onClick={() => setActiveTab('participants')}
                    >
                        👥 Participants List
                    </button>
                </nav>
            </header>

            <main className="admin-content">
                {loading && <div className="loading-spinner">Loading...</div>}

                {activeTab === 'leaderboard' && (
                    <div className="tab-pane leaderboard-pane">
                        <h2>Top Performers</h2>
                        <div className="table-responsive">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Name</th>
                                        <th>App No.</th>
                                        <th>Marks</th>
                                        <th>Total Time</th>
                                        <th>School/College</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboardData.map((topper) => (
                                        <tr key={topper.participant_id} className={topper.rank <= 3 ? `top-${topper.rank}` : ''}>
                                            <td className="rank-cell">
                                                {topper.rank === 1 ? '🥇' : topper.rank === 2 ? '🥈' : topper.rank === 3 ? '🥉' : topper.rank}
                                            </td>
                                            <td>{topper.full_name}</td>
                                            <td>{topper.application_number || '-'}</td>
                                            <td className="marks-cell">{topper.total_marks}/10</td>
                                            <td>{topper.total_time}s</td>
                                            <td>{topper.school_college}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'upload' && (
                    <div className="tab-pane upload-pane">
                        <h2>Upload Quiz Questions</h2>
                        <div className="upload-container">
                            <div className="file-input-wrapper">
                                <label>Select JSON File:</label>
                                <input type="file" accept=".json" onChange={handleFileUpload} />
                            </div>

                            <div className="json-editor">
                                <label>Or Paste JSON Here:</label>
                                <textarea
                                    value={jsonInput}
                                    onChange={(e) => setJsonInput(e.target.value)}
                                    placeholder='[{"question_number": 1, "text": "...", ...}]'
                                />
                            </div>

                            <button className="upload-btn" onClick={handleUpload} disabled={loading}>
                                {loading ? 'Uploading...' : 'Upload Questions'}
                            </button>

                            {uploadStatus && (
                                <div className={`status-message ${uploadStatus.includes('Error') ? 'error' : 'success'}`}>
                                    {uploadStatus}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'participants' && (
                    <div className="tab-pane participants-pane">
                        <div className="pane-header">
                            <h2>All Participants (Ranked)</h2>
                            <button className="export-btn" onClick={exportPDF}>
                                📄 Download PDF Report
                            </button>
                        </div>

                        <div className="table-responsive">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Name</th>
                                        <th>Percentage</th>
                                        <th>Marks</th>
                                        <th>Total Time</th>
                                        <th>Contact</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {participantsData.map((p) => (
                                        <tr key={p.participant_id}>
                                            <td className="rank-cell">#{p.rank}</td>
                                            <td>
                                                <div className="participant-info">
                                                    <span className="p-name">{p.full_name}</span>
                                                    <span className="p-school">{p.school_college}</span>
                                                    <span className="p-email">{p.email}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="percentage-badge" style={{
                                                    background: `conic-gradient(#4CAF50 ${p.percentage * 3.6}deg, #e0e0e0 0deg)`
                                                }}>
                                                    <span>{p.percentage}%</span>
                                                </div>
                                            </td>
                                            <td>{p.total_marks}/10</td>
                                            <td>{p.total_time}s</td>
                                            <td>{p.contact_number}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminDashboard;
