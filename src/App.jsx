import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

// Komponen untuk melindungi halaman yang memerlukan login
function ProtectedRoute({ children }) {
    const { token } = useAuth();
    return token ? children : <Navigate to="/login" replace />;
}

// Komponen untuk halaman publik (login)
function PublicRoute({ children }) {
    const { token } = useAuth();
    return !token ? children : <Navigate to="/" replace />;
}

function App() {
    return (
        <Routes>
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route 
                path="/" 
                element={
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                } 
            />
            {/* Jika URL tidak cocok, arahkan ke halaman utama */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
