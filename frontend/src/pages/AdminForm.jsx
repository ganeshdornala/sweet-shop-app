import { useState,useEffect,useContext } from "react";
import { useNavigate,useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const AdminForm=()=>{
    const [formData,setFormData]=useState({
        name:'',
        category:'',
        price:'',
        quantity:''
    });

    const {id}=useParams();
    const {token}=useContext(AuthContext);
    const navigate=useNavigate();
    const isEditMode=!id;

    useEffect(()=>{
        if(isEditMode){
            const fetchSweet=async()=>{
                const res=await axios.get(`http://localhost:5000/api/sweets`);
                const sweet=res.data.find(s=>s._id===id);
                if(sweet){
                    setFormData({
                        name:sweet.name,
                        category:sweet.category,
                        price:sweet.price,
                        quantity:sweet.quantity
                    });
                }
            };
            fetchSweet();
        }
    },[id,isEditMode]);

    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            const config={
                headers:{
                    Authorization:`Bearer ${token}`
                }
            };
            if(isEditMode){
                await axios.put(`http://localhost:5000/api/sweets/${id}`,formData,config);
                alert('Sweet Updated!');
            }else{
                await axios.post('http://localhost:5000/api/sweets',formData,config);
                alert('Sweet Created!');
            }
            navigate('/dashboard');
        }catch(error){
            alert('Operation failed');
        }
    };

    return(
        <div className="container mt-5" style={{ maxWidth: '500px' }}>
            <h2>{isEditMode ? 'Edit Sweet' : 'Add New Sweet'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Name</label>
                    <input type="text" className="form-control" value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="mb-3">
                    <label>Category</label>
                    <input type="text" className="form-control" value={formData.category} 
                        onChange={e => setFormData({...formData, category: e.target.value})} required />
                </div>
                <div className="mb-3">
                    <label>Price</label>
                    <input type="number" className="form-control" value={formData.price} 
                        onChange={e => setFormData({...formData, price: e.target.value})} required />
                </div>
                <div className="mb-3">
                    <label>Quantity</label>
                    <input type="number" className="form-control" value={formData.quantity} 
                        onChange={e => setFormData({...formData, quantity: e.target.value})} required />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                    {isEditMode ? 'Update Sweet' : 'Add Sweet'}
                </button>
                <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-secondary w-100 mt-2">
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default AdminForm;