import React from 'react';

export default function TeamList({ employees, onSelect, selectedId }) {
  return (
    <div>
      {employees.map(emp => (
        <div
          key={emp.id}
          className={`team-member ${selectedId === emp.id ? 'selected' : ''}`}
          onClick={() => onSelect(emp)}
        >
          {emp.username}
        </div>
      ))}
    </div>
  );
}
