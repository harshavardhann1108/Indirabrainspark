import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './components/Welcome';
import RegistrationForm from './components/RegistrationForm';
import Quiz from './components/Quiz';
import ThankYou from './components/ThankYou';
import ResultsTable from './components/ResultsTable';
import AdminDashboard from './components/AdminDashboard';
import TestPage from './components/TestPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/results" element={<ResultsTable />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
