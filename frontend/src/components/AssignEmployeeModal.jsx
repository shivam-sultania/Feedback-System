import React, { useEffect, useState } from 'react';
import api from '../api';

export default function AssignEmployeeModal({ onClose }) {
  const [unassigned, setUnassigned] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUnassigned = async () => {
    const res = await api.get('/api/team/unassigned', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setUnassigned(res.data);
  };

  useEffect(() => {
    loadUnassigned();
  }, []);

  const assign = async (employeeId) => {
    setLoading(true);
    try {
      await api.post('/api/team/assign', {
        employee_id: employeeId
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      await loadUnassigned(); // 🔁 refresh list
    } catch (err) {
      alert(err.response?.data?.detail || 'Assignment failed');
    }
    setLoading(false);
  };

  return (
    <div className='modal-overlay'>
      <div className="modal-content">
      <h3>Assign Employee</h3>
      {unassigned.length === 0 ? (
        <p>No unassigned employees left.</p>
      ) : (
        <ul>
          {unassigned.map(emp => (
            <li key={emp.id}>
              <span>{emp.username}</span>
              <button disabled={loading} onClick={() => assign(emp.id)}>
                Assign
              </button>
            </li>
          ))}
        </ul>
      )}
      <button className="close-btn" onClick={onClose}>Close</button>
    </div>
    </div>
  );
}
