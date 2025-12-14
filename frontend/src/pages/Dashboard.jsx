import { useState, useEffect, useContext } from "react";
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [sweets, setSweets] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [priceFilter, setPriceFilter] = useState('all'); // NEW: State for dropdown
    
    // Form State for Admin
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        quantity: ''
    });

    const { token, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // 1. Fetch Sweets (Updated to handle Price Ranges)
    const fetchSweets = async (query = '', priceRange = 'all') => {
        try {
            // Start building the query URL
            let url = `${import.meta.env.VITE_API_URL}/api/sweets/search?`;
            
            // Add Text Query
            if (query) url += `query=${query}&`;

            // Add Price Logic based on Dropdown
            if (priceRange === 'under5') {
                url += `maxPrice=5`;
            } else if (priceRange === '5to10') {
                url += `minPrice=5&maxPrice=10`;
            } else if (priceRange === '10to20') {
                url += `minPrice=10&maxPrice=20`;
            } else if (priceRange === 'over20') {
                url += `minPrice=20`;
            }

            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            
            const res = await axios.get(url, config);
            setSweets(res.data);
        } catch (error) {
            console.error("Error fetching sweets", error);
        }
    };

    // Initial Load
    useEffect(() => {
        fetchSweets();
    }, [token]);

    // 2. Handle Search & Filter
    const handleSearch = (e) => {
        e.preventDefault();
        fetchSweets(searchQuery, priceFilter);
    };

    // When dropdown changes, trigger search immediately
    const handleFilterChange = (e) => {
        const newFilter = e.target.value;
        setPriceFilter(newFilter);
        fetchSweets(searchQuery, newFilter);
    };

    // ... (Keep existing form handlers: handleChange, handleSubmit, handleEdit below) ...
    // Note: For brevity, I am keeping your existing Admin Form logic hidden here. 
    // MAKE SURE TO KEEP YOUR handleSubmit, handleEdit, handleDelete functions HERE.
    
    // --- INSERT YOUR ADMIN FORM LOGIC HERE (handleChange, handleSubmit, etc) ---
    // (If you need the full file again with these included, let me know!)
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
            if (editingId) {
                await axios.put(`${import.meta.env.VITE_API_URL}/api/sweets/${editingId}`, formData, config);
                alert("Sweet Updated!");
                setEditingId(null);
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/sweets`, formData, config);
                alert("Sweet Created!");
            }
            setFormData({ name: '', category: '', price: '', quantity: '' });
            fetchSweets(searchQuery, priceFilter);
        } catch (error) {
            alert('Operation failed');
        }
    };

    const handleEdit = (sweet) => {
        setEditingId(sweet._id);
        setFormData({ name: sweet.name, category: sweet.category, price: sweet.price, quantity: sweet.quantity });
        window.scrollTo(0, 0);
    };

    const handleBuy = async (id) => {
        if (!token) return alert("Please login to buy");
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/sweets/${id}/purchase`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Sweet purchased!');
            fetchSweets(searchQuery, priceFilter);
        } catch (error) {
            alert('Purchase failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/sweets/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSweets(searchQuery, priceFilter);
        } catch (error) {
            alert('Delete failed');
        }
    };
    
    const handleLogout = () => { logout(); navigate('/'); };

    return (
        <div className="container">
            <header className="header">
                <h1>Sweet Shop Dashboard</h1>
                <div className="header-controls">
                    {user && <span className="welcome-text">Welcome, {user.name}</span>}
                    <button onClick={handleLogout} className="btn btn-logout">Logout</button>
                </div>
            </header>

            {/* Admin Form Section */}
            {user?.isAdmin && (
                <div className="form-card">
                    <h3>{editingId ? 'Edit Sweet' : 'Add New Sweet'}</h3>
                    <form onSubmit={handleSubmit} className="sweet-form">
                        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                        <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
                        <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required />
                        <input name="quantity" type="number" placeholder="Quantity" value={formData.quantity} onChange={handleChange} required />
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Add'}</button>
                            {editingId && <button type="button" onClick={() => setEditingId(null)} className="btn btn-secondary">Cancel</button>}
                        </div>
                    </form>
                </div>
            )}

            {/* SEARCH & FILTER BAR */}
            <form onSubmit={handleSearch} className="search-bar">
                {/* 1. Text Search */}
                <input 
                    type="text" 
                    placeholder="Search sweets..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                
                {/* 2. Price Filter Dropdown */}
                <select 
                    value={priceFilter} 
                    onChange={handleFilterChange}
                    className="price-dropdown"
                >
                    <option value="all">All Prices</option>
                    <option value="under5">Under $5</option>
                    <option value="5to10">$5 - $10</option>
                    <option value="10to20">$10 - $20</option>
                    <option value="over20">Over $20</option>
                </select>

                <button type="submit" className="btn btn-primary">Search</button>
                
                {(searchQuery || priceFilter !== 'all') && (
                    <button type="button" className="btn btn-secondary" onClick={() => { 
                        setSearchQuery(''); 
                        setPriceFilter('all'); 
                        fetchSweets('', 'all'); 
                    }}>
                        Clear
                    </button>
                )}
            </form>

            {/* SWEETS GRID */}
            <div className="sweets-grid">
                {sweets.map(sweet => (
                    <div className="sweet-card" key={sweet._id}>
                        <h3>{sweet.name}</h3>
                        <p className="category">{sweet.category}</p>
                        <div className="details">
                            <span>Price: ${sweet.price}</span>
                            <span>Stock: {sweet.quantity}</span>
                        </div>
                        <div className="actions">
                            <button 
                                className="btn btn-success full-width" 
                                disabled={sweet.quantity === 0}
                                onClick={() => handleBuy(sweet._id)}
                            >
                                {sweet.quantity > 0 ? 'Buy Now' : 'Out of Stock'}
                            </button>
                            {user?.isAdmin && (
                                <div className="admin-actions">
                                    <button onClick={() => handleEdit(sweet)} className="btn btn-edit">Edit</button>
                                    <button onClick={() => handleDelete(sweet._id)} className="btn btn-delete">Delete</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {sweets.length === 0 && <p style={{textAlign:'center', marginTop: '20px'}}>No sweets found matching your criteria.</p>}
        </div>
    );
};

export default Dashboard;