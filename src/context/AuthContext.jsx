import React, { createContext, useState, useContext } from 'react';
import { login as loginService } from '../api/apiService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));

    const login = async (username, password) => {
        const { data } = await loginService({ username, password });
        localStorage.setItem('token', data.token);
        setToken(data.token);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    const value = { token, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};