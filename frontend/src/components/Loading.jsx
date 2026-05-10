import React from "react";
import "../styles/components/Loading.css";

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-text">Loading Wanderlust . . .</p>
    </div>
  );
};

export default Loading;
