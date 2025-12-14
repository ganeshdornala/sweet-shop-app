import { useState,useContext } from "react";
import axios from 'axios';
import {useNavigate,Link} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';

const Register=()=>{
    const [formData,setFormData]=useState({
        username:'',
        email:'',
        password:''
    });
    const [error,setError]=useState('');
    const {login}=useContext(AuthContext);
    const navigate=useNavigate();
    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        });   
    };
    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            const res=await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`,formData);
            login(res.data,res.data.token);
            navigate('/dashboard');
        }catch(err){
            setError(err.response?.data?.message||'Registration failed');
        }
    };
    return(
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <div className="card shadow">
                <div className="card-body">
                    <h2 className="mb-4 text-center">Create Account</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label>Username</label>
                            <input 
                                type="text" 
                                name="username"
                                className="form-control" 
                                value={formData.username} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label>Email</label>
                            <input 
                                type="email" 
                                name="email"
                                className="form-control" 
                                value={formData.email} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label>Password</label>
                            <input 
                                type="password" 
                                name="password"
                                className="form-control" 
                                value={formData.password} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <button type="submit" className="btn btn-success w-100">Register</button>
                    </form>   
                    <div className="mt-3 text-center">
                        <p>Already have an account? <Link to="/">Login here</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;