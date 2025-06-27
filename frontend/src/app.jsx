import React, { useContext, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import ManagerDashboard from './pages/ManagerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import { AuthContext } from './context/AuthContext';
import Register from './pages/Register';

export default function App() {
  const { token, role } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
  if (!token) {
    navigate('/login');
  } else if (role === 'manager') {
    navigate('/manager/dashboard');
  } else if (role === 'employee') {
    navigate('/employee/dashboard');
  }
  }, [token, role]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/manager/dashboard" element={<ManagerDashboard />} />
      <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
    </Routes>
  );
}
