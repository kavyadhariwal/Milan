import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthFetch } from './authFetch';
import './ReportFound.css';

export default function ReportFound() {
  const navigate = useNavigate();
  const authFetch = useAuthFetch();

  const [formData, setFormData] = useState({
    name: '',
    photo: null,
    description: '',
    date_found: '',
    contact: '',
    address: '',
    state: '',
    city: '',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     const { name, contact, date_found, city  } = formData;

    
    const nameRegex = /^[A-Za-z\s]+$/;
    if (name && !nameRegex.test(name)) {
      alert('Name is not in proper format .It should only contain letters and spaces (no numbers).');
      return;
    }
     if (city && !nameRegex.test(city)) {
      alert(' City is not in proper format .It should only contain letters and spaces (no numbers).');
      return;
    }


    if (date_found) {
      const selectedDate = new Date(date_found);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate > today+1) {
        alert('Date cannot be in the future.');
        return;
      }
    }

   
    const contactRegex = /^\d{10}$/;
    if (!contactRegex.test(contact)) {
      alert('Contact is not in proper format .It number must be exactly 10 digits (no letters).');
      return;
    }
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    try {
      const res = await authFetch('http://127.0.0.1:8000/api/found/', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }

      alert('Found person reported successfully');
      navigate('/foundPage');
    } catch (err) {
      console.error('Submission failed:', err.message);
      alert('Submission failed. Please check your login or image format.');
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Report a Found Person</h2>
       <div className="report-container">
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="report-form">
        <div className="mb-3">
          <label>Name (if known)</label>
          <input type="text" className="form-control" name="name" onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Photo *</label>
          <input type="file" className="form-control" name="photo" required onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Date Found *</label>
          <input type="date" className="form-control" name="date_found" required onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Description</label>
          <textarea className="form-control" name="description" rows="3" onChange={handleChange}></textarea>
        </div>
        <div className="mb-3">
          <label>Address</label>
          <input type="text" className="form-control" name="address" onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Contact *</label>
          <input type="text" className="form-control" name="contact" required onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>State</label>
          <select name="state" className="form-control" onChange={handleChange}>
            <option value="">Select State</option>
            <option value="RJ">Rajasthan</option>
            <option value="GJ">Gujarat</option>
            <option value="PB">Punjab</option>
          </select>
        </div>
        <div className="mb-3">
          <label>City</label>
          <input type="text" className="form-control" name="city" onChange={handleChange} />
        </div>
        <button type="submit" className="cusbtn mt-3">Submit Report</button>
      </form>
      </div>
    </div>
  );
}
