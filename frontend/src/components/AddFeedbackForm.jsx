import React, { useEffect, useState } from 'react';
import api from '../api';


export default function AddFeedbackForm({ employeeId, feedbackToEdit, onSuccess }) {
  const isEditing = !!feedbackToEdit;

  const [strengths, setStrengths] = useState('');
  const [areasToImprove, setAreasToImprove] = useState('');
  const [sentiment, setSentiment] = useState('positive');

  useEffect(() => {
    console.log("Editing feedback:", feedbackToEdit);
    if (feedbackToEdit) {
      setStrengths(feedbackToEdit.strengths || '');
      setAreasToImprove(feedbackToEdit.areas_to_improve || '');
      setSentiment(feedbackToEdit.sentiment || 'positive');
    }
  }, [feedbackToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You are not logged in or token is missing");
      console.error("Token missing from localStorage");
      return;
    }

    try {
      const url = feedbackToEdit
        ? `/api/feedback/${feedbackToEdit.id}`
        : '/api/feedback/';

      const method = feedbackToEdit ? 'put' : 'post';

      const res = await api[method](url, {
        employee_id: employeeId,
        strengths,
        areas_to_improve: areasToImprove,
        sentiment
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Feedback submitted:", res.data);
      onSuccess();
      setStrengths('');
      setAreasToImprove('');
      setSentiment('positive');
    } catch (err) {
      console.error("Feedback submission failed:", err);
      alert("Failed to submit feedback. Login again if needed.");
    }
  };

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <textarea placeholder="Strengths" value={strengths} onChange={(e) => setStrengths(e.target.value)} required />
      <textarea placeholder="Areas to Improve" value={areasToImprove} onChange={(e) => setAreasToImprove(e.target.value)} required />
      <select value={sentiment} onChange={(e) => setSentiment(e.target.value)}>
        <option value="positive">Positive</option>
        <option value="neutral">Neutral</option>
        <option value="negative">Negative</option>
      </select>
      <button type="submit">{isEditing ? 'Update Feedback' : 'Submit Feedback'}</button>
    </form>
  );
}
