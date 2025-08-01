import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-brand">Gudang Pro</div>
            <button onClick={logout} className="logout-button">Logout</button>
        </nav>
    );
};

export default Navbar;