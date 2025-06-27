import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveAuth } from '../auth';
import { AuthContext } from '../context/AuthContext';
import api from '../api';


export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setToken, setRole } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await api.post('/api/auth/login', new URLSearchParams({
      username,
      password,
    }));
    const { access_token, role } = res.data;

    saveAuth(access_token, role);
    setToken(access_token);
    setRole(role);

    if (role === 'manager') navigate('/manager/dashboard');
    else navigate('/employee/dashboard');
  } catch (err) {
    alert('Login failed');
  }
};


  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Username" value={username}
          onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      <button onClick={() => navigate('/register')}>Go to Register</button>
    </div>
  );
}
