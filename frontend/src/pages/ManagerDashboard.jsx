import React, { useEffect, useState } from 'react';
import TeamList from '../components/TeamList';
import FeedbackList from '../components/FeedbackList';
import AddFeedbackForm from '../components/AddFeedbackForm';
import AssignEmployeeModal from '../components/AssignEmployeeModal';
import axios from 'axios';

export default function ManagerDashboard() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editFeedback, setEditFeedback] = useState(null);

  const loadEmployees = async () => {
    const res = await axios.get('/api/team/members', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setEmployees(res.data);
  };

  const loadFeedbacks = async (employeeId) => {
    const res = await axios.get(`/api/feedback/employee/${employeeId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setFeedbacks(res.data);
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmployee) loadFeedbacks(selectedEmployee.id);
  }, [selectedEmployee]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Manager Dashboard</h2>
        <button className="logout-btn" onClick={() => {
          localStorage.clear();
          window.location.href = '/login';
        }}>Logout</button>
      </div>

      <div className="main-panel">
        
        {/* Left panel with team */}
        <div className="left-panel">
          <TeamList
            employees={employees}
            selectedId={selectedEmployee?.id}
            onSelect={(emp) => {
              setSelectedEmployee(emp);
              setShowForm(false);
              setEditFeedback(null);
            }}
          />
          <div className="bottom-left">
            <button onClick={() => setShowAssignModal(true)}>+ Add Employee</button>
          </div>
        </div>

        {/* Right panel with feedbacks and form */}
        <div className="right-panel">
          {selectedEmployee && (
            <>
              <FeedbackList
                feedbacks={feedbacks}
                onEdit={(fb) => {
                  setEditFeedback(fb);
                  setShowForm(true);
                }}
                showEditButton={true}
              />

              <div className="bottom-right">
                {showForm && (
                  <div className="form-wrapper">
                    <AddFeedbackForm
                      employeeId={selectedEmployee.id}
                      feedbackToEdit={editFeedback}
                      onSuccess={() => {
                        loadFeedbacks(selectedEmployee.id);
                        setShowForm(false);
                        setEditFeedback(null);
                      }}
                    />
                  </div>
                )}
                <button onClick={() => {
                  setShowForm(!showForm);
                  if (!showForm) setEditFeedback(null);
                }}>
                  {showForm ? 'Close' : '+ Add Feedback'}
                </button>
              </div>

            </>
          )}
        </div>
      </div>

      {showAssignModal && (
        <AssignEmployeeModal onClose={() => {
          setShowAssignModal(false);
          loadEmployees();
        }} />
      )}
    </div>
  );
}
