import React, { useState, useEffect } from 'react';
import { getAllSearches, updateSearch, deleteSearch  } from '../api';

function SavedSearches() {
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchSearches();
  }, []);

  const fetchSearches = async () => {
    try {
      const res = await getAllSearches();
      setSearches(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load saved searches');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSearch(id);
      setSearches(searches.filter(s => s.id !== id));
      setSuccessMsg('Search deleted successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError('Failed to delete search');
    }
  };

  const handleEditStart = (search) => {
    setEditingId(search.id);
    setEditData({
      location: search.location,
      date_from: search.date_from,
      date_to: search.date_to,
    });
  };

  const handleEditSave = async (id) => {
    try {
      await updateSearch(id, editData);
      setEditingId(null);
      setSuccessMsg('Search updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchSearches();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update search');
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  

  if (loading) return <div className="card"><p>Loading saved searches...</p></div>;
  if (error) return <div className="card error-msg"><p>{error}</p></div>;

  return (
    <div className="saved-searches card">
      <h2>Saved Searches</h2>

      {successMsg && <p className="success-msg">{successMsg}</p>}

      {searches.length === 0 ? (
        <p className="no-data">No saved searches yet. Search for a location and save it!</p>
      ) : (
        <div className="searches-list">
          {searches.map((search) => (
            <div key={search.id} className="search-item">
              {editingId === search.id ? (
                // EDIT MODE
                <div className="edit-form">
                  <div className="edit-fields">
                    <div className="edit-field">
                      <label>Location</label>
                      <input
                        type="text"
                        value={editData.location}
                        onChange={(e) => setEditData({
                          ...editData,
                          location: e.target.value
                        })}
                        className="edit-input"
                      />
                    </div>
                    <div className="edit-field">
                      <label>Date From</label>
                      <input
                        type="date"
                        value={editData.date_from}
                        onChange={(e) => setEditData({
                          ...editData,
                          date_from: e.target.value
                        })}
                        className="edit-input"
                      />
                    </div>
                    <div className="edit-field">
                      <label>Date To</label>
                      <input
                        type="date"
                        value={editData.date_to}
                        onChange={(e) => setEditData({
                          ...editData,
                          date_to: e.target.value
                        })}
                        className="edit-input"
                      />
                    </div>
                  </div>
                  <div className="edit-actions">
                    <button
                      onClick={() => handleEditSave(search.id)}
                      className="save-btn"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // VIEW MODE
                <div className="search-info">
                  <div className="search-details">
                    <h3>{search.location}, {search.country}</h3>
                    <p className="search-meta">
                      {search.temperature_c}°C | {search.condition} |
                      Humidity: {search.humidity}%
                    </p>
                    <p className="search-dates">
                      {search.date_from} → {search.date_to}
                    </p>
                    <p className="search-created">
                      Saved: {new Date(search.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="search-actions">
                    <button
                      onClick={() => handleEditStart(search)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(search.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedSearches;