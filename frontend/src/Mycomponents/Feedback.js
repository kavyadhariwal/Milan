import React, { useEffect, useState } from "react";
import "./Feedback.css";
import { useAuthFetch } from "./authFetch"; 

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const authFetch = useAuthFetch(); 

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await authFetch("http://127.0.0.1:8000/api/claim-requests/");
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.results || [];
        setFeedbacks(list);
      } catch (err) {
        console.error("Fetch error:", err);
        setFeedbacks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [authFetch]);

  if (loading) {
    return <div className="feedback-container"><p>Loading feedback…</p></div>;
  }

  return (
    <div className="feedback-container container">
      <h1 className="feedback-heading mb-4">User Feedback</h1>
      <div className="row">
        {feedbacks.length === 0 ? (
          <div className="col-12">
            <p>No feedback available yet.</p>
          </div>
        ) : (
          feedbacks.map(feedback => (
            <div key={feedback.id} className="col-md-6 mb-4">
              <div className="feedback-card h-100 p-3 border rounded shadow-sm bg-white">
                <h5 className="feedback-name mb-2">{feedback.cname || 'Anonymous'}</h5>
                <p className="feedback-date text-muted mb-3">
                  On {new Date(feedback.date_submitted).toLocaleDateString()}
                </p>
                <p className="feedback-message">{feedback.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
