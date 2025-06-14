import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthFetch } from './authFetch';

export default function Claim() {
  const { id } = useParams(); // found_person id
  const navigate = useNavigate();
  const authFetch = useAuthFetch();
  const [formData, setFormData] = useState({
    cname: '',
    contact: '',
    relation: '',
    message: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    const nameRegex = /^[A-Za-z\s]+$/;
    const contactRegex = /^\d{10}$/;
    if (!nameRegex.test(formData.cname)) {
      alert('Name is not in proper format .It should only contain letters and spaces (no numbers).');
      return;
    }
  if (!nameRegex.test(formData.relation)) {
      alert('Relation is not in proper format .It should only contain letters and spaces (no numbers).');
      return;
    }
     if (!contactRegex.test(formData.contact)) {
      alert('Contact number is not in proper format .It must be exactly 10 digits (no letters).');
      return;
    }

    const payload = {
      ...formData,
      found_person: id, // link foreign key
    };

    authFetch('http://127.0.0.1:8000/api/claim/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify(payload),
})
      .then(res => {
        if (!res.ok) throw new Error('Error submitting claim');
        return res.json();
      })
      .then(() => {
        alert('Submitted successfully');
        navigate('/foundPage');
      })
      .catch(err => {
        console.error(err);
        alert('Submission failed');
      });
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Let's connect with your loved one </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Your Name *</label>
          <input type="text" name="cname" className="form-control" required onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Contact Number *</label>
          <input type="text" name="contact" className="form-control" required onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Relation with Person *</label>
          <input type="text" name="relation" className="form-control" required onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Message</label>
          <textarea name="message" rows="3" className="form-control" onChange={handleChange}></textarea>
        </div>
        <button type="submit" className="btn btn-success mt-3">Submit</button>
      </form>
    </div>
  );
}
