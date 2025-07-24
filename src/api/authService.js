const API_URL = `${import.meta.env.VITE_API_BASE_URL}/auth`;

export const login = async (credentials) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Login gagal.');
    }
    return data;
};