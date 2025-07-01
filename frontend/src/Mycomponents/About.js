import React from 'react';
import './About.css';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="about-container">
      <h2 className="about-heading">About Our Mission</h2>
      <p className="about-description">
        We help families reconnect by allowing people to report missing individuals and share details about those found.
      </p>

      <div className="card-container">
        <div className="about-card">
          <h3>Report Missing</h3>
          <p>If your loved one is missing, submit their details and start the search with our support.</p>
          <Link to="/report" className="cusbtn">Submit Now</Link>
        </div>

        <div className="about-card">
          <h3>Report Found</h3>
          <p>If you see someone lost or wandering, report their details and help reunite them with their family.</p>
          <Link to="/foundPage" className="cusbtn">Report Now</Link>
        </div>

        <div className="about-card">
          <h3>Reunite</h3>
          <p>Verify whether a match has been identified for the person you reported.</p>
          <Link to="/profile" className="cusbtn">Verify Now</Link>
        </div>
      </div>
    </div>
  );
}
