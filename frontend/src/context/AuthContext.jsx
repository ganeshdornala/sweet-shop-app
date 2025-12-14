import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // 1. Initialize state directly from LocalStorage to avoid "flicker" on refresh
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    
    const [token, setToken] = useState(() => {
        return localStorage.getItem('token') || null;
    });

    const [loading, setLoading] = useState(false);

    // 2. Login Function
    // We expect 'userData' to contain: { _id, name, email, isAdmin, token }
    const login = (userData) => {
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setToken(userData.token);
        setUser(userData);
    };

    // 3. Logout Function
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {/* Only render children if we are not loading (optional, but good practice) */}
            {!loading && children}
        </AuthContext.Provider>
    );
};