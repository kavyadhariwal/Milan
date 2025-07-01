import React, { useEffect, useState } from "react";
import "./Feedback.css";
import { useAuthFetch } from "./authFetch";
import { FaQuoteRight } from "react-icons/fa";

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // ✅ Add this state

  const authFetch = useAuthFetch();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setIsLoggedIn(false);
      setLoading(false); // no need to load
      return;
    }

    setIsLoggedIn(true);

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

  const handleNext = () => {
    setIndex((prev) => (prev + 2 >= feedbacks.length ? 0 : prev + 2));
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 2 < 0 ? feedbacks.length - 2 : prev - 2));
  };

  if (loading) {
    return <div className="feedback-container"><p>Loading feedback…</p></div>;
  }

  if (!isLoggedIn) {
    return (
      <div className="feedback-container">
        <p className="text-center">🔒 Please <a href="/login">login</a> to see feedbacks.</p>
      </div>
    );
  }

  return (
    <div className="feedback-container">
      <div className="feedback-header d-flex justify-content-between align-items-center">
        <h2 className="feedback-title">Feedbacks</h2>
        <div>
          <button className="nav-btn" onClick={handlePrev}>←</button>
          <button className="nav-btn" onClick={handleNext}>→</button>
        </div>
      </div>
      <div className="feedback-grid">
        {[feedbacks[index], feedbacks[index + 1]].map(
          (feedback, idx) =>
            feedback && (
              <div key={idx} className="feedback-card">
                <p className="feedback-text">{feedback.message}</p>
                <hr />
                <div className="feedback-footer d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="m-0">{feedback.cname || "Anonymous"}</h5>
                  </div>
                  <FaQuoteRight size={28} color="#f5a623" />
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
}
