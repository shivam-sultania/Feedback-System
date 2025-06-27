import React from 'react';

export default function FeedbackItem({ feedback, onAcknowledge, onEdit, showAcknowledgeButton = false, showEditButton = false }) {
  return (
    <li className={`feedback-item ${feedback.acknowledged ? 'ack' : 'unack'}`}>
      <strong>{feedback.sentiment.toUpperCase()}</strong> - {feedback.strengths}<br />
      <small>
        From: {feedback.manager_name || 'You'} | {new Date(feedback.created_at).toLocaleString()}
      </small><br />
      {(feedback.updated_at !== feedback.created_at && feedback.manager_name) && (
        <small>[Updated: {new Date(feedback.updated_at).toLocaleString()}]</small>
      )}<br />

      {showAcknowledgeButton && !feedback.acknowledged && (
        <button onClick={() => onAcknowledge(feedback.id)}>Acknowledge</button>
      )}

      {showEditButton && (
        <button onClick={() => onEdit(feedback)}>Edit</button>
      )}
    </li>
  );
}

