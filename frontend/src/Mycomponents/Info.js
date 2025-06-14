import React, { useState } from 'react';
import './Report.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthFetch } from './authFetch';  // ← import your hook

export default function Info() {
  const location = useLocation();
  const navigate = useNavigate();
  const authFetch = useAuthFetch();          // ← instantiate

  const personId = location.state?.personId;
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [relation, setRelation] = useState('');
  const [address, setAddress] = useState('');
  const [address1, setAddress1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    // validations...
    const nameRegex     = /^[A-Za-z\s]+$/;
    const noDigitsRegex = /^[^\d]+$/;
    const contactRegex  = /^\d{10}$/;
    if (!nameRegex.test(fullname)) {
      alert('Name should only contain letters and spaces.');
      return setSubmitting(false);
    }
    if (!noDigitsRegex.test(relation)) {
      alert('Relation should only contain letters and spaces.');
      return setSubmitting(false);
    }
    if (!noDigitsRegex.test(city)) {
      alert('City should only contain letters and spaces.');
      return setSubmitting(false);
    }
    if (!contactRegex.test(contact)) {
      alert('Contact must be exactly 10 digits.');
      return setSubmitting(false);
    }
    if (!personId) {
      alert('Missing person ID. Please start from the report page.');
      return setSubmitting(false);
    }

    const formData = new FormData();
    formData.append('reported_person', personId);
    formData.append('fullname', fullname);
    formData.append('email', email);
    formData.append('contact', contact);
    formData.append('relation', relation);
    formData.append('address', address);
    formData.append('address1', address1);
    formData.append('state', state);
    formData.append('city', city);

    try {
      const res = await authFetch('http://127.0.0.1:8000/api/complainee/', {
        method: 'POST',
        body: formData,
      });

      // authFetch returns parsed JSON, but status under 2xx will succeed
      setSuccessMsg('Details submitted! Redirecting…');
      setTimeout(() => navigate('/'), 1500);

    } catch (err) {
      console.error('Submission error:', err);
      setErrorMsg('Failed to submit—please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="report-container">
      <form className="report-form" onSubmit={handleSubmit}>
        <h2>Add your details</h2>

        {successMsg && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{successMsg}</div>
        )}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{errorMsg}</div>
        )}

        {/* ...all your inputs as before, with disabled={submitting} */}
        {/* Full Name */}
        <div className="form-group mb-3">
          <label>Full Name</label>
          <input
            type="text"
            className="form-control"
            value={fullname}
            onChange={e => setFullname(e.target.value)}
            disabled={submitting}
            required
          />
        </div>

        {/* Email */}
        <div className="form-group mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={submitting}
            required
          />
        </div>

        {/* Contact */}
        <div className="form-group mb-3">
          <label>Contact</label>
          <input
            type="text"
            className="form-control"
            value={contact}
            onChange={e => setContact(e.target.value)}
            disabled={submitting}
            required
          />
        </div>

        {/* Relation */}
        <div className="form-group mb-4">
          <label>Relation</label>
          <textarea
            className="form-control"
            rows="4"
            value={relation}
            onChange={e => setRelation(e.target.value)}
            disabled={submitting}
            required
          />
        </div>

        {/* Address */}
        <div className="form-group mb-3">
          <label>Address</label>
          <input
            type="text"
            className="form-control"
            value={address}
            onChange={e => setAddress(e.target.value)}
            disabled={submitting}
            required
          />
        </div>

        {/* Address 2 */}
        <div className="form-group mb-3">
          <label>Address 2</label>
          <input
            type="text"
            className="form-control"
            value={address1}
            onChange={e => setAddress1(e.target.value)}
            disabled={submitting}
          />
        </div>

        {/* City */}
        <div className="form-group mb-3">
          <label>City</label>
          <input
            type="text"
            className="form-control"
            value={city}
            onChange={e => setCity(e.target.value)}
            disabled={submitting}
            required
          />
        </div>

        {/* State */}
        <div className="form-group mb-3">
          <label>State</label>
          <select
            className="form-select"
            value={state}
            onChange={e => setState(e.target.value)}
            disabled={submitting}
            required
          >
            <option value="">Choose…</option>
            <option value="GJ">Gujarat</option>
            <option value="RJ">Rajasthan</option>
            <option value="PB">Punjab</option>
          </select>
        </div>

        <div className="form-group">
          <button
            type="submit"
            className="submit-btn btn btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Submitting…' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}
