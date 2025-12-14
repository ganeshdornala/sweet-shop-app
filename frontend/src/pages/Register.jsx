import { useState, useContext } from "react";
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, formData);
            login(data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-header">Create Account</h2>
                <p className="auth-subtitle">Join us to explore delicious sweets</p>
                
                {error && <div className="error-msg">{error}</div>}
                
                <form onSubmit={handleSubmit} className="auth-form">
                    <input 
                        type="text" 
                        className="auth-input"
                        placeholder="Username" 
                        value={formData.username} 
                        onChange={(e) => setFormData({...formData, username: e.target.value})} 
                        required 
                    />
                    <input 
                        type="email" 
                        className="auth-input"
                        placeholder="Email Address" 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        required 
                    />
                    <input 
                        type="password" 
                        className="auth-input"
                        placeholder="Password" 
                        value={formData.password} 
                        onChange={(e) => setFormData({...formData, password: e.target.value})} 
                        required 
                    />
                    <button type="submit" className="auth-btn">
                        Sign Up
                    </button>
                </form>
                
                <div className="auth-footer">
                    Already have an account? <Link to="/login" className="auth-link">Login here</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
