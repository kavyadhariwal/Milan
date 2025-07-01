import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Story.css';
import { useAuthFetch } from './authFetch'; // ✅ Correct path to authFetch

export default function Story() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [complainees, setComplainees] = useState([]);
  const [loading, setLoading] = useState(true);
  const authFetch = useAuthFetch();

 useEffect(() => {
  const fetchData = async () => {
    try {
      const resPerson = await authFetch(`http://127.0.0.1:8000/api/person/${id}/`);
      if (!resPerson.ok) throw new Error('Failed to fetch person');
      const personData = await resPerson.json();
      setPerson(personData);

      const resComplainees = await authFetch(`http://127.0.0.1:8000/api/complainee/list/?reported_person=${id}`);
      if (!resComplainees.ok) throw new Error('Failed to fetch complainees');
      const complaineeData = await resComplainees.json();
      setComplainees(Array.isArray(complaineeData) ? complaineeData : []);
    } catch (error) {
      console.error('Fetch error:', error);
      setPerson(null);
      setComplainees([]);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [id]); // ✅ Only re-run on `id` change


  if (loading) {
    return <div className="story-section"><p>Loading…</p></div>;
  }

  if (!person) {
    return <div className="story-section"><p>Person not found.</p></div>;
  }

  return (
    <section className="story-section">
      <div className="container py-5">
        <div className="story-card mx-auto">
          <div className="story-header">
            <h1 className="story-name">{person.fname}</h1>
          </div>

          <div className="story-content row gx-5">
            {/* Left column */}
            <div className="col-md-4 text-center border-end">
              <div className="story-icon">
                <img
                  src={person.photo ? person.photo : "/placeholder.png"}
                  className="story-icon-img"
                  alt={`Report of ${person.fname}`}
                />
              </div>
              <h4 className="name">{person.fname}</h4>
              <div className="name-underline mx-auto"></div>
            </div>

            {/* Right column */}
            <div className="col-md-8">
              <p className="details-text">{person.desc}</p>
<p className="details-text text-muted">
  <strong>Last seen at:</strong>{" "}
  {person.address}, {person.address1}, {person.city}, {person.state}
</p>


              {person.is_matched && person.matched_found_person && (
                <div className="alert alert-success mt-4">
                  <strong>Good news!</strong> This person appears to be found.
                  <br />
                </div>
              )}

              {complainees.length > 0 && (
                <>
                  <h5>Reporter Details</h5>
                  {complainees.map(c => (
                    <div key={c.id} style={{ marginBottom: '1rem' }}>
                      <p><strong>Name:</strong> {c.fullname}</p>
                      <p><strong>Relation:</strong> {c.relation}</p>
                      <p><strong>Contact:</strong> {c.contact}</p>
                      <p><strong>Address:</strong> {c.address}, {c.city}, {c.state}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="text-center mt-4">
        <Link to="/" className="cusbtn">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
