import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';

function App() {
    const { token } = useAuth();

    return (
        <>
            {token && <Navbar />}
            <main className="container">
                <Routes>
                    <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/" />} />
                    <Route path="/" element={token ? <HomePage /> : <Navigate to="/login" />} />
                </Routes>
            </main>
        </>
    );
}

export default App;