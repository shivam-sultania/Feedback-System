import React, { useEffect, useState } from 'react';
import FeedbackList from '../components/FeedbackList';
import LogoutButton from '../components/LogoutButton';
import api from '../api';

export default function EmployeeDashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [user, setUser] = useState(null);

  const loadFeedbacks = async () => {
    const token = localStorage.getItem('token');
    const userRes = await api.get('/api/whoami', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(userRes.data);
    const res = await api.get(`/api/feedback/employee/${userRes.data.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setFeedbacks(res.data);
  };

  const handleAcknowledge = async (feedbackId) => {
    try {
      await api.post(`/api/feedback/${feedbackId}/acknowledge`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      await loadFeedbacks();
    } catch (err) {
      console.error("Acknowledge failed:", err);
      alert("Failed to acknowledge feedback.");
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const unacknowledgedCount = feedbacks.filter(fb => !fb.acknowledged).length;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Employee Dashboard</h2>
        <LogoutButton />
      </div>
      <div className="right-panel">
        {user && (
          <>
            <p style={{ color: 'red', fontWeight: 'bold', marginLeft:20 }}>
              Unacknowledged: {unacknowledgedCount}
            </p>
          </>
        )}
        <FeedbackList
          feedbacks={feedbacks}
          onAcknowledge={handleAcknowledge}
          showAcknowledgeButton={true}
        />
      </div>
    </div>
  );
}
