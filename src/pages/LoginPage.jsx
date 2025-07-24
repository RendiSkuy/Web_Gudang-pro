import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { login } from '../api/authService';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const auth = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            const data = await login({ username, password });
            auth.login(data.token);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="app-container">
            <div className="card auth-card">
                <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ 
                        color: 'var(--primary-color)', 
                        marginBottom: '0.5rem',
                        fontSize: 'clamp(1.5rem, 4vw, 2rem)'
                    }}>
                        Gudang Pro
                    </h1>
                    <p style={{ 
                        color: 'var(--text-light)', 
                        margin: 0,
                        fontSize: 'clamp(0.8rem, 2vw, 1rem)'
                    }}>
                        Manajemen Inventaris Berbasis Web
                    </p>
                </header>
                
                <h2>Login</h2>
                
                <form onSubmit={handleSubmit}>
                    <div>
                        <label 
                            htmlFor="username" 
                            style={{ 
                                display: 'block', 
                                marginBottom: '0.5rem', 
                                color: 'var(--text-light)',
                                fontSize: '0.9rem',
                                fontWeight: '500'
                            }}
                        >
                            Username
                        </label>
                        <input 
                            id="username"
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            placeholder="Masukkan username" 
                            required 
                            disabled={isLoading}
                            style={{
                                opacity: isLoading ? 0.7 : 1,
                                cursor: isLoading ? 'not-allowed' : 'text'
                            }}
                        />
                    </div>
                    
                    <div>
                        <label 
                            htmlFor="password" 
                            style={{ 
                                display: 'block', 
                                marginBottom: '0.5rem', 
                                color: 'var(--text-light)',
                                fontSize: '0.9rem',
                                fontWeight: '500'
                            }}
                        >
                            Password
                        </label>
                        <input 
                            id="password"
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Masukkan password" 
                            required 
                            disabled={isLoading}
                            style={{
                                opacity: isLoading ? 0.7 : 1,
                                cursor: isLoading ? 'not-allowed' : 'text'
                            }}
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        style={{
                            position: 'relative',
                            opacity: isLoading ? 0.8 : 1,
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        {isLoading && (
                            <div 
                                style={{
                                    width: '16px',
                                    height: '16px',
                                    border: '2px solid transparent',
                                    borderTop: '2px solid currentColor',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}
                            />
                        )}
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                    
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}
                </form>
                
                <div style={{
                    marginTop: '2rem',
                    textAlign: 'center',
                    color: 'var(--text-light)',
                    fontSize: '0.9rem'
                }}>
                    <p style={{ margin: 0 }}>
                        Silakan masuk dengan akun Anda
                    </p>
                </div>
            </div>
            
            {/* Add keyframe animation for loading spinner */}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

export default LoginPage;