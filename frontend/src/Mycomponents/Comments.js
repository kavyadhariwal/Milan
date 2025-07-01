import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Comments.css";
import { useAuthFetch } from "./authFetch"; 

export default function Comments() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0); // ✅ Moved here
  const authFetch = useAuthFetch();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await authFetch("http://127.0.0.1:8000/api/person/");
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.results || [];
        setReports(list);
      } catch (err) {
        console.error("Fetch error:", err);
        setReports([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [authFetch]);

  const visibleReports = reports.slice(currentIndex, currentIndex + 3); // ✅ Moved here
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 >= reports.length ? 0 : prevIndex + 1
    );
  };

  if (loading) {
    return (
      <div className="comments-container">
        <p>Loading reports…</p>
      </div>
    );
  }

  return (
    <div className="comments-container container">
      <h1 className="comment-heading mb-4 text-center">Recent Reports</h1>

      <div className="row align-items-center">
        {visibleReports.map((person) => (
          <div key={person.id} className="col-md-4 mb-4 narrow-card d-flex">
            <div className="report-card h-100">
              <img
                src={person.photo ? person.photo : "/placeholder.png"}
                className="card-img-top"
                alt={`Report of ${person.fname}`}
              />
              <div className="card-body">
                <h5 className="card-title">Missing: {person.fname}</h5>
                <p className="card-text">
                  Last seen on{" "}
                  {new Date(person.date).toLocaleDateString()}, {person.city},{" "}
                  {person.state}
                </p>
                <Link to={`/story/${person.id}`} className="cusbtn">
                  Read More
                </Link>
              </div>
            </div>
          </div>
        ))}

        {reports.length > 3 && (
          <div className="col-md-1 d-flex justify-content-end">
            <button onClick={handleNext} className="rotate-btn rounded-circle border-0">
              &#10148;
            </button>
          </div>
        )}
      </div>

      {reports.length > 2 && (
        <div className="text-center mt-4">
          <Link to="/allReports" className="cusbtn">
            View More
          </Link>
        </div>
      )}
    </div>
  );
}
