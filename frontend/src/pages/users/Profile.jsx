import React, { useState, useEffect } from "react";
import Listings from "../../components/Listings.jsx";
import Bookings from "../../components/Bookings.jsx";
import Reviews from "../../components/Reviews.jsx";
import API from "../../api/axios.js";
import "../../styles/pages/Profile.css";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Listings");
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const [listingsRes, bookingsRes, reviewsRes] = await Promise.all([
        API.get("/profile/listings"),
        API.get("/profile/bookings"),
        API.get("/profile/reviews"),
      ]);
      setListings(listingsRes.data);
      setBookings(bookingsRes.data);
      setReviews(reviewsRes.data);
    } catch (err) {
      console.error("Error fetching profile data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId, listingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await API.delete(`/listings/${listingId}/bookings/${bookingId}`);
        // Refresh bookings to show "cancelled" status or remove if desired
        fetchProfileData();
        alert("Booking cancelled successfully");
      } catch (err) {
        alert("Failed to cancel booking");
      }
    }
  };

  const handleDeleteReview = async (reviewId, listingId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await API.delete(`/listings/${listingId}/reviews/${reviewId}`);
        setReviews(reviews.filter((r) => r._id !== reviewId));
        alert("Review deleted successfully");
      } catch (err) {
        alert("Failed to delete review");
      }
    }
  };

  const renderContent = () => {
    if (loading) return <div className="loading-state">Loading your profile...</div>;

    switch (activeTab) {
      case "Listings":
        return <Listings listings={listings} />;
      case "Reviews":
        const reviewsWithDelete = reviews.map(r => ({ ...r, onDelete: handleDeleteReview }));
        return <Reviews reviews={reviewsWithDelete} />;
      case "Bookings":
        const today = new Date();
        const upcoming = bookings.filter(b => new Date(b.checkIn) >= today && b.status !== "cancelled")
          .map(b => ({ ...b, onCancel: handleCancelBooking }));
        const completed = bookings.filter(b => new Date(b.checkOut) < today || b.status === "cancelled");

        return (
          <div className="bookings-tabs-content">
            <Bookings bookings={upcoming} title="Upcoming Bookings" />
            <div className="section-divider"></div>
            <Bookings bookings={completed} title="Completed / Cancelled Bookings" />
          </div>
        );
      default:
        return null;
    }
  };

  if (!currentUser) return <div className="profile-page">Please log in to view your profile.</div>;

  return (
    <div className="profile-page">
      {/* User Info Section */}
      <div className="user-info-section">
        <div className="avatar-container">
          <div className="profile-avatar-placeholder">
            {currentUser.username[0].toUpperCase()}
          </div>
        </div>
        <div className="user-details">
          <h2>{currentUser.username}</h2>
          <p>{currentUser.email}</p>
          <p className="joined-date">
            Member since {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "2026"}
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs-navigation">
        {["Listings", "Reviews", "Bookings"].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Section */}
      <div className="content-section">
        {renderContent()}
      </div>
    </div>
  );
};

export default Profile;
