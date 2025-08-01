import { useState, useEffect } from 'react';
import { getBarang, createBarang, updateBarang } from '../api/apiService';
import './HomePage.css';

const HomePage = () => {
    const [barangList, setBarangList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBarang, setEditingBarang] = useState(null);
    const [statusFilter, setStatusFilter] = useState('active');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchBarang = async (status, search) => {
        try {
            setLoading(true);
            const { data } = await getBarang(status, search);
            setBarangList(data);
            setError('');
        } catch (err) {
            setError('Gagal memuat data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchBarang(statusFilter, searchTerm);
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [statusFilter, searchTerm]);

    const handleRowClick = (barang) => {
        setEditingBarang(barang);
        setIsModalOpen(true);
    };

    const handleOpenAddModal = () => {
        setEditingBarang(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBarang(null);
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (editingBarang) {
                await updateBarang(editingBarang._id, formData);
            } else {
                await createBarang(formData);
            }
            fetchBarang(statusFilter, searchTerm);
            handleCloseModal();
        } catch (err) {
            alert("Gagal menyimpan data!");
        }
    };

    if (loading) return <div>Memuat data barang...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div>
            <div className="page-header">
                <h1>Daftar Barang</h1>
                <button className="btn-add" onClick={handleOpenAddModal}>+ Tambah Barang</button>
            </div>

            <div className="filter-container">
                <input
                    type="text"
                    placeholder="Cari nama barang..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="radio-filters">
                    <span>Tampilkan:</span>
                    <label>
                        <input type="radio" name="status" value="active" checked={statusFilter === 'active'} onChange={(e) => setStatusFilter(e.target.value)} />
                        Aktif
                    </label>
                    <label>
                        <input type="radio" name="status" value="inactive" checked={statusFilter === 'inactive'} onChange={(e) => setStatusFilter(e.target.value)} />
                        Tidak Aktif
                    </label>
                    <label>
                        <input type="radio" name="status" value="all" checked={statusFilter === 'all'} onChange={(e) => setStatusFilter(e.target.value)} />
                        Semua
                    </label>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Nama Barang</th>
                            <th>Kategori</th>
                            <th>Stok</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {barangList.length > 0 ? barangList.map(barang => (
                            // --- PASTIKAN BARIS INI BENAR ---
                            <tr key={barang._id} onClick={() => handleRowClick(barang)} className="clickable-row">
                                <td data-label="Nama Barang">{barang.nama_barang}</td>
                                <td data-label="Kategori">{barang.kategori}</td>
                                <td data-label="Stok">{`${barang.jumlah_stok} ${barang.satuan}`}</td>
                                <td data-label="Status">
                                    <span className={`status ${barang.isActive ? 'status-active' : 'status-inactive'}`}>
                                        {barang.isActive ? 'Aktif' : 'Tidak Aktif'}
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center' }}>Tidak ada data.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <BarangFormModal
                    barang={editingBarang}
                    onSubmit={handleFormSubmit}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

// Komponen Form Modal
const BarangFormModal = ({ barang, onSubmit, onClose }) => {
    const kategoriOptions = ['Elektronik', 'ATK', 'Pakaian', 'Perkakas', 'Lainnya'];
    const satuanOptions = ['Pcs', 'Unit', 'Botol', 'Box', 'Lusin'];
    const [formData, setFormData] = useState({
        nama_barang: barang?.nama_barang || '',
        kategori: barang?.kategori || 'Lainnya',
        jumlah_stok: barang?.jumlah_stok || 0,
        satuan: barang?.satuan || 'Pcs',
        isActive: barang?.isActive ?? true,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{barang ? 'Edit Barang' : 'Tambah Barang Baru'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nama Barang</label>
                        <input type="text" name="nama_barang" value={formData.nama_barang} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Kategori</label>
                        <select name="kategori" value={formData.kategori} onChange={handleChange} required>
                            {kategoriOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Jumlah Stok</label>
                        <input type="number" name="jumlah_stok" value={formData.jumlah_stok} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Satuan</label>
                        <select name="satuan" value={formData.satuan} onChange={handleChange} required>
                            {satuanOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                    {barang && (
                        <div className="form-group-checkbox">
                            <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleChange} />
                            <label htmlFor="isActive">Barang Aktif</label>
                        </div>
                    )}
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Batal</button>
                        <button type="submit" className="btn-save">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HomePage;