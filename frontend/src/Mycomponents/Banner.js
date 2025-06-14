import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './Banner.css';
import abc from '../images/abc.jpg';

export default function Banner() {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="hero-banner" style={{ backgroundImage: `url(${abc})` }}>
      <h1 className="text-dark">Reunite with your family members</h1>
      <p className="col-lg-8 mx-auto fs-5 text-light">Find your loved ones now</p>
      <div className="d-inline-flex gap-2 mb-5">
        {!isLoggedIn && (
          <button onClick={handleGetStarted} className="btn btn-primary btn-lg px-4">
            Get Started
          </button>
        )}
      </div>
    </div>
  );
}
