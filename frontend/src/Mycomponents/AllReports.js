import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AllReports.css";
import { useAuthFetch } from "./authFetch"; // ✅ Ensure correct path

export default function AllReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
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
        setReports([]); // fallback to empty
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [authFetch]);

  if (loading) {
    return (
      <div className="all-reports-container">
        <p>Loading reports…</p>
      </div>
    );
  }

  return (
    <div className="all-reports-container container">
      <h1 className="report-heading mb-4 text-center">All Missing Persons</h1>
      <div className="row">
        {reports.length > 0 ? (
          reports.map((person) => (
            <div key={person.id} className="col-md-4 mb-4 narrow-card">
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
                  <Link to={`/story/${person.id}`} className="btn btn-primary">
                    View more
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p>No reports found.</p>
          </div>
        )}
      </div>
      <div className="text-center mt-4">
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
