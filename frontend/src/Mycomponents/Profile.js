
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

export default function Profile() {
  const [userInfo, setUserInfo] = useState(null);
  const [reportedPersons, setReportedPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getTokens = () => ({
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
  });

  const saveAccessToken = (token) => {
    localStorage.setItem('accessToken', token);
  };

  const refreshAccessToken = async (refreshToken) => {
    const res = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    if (!res.ok) throw new Error('Token refresh failed');
    const data = await res.json();
    saveAccessToken(data.access);
    return data.access;
  };

  const fetchWithAuth = async (url, options = {}) => {
    let { accessToken, refreshToken } = getTokens();
    let authOptions = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    };

    let res = await fetch(url, authOptions);
    if (res.status === 401 && refreshToken) {
      accessToken = await refreshAccessToken(refreshToken);
      authOptions.headers.Authorization = `Bearer ${accessToken}`;
      res = await fetch(url, authOptions);
    }
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  };

  const deleteReport = async (complaineeId) => {
    const { accessToken } = getTokens();
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/complainee/${complaineeId}/`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (!res.ok) throw new Error('Delete failed');
      setReportedPersons((prev) =>
        prev.filter((item) => item.id !== complaineeId)
      );
    } catch (err) {
      console.error('Error deleting report:', err);
      alert('Failed to delete report.');
    }
  };

  const markAsNotified = async (id) => {
    const { accessToken } = getTokens();
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/complainee/mark_notified/${id}/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (res.ok) {
        setReportedPersons((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, notified_about_match: true } : p
          )
        );
      }
    } catch (err) {
      console.error('Error marking as notified:', err);
    }
  };
  useEffect(() => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    alert('🔒 Please login first.');
    navigate('/login');
  }
}, []);

  useEffect(() => {

  const loadProfileData = async () => {
    setError(null);
    setLoading(true);
    try {
      const profileData = await fetchWithAuth('http://127.0.0.1:8000/api/profile/');
      const reportedData = await fetchWithAuth('http://127.0.0.1:8000/api/complainee/list/');
      setUserInfo(profileData);
      setReportedPersons(reportedData);
    } catch (err) {
      setError(err.message);
      // redirect to login if token issue
      if (err.message.toLowerCase().includes('token')) {
        localStorage.clear();
        setTimeout(() => navigate('/login'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  // run immediately on mount
  loadProfileData();


  const interval = setInterval(loadProfileData, 30_000);

  // cleanup on unmount
  return () => clearInterval(interval);
}, [navigate]);


  if (loading)
    return <p className="text-center mt-20">Loading profile...</p>;
  if (error)
    return (
      <p className="text-center text-red-500 mt-20">
        {error}
      </p>
    );
  if (!userInfo) return null;

  return (
    <div className="profile-container">
    <div className="profile-box">
      <div className="profile-header">
        <h1>Welcome, {userInfo.name}</h1>
        <p>{userInfo.email}</p>
      </div>

      <h2>People You Reported</h2>
      <div className="reports-list">
        {reportedPersons.length === 0 ? (
          <p>You haven't reported anyone yet.</p>
        ) : (
          reportedPersons.map((p) => (
            <div key={p.id} className="report-card">
              <button
                className="delete-btn"
                onClick={() => deleteReport(p.id)}
              >
                Delete
              </button>
              <div className="report-info">
                <h3>{p.reported_person.fname}</h3>
                <p>
                  <strong>Age:</strong> {p.reported_person.age}
                </p>
                <p>
                  <strong>Gender:</strong> {p.reported_person.gender}
                </p>
                <p>
                  <strong>Description:</strong> {p.reported_person.desc}
                </p>
                <p>
                  <strong>Last Seen:</strong> {p.reported_person.date}
                </p>
                <p>
                  <strong>City/State:</strong>{' '}
                  {p.reported_person.city}, {p.reported_person.state}
                </p>
              </div>

              {p.reported_person.is_matched && (
                <div className="match-banner">
                  🎉 Good News! A match has been found!
                  {!p.notified_about_match && (
                    <button onClick={() => markAsNotified(p.id)}>
                      Mark as seen
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
    </div>
  );
}
