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
     <div className="banner-section">
      <div className="container d-flex align-items-center justify-content-between flex-wrap">
        <div className="banner-text">
          <h1 className="display-4 fw-bold">Reunite with your family members</h1>
         <p className="lead">
  In every corner, a loved one is waiting to be found. <br />
  Every photo carries a heartbeat, a hope, a home. <br />
  Let’s bring them back where they belong — with family.
</p>
         
        {!isLoggedIn === true && (
          <button onClick={handleGetStarted} className="cusbtn">
            Get Started
          </button>
        )}
   
        </div>
        <div className="banner-img">
          <img src={abc} alt="Reunion" className="img-fluid rounded" />
        </div>
      </div>
    </div>
  );
}
    
