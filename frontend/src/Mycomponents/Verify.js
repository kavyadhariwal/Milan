import React, { useState } from 'react';
import './Report.css';
import { useNavigate } from 'react-router-dom';
import { useAuthFetch } from './authFetch';
import { useEffect } from 'react';

export default function Verify() {
  const [aadhaarImage, setAadhaarImage] = useState(null);
  const [selfieImage, setSelfieImage] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const authFetch = useAuthFetch();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'aadhaar_photo') setAadhaarImage(files[0]);
    if (name === 'selfie_photo') setSelfieImage(files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setSubmitting(true);

    if (!aadhaarImage || !selfieImage) {
      setErrorMsg('Both Aadhaar and selfie images are required.');
      setSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('aadhaar_photo', aadhaarImage);
    formData.append('selfie_photo', selfieImage);

    try {
      const res = await authFetch('http://127.0.0.1:8000/api/verify/', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Verification failed');
      }

      const data = await res.json();
      setSuccessMsg('✅ Verification successful!');
      setTimeout(() => navigate('/'), 2000);

    } catch (err) {
      setErrorMsg(err.message || 'Verification failed.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    alert('🔒 Please login first.');
    navigate('/login');
  }
}, []);
  return (
    <div className="report-container">
      <form className="report-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <h2>Identity Verification</h2>

        {successMsg && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{successMsg}</div>
        )}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{errorMsg}</div>
        )}

        <div className="form-group mb-3">
          <label>Aadhaar Card Image</label>
          <input
            type="file"
            className="form-control"
            name="aadhaar_photo"
            accept="image/*"
            onChange={handleFileChange}
            disabled={submitting}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label>Selfie Image</label>
          <input
            type="file"
            className="form-control"
            name="selfie_photo"
            accept="image/*"
            onChange={handleFileChange}
            disabled={submitting}
            required
          />
        </div>

        <div className="form-group">
          <button
            type="submit"
            className="submit-btn cusbtn"
            disabled={submitting}
          >
            {submitting ? 'Verifying…' : 'Verify Identity'}
          </button>
        </div>
      </form>
    </div>
  );
}
