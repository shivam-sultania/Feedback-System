import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { saveAuth } from '../auth';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const navigate = useNavigate();
  const { setToken, setRole: setAppRole } = useContext(AuthContext);

  const handleRegister = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('/api/auth/register', {
      username,
      password,
      role,
    });
    const { access_token, role: userRole } = res.data;

    saveAuth(access_token, role);
    setToken(access_token);
    setAppRole(role);

    if (role === 'manager') navigate('/manager/dashboard');
    else navigate('/employee/dashboard');
  } catch (err) {
    alert('Registration failed');
  }
};


  return (
    <div className="login-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Username" value={username}
          onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select>
        <button type="submit">Register</button>
      </form>
      <button onClick={() => navigate('/login')}>Back to Login</button>
    </div>
  );
}
