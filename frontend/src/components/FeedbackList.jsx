import React from 'react';
import FeedbackItem from './FeedbackItem';

export default function FeedbackList({ feedbacks, onAcknowledge, onEdit, showAcknowledgeButton = false, showEditButton = false }) {
  return (
    <div className='feedback-container'>
      <ul className="feedback-list">
      {feedbacks.map(fb => (
        <FeedbackItem
          key={fb.id}
          feedback={fb}
          onAcknowledge={onAcknowledge}
          onEdit={onEdit}
          showAcknowledgeButton={showAcknowledgeButton}
          showEditButton={showEditButton}
        />
      ))}
    </ul>
    </div>
    
  );
}