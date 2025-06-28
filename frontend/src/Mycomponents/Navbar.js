import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function Navbar() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault(); 
    logout();           
    navigate('/login'); 
  };

  return (
    <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start bg-dark px-3 py-3">
      <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-light text-decoration-none">
        <h4 className="m-0 me-4">Milan</h4>
      </a>

      <ul className="nav mb-0">
        <li className="nav-item"><a href="/report" className="nav-link text-light px-3">Report</a></li>
        <li className="nav-item"><a href="/foundPage" className="nav-link text-light px-3">Found</a></li>
      </ul>

      <div className="dropdown ms-auto">
        <a
          href="#"
          className="d-flex align-items-center text-light text-decoration-none dropdown-toggle"
          id="dropdownUser"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          style={{ fontSize: '1.8rem' }}
        >
          <i className="fas fa-user-circle"></i>
        </a>

        <ul className="dropdown-menu dropdown-menu-end text-small" aria-labelledby="dropdownUser">
          <li><a className="dropdown-item" href="/profile">Profile</a></li>
          <li><hr className="dropdown-divider" /></li>
          <li><a className="dropdown-item" href="/verify">Verify Aadhar</a></li>
          <li><hr className="dropdown-divider" /></li>
          {isLoggedIn && (
            <li>
              <a className="dropdown-item" href="/" onClick={handleLogout}>
                Logout
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
