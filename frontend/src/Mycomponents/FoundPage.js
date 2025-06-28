import React, { useEffect, useState } from 'react';
import './FoundPage.css';
import { useNavigate } from 'react-router-dom';
import { useAuthFetch } from './authFetch'; 

export default function FoundPage() {
  const [foundPeople, setFoundPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const authFetch = useAuthFetch();
  const navigate = useNavigate();
  useEffect(() => {
  const checkVerification = async () => {
    try {
      const res = await authFetch('http://127.0.0.1:8000/api/check-verification/');
      const data = await res.json();

      if (!data.is_verified) {
        alert("🚫 You must verify your identity before accessing this page.");
        navigate('/verify');  // redirect to verify page
      }
    } catch (err) {
      console.error("🔒 Verification check failed:", err);
      navigate('/login'); // fallback in case token is invalid
    }
  };

  checkVerification(); // run on mount
}, [authFetch, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await authFetch('http://127.0.0.1:8000/api/found/');
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        setFoundPeople(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch found people:', err);
        setFoundPeople([]);
      }
    };

    fetchData();
  }, [authFetch]);

  return (
    <div className="container py-5 found-page">
      <h2 className="mb-4 text-center">People Reported as Found</h2>

      <div className="row">
        {foundPeople.map(person => (
          <div key={person.id} className="col-6 col-sm-4 col-md-3 mb-4">
            <div
              className="square-photo"
              onClick={() => setSelectedPerson(person)}
              style={{
                backgroundImage: `url(${person.photo})`,
                backgroundSize: 'cover',
                height: '200px',
              }}
            ></div>
          </div>
        ))}
      </div>

      <div className="text-center mt-5">
        <button
          className="btn btn-success"
          onClick={() => navigate('/reportFound')}
        >
          Report Found Person
        </button>
      </div>

      {selectedPerson && (
        <div className="found-modal">
          <div className="modal-content p-4">
            <button
              className="btn-close"
              onClick={() => setSelectedPerson(null)}
              style={{ float: 'right' }}
            ></button>
            <h3>{selectedPerson.name || 'Unnamed Person'}</h3>
            <img
              src={selectedPerson.photo}
              alt={selectedPerson.name}
              className="img-fluid mb-3"
              style={{ maxHeight: '200px', borderRadius: '10px' }}
            />
            <p><strong>Description:</strong> {selectedPerson.description || 'N/A'}</p>
            <p><strong>Date Found:</strong> {selectedPerson.date_found}</p>
            <p><strong>Found at:</strong> {selectedPerson.address}, {selectedPerson.city}, {selectedPerson.state}</p>
            <p className="contact-highlight"><strong>Contact:</strong> {selectedPerson.contact}</p>

            <button
              className="btn btn-primary mt-3"
              onClick={() => navigate(`/claim/${selectedPerson.id}`)}
            >
              I know this Person
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
