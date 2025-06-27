import React, { useEffect, useState } from 'react';
import FeedbackList from '../components/FeedbackList';
import axios from 'axios';

export default function EmployeeDashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [user, setUser] = useState(null);

  const loadFeedbacks = async () => {
    const token = localStorage.getItem('token');
    const userRes = await axios.get('/api/whoami', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(userRes.data);
    const res = await axios.get(`/api/feedback/employee/${userRes.data.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setFeedbacks(res.data);
  };

  const handleAcknowledge = async (feedbackId) => {
    try {
      await axios.post(`/api/feedback/${feedbackId}/acknowledge`, null, {
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

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Employee Dashboard</h2>
        <button className='logout-btn' onClick={() => {
          localStorage.clear();
          window.location.href = '/login';
        }}>Logout</button>
      </div>
      <div className="right-panel">
        {user && <h3>Feedback for {user.username}</h3>}
        <FeedbackList
          feedbacks={feedbacks}
          onAcknowledge={handleAcknowledge}
          showAcknowledgeButton={true}
        />
      </div>
    </div>
  );
}
