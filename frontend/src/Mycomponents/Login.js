import React, { useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';  // Make sure this path is correct
import './Login.css';

const LOGIN_URL = 'http://localhost:8000/api/token/';
const REGISTER_URL = 'http://localhost:8000/api/register/';

export default function Login() {
  const boxRef = useRef(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Use AuthContext login

  // Login form states
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Signup form states
  const [signUsername, setSignUsername] = useState('');
  const [signPassword, setSignPassword] = useState('');
  const [signError, setSignError] = useState('');
  const [signSuccess, setSignSuccess] = useState('');

  const toggleForm = () => {
    boxRef.current.classList.toggle('sign-up-active');
    setLoginError('');
    setSignError('');
    setSignSuccess('');
  };

  // Handle Login submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });

      if (!response.ok) {
        setLoginError('Invalid username or password');
        return;
      }

      const data = await response.json();

      // Store tokens
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);

      // Update auth context state
      login(data.access, data.refresh);

      // Redirect to home page
      navigate('/');
    } catch {
      setLoginError('Network error. Please try again.');
    }
  };

  // Handle Signup submit
  const handleSignup = async (e) => {
    e.preventDefault();
    setSignError('');
    setSignSuccess('');

    try {
      const response = await fetch(REGISTER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: signUsername, password: signPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSignError(data.error || 'Signup failed');
        return;
      }

      setSignSuccess('Signup successful! Please login.');
      // Switch to login form on successful signup
      boxRef.current.classList.remove('sign-up-active');
    } catch {
      setSignError('Network error. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box" ref={boxRef}>
        <div className="login-forms-wrapper">
          {/* Login Form */}
          <div className="login-form-section">
            <form className="login-form" onSubmit={handleLogin}>
              <div className="login-input-group">
                <input
                  type="text"
                  placeholder="Username"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  required
                />
              </div>
              <div className="login-input-group">
                <input
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="login-btn">Login</button>
              {loginError && <p className="error">{loginError}</p>}
              <p className="login-toggle-text">
                Don't have an account? <b onClick={toggleForm}>Sign up</b>
              </p>
            </form>
          </div>

          {/* Signup Form */}
          <div className="login-form-section">
            <form className="login-form" onSubmit={handleSignup}>
              <div className="login-input-group">
                <input
                  type="text"
                  placeholder="Username"
                  value={signUsername}
                  onChange={(e) => setSignUsername(e.target.value)}
                  required
                />
              </div>
              <div className="login-input-group">
                <input
                  type="password"
                  placeholder="Password"
                  value={signPassword}
                  onChange={(e) => setSignPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="login-btn">Sign Up</button>
              {signError && <p className="error">{signError}</p>}
              {signSuccess && <p className="success">{signSuccess}</p>}
              <p className="login-toggle-text">
                Already have an account? <b onClick={toggleForm}>Sign in here</b>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
