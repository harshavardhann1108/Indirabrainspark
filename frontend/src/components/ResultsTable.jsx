import { useState, useEffect } from 'react';
import './ResultsTable.css';

const ResultsTable = () => {
    const [statistics, setStatistics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const response = await fetch(`${API_BASE_URL}/api/results/statistics`);
            if (!response.ok) {
                throw new Error('Failed to fetch statistics');
            }
            const data = await response.json();
            setStatistics(data.statistics);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="results-container">
                <div className="loading-spinner">Loading statistics...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="results-container">
                <div className="error-message">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="results-container">
            <div className="results-header">
                <h1>Quiz Results - Participant Statistics</h1>
                <p className="subtitle">Complete response analysis for all participants</p>
            </div>

            <div className="table-wrapper">
                <table className="results-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Institution</th>
                            <th>Questions Answered</th>
                            <th>Total Marks</th>
                            <th>Average Time (sec)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {statistics.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="no-data">
                                    No participant data available yet
                                </td>
                            </tr>
                        ) : (
                            statistics.map((stat, index) => (
                                <tr key={stat.participant_id}>
                                    <td>{index + 1}</td>
                                    <td className="name-cell">{stat.full_name}</td>
                                    <td className="email-cell">{stat.email}</td>
                                    <td>{stat.school_college}</td>
                                    <td className="center-cell">{stat.total_questions}</td>
                                    <td className="marks-cell">{stat.total_marks}</td>
                                    <td className="time-cell">{stat.avg_time.toFixed(2)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {statistics.length > 0 && (
                <div className="stats-summary">
                    <div className="summary-card">
                        <h3>Total Participants</h3>
                        <p className="summary-value">{statistics.length}</p>
                    </div>
                    <div className="summary-card">
                        <h3>Average Score</h3>
                        <p className="summary-value">
                            {(statistics.reduce((sum, s) => sum + s.total_marks, 0) / statistics.length).toFixed(1)}
                        </p>
                    </div>
                    <div className="summary-card">
                        <h3>Average Response Time</h3>
                        <p className="summary-value">
                            {(statistics.reduce((sum, s) => sum + s.avg_time, 0) / statistics.length).toFixed(2)}s
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResultsTable;
