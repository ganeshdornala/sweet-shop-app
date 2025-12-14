import { useState,useContext } from "react";
import axios from 'axios';
import {useNavigate,Link} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';

const Login=()=>{
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [error,setError]=useState('');
    const {login}=useContext(AuthContext);
    const navigate=useNavigate();

    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            const res=await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`,{email,password});
            login(res.data,res.data.token);
            navigate('/dashboard');
        }catch(err){
            setError(err.response?.data?.message||'Login failed');
        }
    };

    return(
        <div className="container mt-5" style={{maxWidth:'400px'}}>
            <div className="card shadow">
                <div className="card-body">
                    <h2 className="mb-4 text-center">Sweet Shop Login</h2>
                    {error&&<div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label>Email</label>
                            <input 
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Login</button>
                    </form>
                    <div className="mt-3 text-center">
                        <p>New here?<Link to="/register">Create an account</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;