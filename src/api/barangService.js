// Penjelasan: File ini khusus untuk menangani panggilan API terkait data barang.
// Setiap fungsi di sini akan menyertakan token otentikasi.
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/barang`;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const fetchBarang = async () => {
    const response = await fetch(API_URL, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Gagal mengambil data inventaris');
    return await response.json();
};

export const createBarang = async (data) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Gagal menyimpan data');
    return await response.json();
};

export const updateBarang = async (id, data) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Gagal mengupdate data');
    return await response.json();
};

export const deleteBarang = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Gagal menghapus data');
    return await response.json();
};
