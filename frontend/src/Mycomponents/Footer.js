import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './Footer.css'; 

export default function Footer() {
  return (
    <footer className="footer d-flex flex-wrap justify-content-between align-items-center py-3 px-4 mt-4 border-top">
      <div className="col-md-4 d-flex align-items-center">
       
        <span className="mb-3 mb-md-0">© 2025 Milan</span>
      </div>

      <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
        <li className="ms-3">
          <a href="#" aria-label="Instagram">
            <i className="fab fa-instagram icon"></i>
          </a>
        </li>
        <li className="ms-3">
          <a href="#" aria-label="Facebook">
            <i className="fab fa-facebook icon"></i>
          </a>
        </li>
      </ul>
    </footer>
  );
}
