import { useState, useContext } from "react";
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, formData);
            login(res.data, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow-lg border-0 rounded-4" style={{ maxWidth: '400px', width: '100%' }}>
                <div className="card-body p-5">
                    <h2 className="mb-4 text-center fw-bold text-dark">Create Account</h2>
                    <p className="text-center text-muted mb-4">Please fill in the details to sign up</p>
                    
                    {error && <div className="alert alert-danger text-center">{error}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold text-secondary">Username</label>
                            <input
                                type="text"
                                name="username"
                                className="form-control form-control-lg bg-light fs-6"
                                placeholder="Enter username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold text-secondary">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control form-control-lg bg-light fs-6"
                                placeholder="Enter email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label fw-semibold text-secondary">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control form-control-lg bg-light fs-6"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-success btn-lg w-100 fw-bold shadow-sm">
                            Register
                        </button>
                    </form>
                    
                    <div className="mt-4 text-center">
                        <p className="mb-0 text-secondary">
                            Already have an account? <Link to="/" className="text-decoration-none fw-bold text-success">Login here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
