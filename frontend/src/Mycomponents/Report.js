import React, { useEffect,useState } from 'react';
import './Report.css';
import { useNavigate } from 'react-router-dom';
import { useAuthFetch } from './authFetch';


const stateCityMap = {
  RJ: ['Jaipur', 'Jodhpur', 'Udaipur'],
  GJ: ['Ahmedabad', 'Surat', 'Vadodara'],
  PB: ['Amritsar', 'Ludhiana', 'Jalandhar'],
};

export default function Report() {
  const navigate = useNavigate();
  const authFetch = useAuthFetch();


  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [fname, setFname] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [photo, setPhoto] = useState(null);
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('');
  const [address, setAddress] = useState('');
  const [address1, setAddress1] = useState('');

 
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  // Disable submit button while submitting
  const [submitting, setSubmitting] = useState(false);

  const handleStateChange = (e) => {
    setState(e.target.value);
    setCity('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);
    const nameRegex = /^[A-Za-z\s]+$/;
if (!nameRegex.test(fname)) {
  alert('Name is not in proper format .It should only contain letters and spaces (no numbers).');
  setSubmitting(false);
  return;
}
const selectedDate = new Date(date);
const today = new Date();
today.setHours(0, 0, 0, 0); 
selectedDate.setHours(0, 0, 0, 0);
if (selectedDate > today) {
  alert('Date cannot be in the future.');
  setSubmitting(false);
  return;
}

    const formData = new FormData();
    formData.append('fname', fname);
    formData.append('age', age);
    formData.append('gender', gender);
    formData.append('photo', photo);
    formData.append('desc', desc);
    formData.append('date', date);
    formData.append('address', address);
    formData.append('address1', address1);
    formData.append('state', state);
    formData.append('city', city);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/person/', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (response.ok) {
        const personData = await response.json();
        const personId = personData.id;

        if (personId) {
          setSuccessMsg('Report submitted successfully! Redirecting to info page...');
          // Delay navigation so user sees the success message
          setTimeout(() => {
            navigate('/info', { state: { personId } });
          }, 1500);
        } else {
          setErrorMsg('Report submitted but no person ID returned.');
        }
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setErrorMsg('Failed to submit form. Please try again.');
      }
    } catch (error) {
      console.error('Error during submission:', error);
      setErrorMsg('Something went wrong while submitting the form.');
    } finally {
      setSubmitting(false);
    }
  };
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

  return (
    
    <div className="report-container">
      <form onSubmit={handleSubmit} className="report-form">
        <h2 className="mb-4">Report a Missing Person</h2>

       

        {successMsg && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{successMsg}</div>
        )}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{errorMsg}</div>
        )}

        <div className="form-group mb-3">
          <label htmlFor="fname">Full Name</label>
          <input
            type="text"
            className="form-control"
            id="fname"
            value={fname}
            onChange={(e) => setFname(e.target.value)}
            required
            disabled={submitting}
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            className="form-control"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            disabled={submitting}
          />
        </div>

        <div className="form-group mb-3">
          <label>Gender</label>
          <div className="d-flex flex-column ms-2 mt-1">
            <label className="mb-1">
              <input
                type="radio"
                name="gender"
                value="M"
                onChange={(e) => setGender(e.target.value)}
                required
                disabled={submitting}
              />{' '}
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="F"
                onChange={(e) => setGender(e.target.value)}
                disabled={submitting}
              />{' '}
              Female
            </label>
          </div>
        </div>

        <div className="form-group mb-3">
          <label htmlFor="photo">Upload Photo*</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setPhoto(e.target.files[0])}
            required
            disabled={submitting}
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            className="form-control"
            rows="4"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Enter identifying marks, clothing details, etc."
            required
            disabled={submitting}
          ></textarea>
        </div>

        <h4 className="mb-3 mt-4">Last Seen Details</h4>

        <div className="form-group mb-3">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            className="form-control"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            disabled={submitting}
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="inputAddress">Address line 1</label>
          <input
            type="text"
            className="form-control"
            id="inputAddress"
            placeholder="1234 Main St"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            disabled={submitting}
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="inputAddress2">Address line 2</label>
          <input
            type="text"
            className="form-control"
            id="inputAddress2"
            placeholder="Apartment, society, or floor"
            value={address1}
            onChange={(e) => setAddress1(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="form-group mb-3">
          <label>State</label>
          <select
            className="form-select"
            value={state}
            onChange={handleStateChange}
            required
            disabled={submitting}
          >
            <option value="">-- Select State --</option>
            <option value="RJ">Rajasthan</option>
            <option value="GJ">Gujarat</option>
            <option value="PB">Punjab</option>
          </select>
        </div>

        <div className="form-group mb-3">
          <label>City</label>
          <select
            className="form-select"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={!state || submitting}
            required
          >
            <option value="">-- Select City --</option>
            {state &&
              stateCityMap[state].map((cityName) => (
                <option key={cityName} value={cityName}>
                  {cityName}
                </option>
              ))}
          </select>
        </div>

        <div className="form-group mt-4">
          <button type="submit" className="submit-btn  cusbtn" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}
