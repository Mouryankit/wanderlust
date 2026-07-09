import React from "react";
import "../styles/components/Loading.css";

const Loading = ({ message = "Loading Wanderlust..." }) => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-text">{message}</p>
    </div>
  );
};

export default Loading;
