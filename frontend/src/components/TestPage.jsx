import { useState } from 'react';
import { registerParticipant, getQuestions } from '../services/api';
import { safeSessionStorage } from '../utils/storage';

function TestPage() {
    const [testResults, setTestResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const addResult = (test, status, details) => {
        setTestResults(prev => [...prev, { test, status, details, timestamp: new Date().toLocaleTimeString() }]);
    };

    const runTests = async () => {
        setTestResults([]);
        setIsLoading(true);

        // Test 1: Check API URL
        addResult('API URL', 'INFO', `Using: ${import.meta.env.VITE_API_URL || 'http://localhost:8000'}`);

        // Test 2: Register participant
        try {
            const response = await registerParticipant({
                full_name: 'Test User ' + Date.now(),
                contact_number: '1234567890',
                email: `test${Date.now()}@example.com`,
                school_college: 'Test School'
            });
            addResult('Registration', 'PASS', `Participant ID: ${response.participant_id}`);
            safeSessionStorage.setItem('participantId', response.participant_id);
        } catch (error) {
            addResult('Registration', 'FAIL', error.message);
        }

        // Test 3: Fetch questions
        try {
            const data = await getQuestions();
            addResult('Fetch Questions', 'PASS', `Received ${data.questions?.length || 0} questions`);
        } catch (error) {
            addResult('Fetch Questions', 'FAIL', error.message);
        }

        // Test 4: Check sessionStorage
        const participantId = safeSessionStorage.getItem('participantId');
        addResult('SessionStorage', participantId ? 'PASS' : 'FAIL', `Participant ID: ${participantId || 'Not set'}`);

        setIsLoading(false);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px', margin: '0 auto' }}>
            <h1>IU Quiz - Diagnostic Test Page</h1>
            <button
                onClick={runTests}
                disabled={isLoading}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    marginBottom: '20px'
                }}
            >
                {isLoading ? 'Running Tests...' : 'Run Diagnostic Tests'}
            </button>

            <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '4px' }}>
                <h2>Test Results:</h2>
                {testResults.length === 0 && <p>No tests run yet. Click the button above to start.</p>}
                {testResults.map((result, index) => (
                    <div
                        key={index}
                        style={{
                            padding: '10px',
                            marginBottom: '10px',
                            backgroundColor: 'white',
                            borderLeft: `4px solid ${result.status === 'PASS' ? '#4CAF50' :
                                result.status === 'FAIL' ? '#f44336' : '#2196F3'
                                }`,
                            borderRadius: '2px'
                        }}
                    >
                        <div style={{ fontWeight: 'bold' }}>
                            [{result.timestamp}] {result.test}: {result.status}
                        </div>
                        <div style={{ marginTop: '5px', color: '#666' }}>
                            {result.details}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
                <h3>Instructions:</h3>
                <ol>
                    <li>Click "Run Diagnostic Tests" to test all API endpoints</li>
                    <li>Check if all tests show "PASS"</li>
                    <li>If any test fails, share the error details</li>
                    <li>Open browser console (F12) for detailed logs</li>
                </ol>
            </div>
        </div>
    );
}

export default TestPage;
