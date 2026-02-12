import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerParticipant } from '../services/api';
import './RegistrationForm.css';

function RegistrationForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        full_name: '',
        contact_number: '',
        email: '',
        school_college: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState('');

    const validateField = (name, value) => {
        switch (name) {
            case 'full_name':
                return value.trim() === '' ? 'Full name is required' : '';
            case 'contact_number':
                return !/^\d{10}$/.test(value) ? 'Contact number must be exactly 10 digits' : '';
            case 'email':
                return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Please enter a valid email address' : '';
            case 'school_college':
                return value.trim() === '' ? 'School/College name is required' : '';
            default:
                return '';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Real-time validation
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
        setApiError('');
    };

    const validateForm = () => {
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            console.log('Form validation failed');
            return;
        }

        setIsSubmitting(true);
        setApiError('');

        try {
            console.log('=== REGISTRATION SUBMISSION START ===');
            console.log('Form data:', formData);
            console.log('API URL:', import.meta.env.VITE_API_URL || 'http://localhost:8000');

            const response = await registerParticipant(formData);
            console.log('Registration successful:', response);
            console.log('Participant ID:', response.participant_id);

            // Store participant data in sessionStorage
            sessionStorage.setItem('participantId', response.participant_id);
            sessionStorage.setItem('participantName', formData.full_name);
            console.log('SessionStorage updated');
            console.log('Navigating to /quiz...');

            // Navigate to quiz
            navigate('/quiz');
            console.log('Navigation called');
        } catch (error) {
            console.error('=== REGISTRATION ERROR ===');
            console.error('Error object:', error);
            console.error('Error response:', error.response);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);

            if (error.response && error.response.data && error.response.data.detail) {
                setApiError(error.response.data.detail);
            } else if (error.message) {
                setApiError(`Error: ${error.message}`);
            } else {
                setApiError('An error occurred during registration. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
            console.log('=== REGISTRATION SUBMISSION END ===');
        }
    };

    const isFormValid = Object.values(errors).every(error => error === '') &&
        Object.values(formData).every(value => value.trim() !== '');

    return (
        <div className="registration-container">
            <div className="registration-content">
                <h1 className="registration-title">Participant Details</h1>
                <p className="registration-subtitle">Please fill in the following details to begin the quiz:</p>

                <form onSubmit={handleSubmit} className="registration-form">
                    <div className="form-group">
                        <label htmlFor="full_name">Full Name *</label>
                        <input
                            type="text"
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className={errors.full_name ? 'error' : ''}
                            placeholder="Enter your full name"
                        />
                        {errors.full_name && <span className="error-message">{errors.full_name}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="contact_number">Contact Number *</label>
                        <input
                            type="tel"
                            id="contact_number"
                            name="contact_number"
                            value={formData.contact_number}
                            onChange={handleChange}
                            className={errors.contact_number ? 'error' : ''}
                            placeholder="Enter 10-digit mobile number"
                            maxLength="10"
                        />
                        {errors.contact_number && <span className="error-message">{errors.contact_number}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email ID *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'error' : ''}
                            placeholder="Enter your email address"
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="school_college">Current School / College Name *</label>
                        <input
                            type="text"
                            id="school_college"
                            name="school_college"
                            value={formData.school_college}
                            onChange={handleChange}
                            className={errors.school_college ? 'error' : ''}
                            placeholder="Enter your school or college name"
                        />
                        {errors.school_college && <span className="error-message">{errors.school_college}</span>}
                    </div>

                    {apiError && (
                        <div className="api-error">
                            {apiError}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={!isFormValid || isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Begin Quiz'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RegistrationForm;
