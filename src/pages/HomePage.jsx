import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchBarang, createBarang, updateBarang, deleteBarang } from '../api/barangService';

const kategoriOptions = ['Elektronik', 'ATK', 'Perkakas', 'Pakaian', 'Lainnya'];
const satuanOptions = ['Unit', 'Botol', 'Pcs', 'Rim', 'Set', 'Lainnya'];

const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

function HomePage() {
  const { logout } = useAuth();
  const [barangList, setBarangList] = useState([]);
  const [formData, setFormData] = useState({ 
    nama_barang: '', 
    kategori: kategoriOptions[0],
    jumlah_stok: '', 
    satuan: satuanOptions[0],
    tanggal_masuk: getTodayDateString(),
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const getBarangList = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchBarang();
      setBarangList(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      if (String(err).includes('401') || String(err).includes('403')) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    getBarangList();
  }, [getBarangList]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (barang) => {
    setEditingId(barang._id);
    setFormData({
      nama_barang: barang.nama_barang,
      kategori: barang.kategori,
      jumlah_stok: barang.jumlah_stok,
      satuan: barang.satuan,
      tanggal_masuk: new Date(barang.tanggal_masuk).toISOString().split('T')[0],
    });
    
    // Scroll to form on mobile
    if (window.innerWidth <= 767) {
      document.querySelector('.card').scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Anda yakin ingin menghapus barang ini?")) {
      try {
        await deleteBarang(id);
        getBarangList();
      } catch (err) {
        setError(err.message);
      }
    }
  };
  
  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ 
      nama_barang: '', 
      kategori: kategoriOptions[0], 
      jumlah_stok: '', 
      satuan: satuanOptions[0],
      tanggal_masuk: getTodayDateString(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEditing = editingId !== null;
    const dataToSubmit = {
        ...formData,
        jumlah_stok: Number(formData.jumlah_stok)
    };

    try {
      if (isEditing) {
        await updateBarang(editingId, dataToSubmit);
      } else {
        await createBarang(dataToSubmit);
      }
      cancelEdit();
      getBarangList();
    } catch (err) {
      setError(err.message);
    }
  };

  // Check if we're on mobile for responsive behavior
  const isMobile = window.innerWidth <= 767;

  return (
    <div className="app-container">
      <header>
          <h1>Gudang Pro</h1>
          <p>Manajemen Inventaris Berbasis Web</p>
      </header>
      <main>
        <div className="card">
          <div className={isMobile ? "card-header" : ""} style={{
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            ...(isMobile && { flexDirection: 'column', alignItems: 'stretch' })
          }}>
            <h2>{editingId ? 'Edit Barang' : 'Tambah Barang Baru'}</h2>
            <div className={isMobile ? "logout-button-container" : ""}>
              <button onClick={logout} className="delete-button">Logout</button>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              name="nama_barang" 
              value={formData.nama_barang} 
              onChange={handleInputChange} 
              placeholder="Nama Barang" 
              required 
            />
            <select 
              name="kategori" 
              value={formData.kategori} 
              onChange={handleInputChange} 
              required
            >
              {kategoriOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <input 
              type="number" 
              name="jumlah_stok" 
              value={formData.jumlah_stok} 
              onChange={handleInputChange} 
              placeholder="Jumlah Stok" 
              required 
            />
            <select 
              name="satuan" 
              value={formData.satuan} 
              onChange={handleInputChange} 
              required
            >
              {satuanOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <input 
              type="date" 
              name="tanggal_masuk" 
              value={formData.tanggal_masuk} 
              onChange={handleInputChange} 
              required 
            />
            <div className="form-buttons">
              <button type="submit">
                {editingId ? 'Update' : 'Simpan'}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={cancelEdit} 
                  className="cancel-button"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
          {error && (
            <div className="error-message">
              Error: {error}
            </div>
          )}
        </div>

        <div className="card">
          <h2>Daftar Inventaris</h2>
          {isLoading ? (
            <div className="loading">Loading...</div>
          ) : barangList.length === 0 ? (
            <div className="text-center" style={{ padding: '2rem', color: 'var(--text-light)' }}>
              Belum ada data inventaris
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nama Barang</th>
                    <th>Kategori</th>
                    <th>Stok</th>
                    <th>Tanggal Masuk</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {barangList.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <div style={{ 
                          fontWeight: '600', 
                          color: 'var(--text-dark)',
                          wordBreak: 'break-word'
                        }}>
                          {item.nama_barang}
                        </div>
                      </td>
                      <td>
                        <span style={{ 
                          background: 'var(--primary-color)', 
                          color: 'white', 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '4px', 
                          fontSize: '0.8rem',
                          whiteSpace: 'nowrap'
                        }}>
                          {item.kategori}
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--success-color)' }}>
                          {item.jumlah_stok}
                        </strong>
                        <span style={{ 
                          marginLeft: '0.25rem', 
                          color: 'var(--text-light)',
                          fontSize: '0.9rem'
                        }}>
                          {item.satuan}
                        </span>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {new Date(item.tanggal_masuk).toLocaleDateString('id-ID', {
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric'
                        })}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            onClick={() => handleEdit(item)} 
                            className="edit-button"
                            title="Edit Barang"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(item._id)} 
                            className="delete-button"
                            title="Hapus Barang"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default HomePage;