import React, { useState, useEffect } from "react";
import Listings from "../../components/Listings.jsx";
import Bookings from "../../components/Bookings.jsx";
import ReviewsList from "../../components/ReviewsList.jsx";
import Loading from "../../components/Loading.jsx";
import API from "../../api/axios.js";
import { getUser } from "../../utils/token";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import "../../styles/pages/Profile.css";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Listings");
  const [data, setData] = useState({ listings: [], bookings: [], reviews: [] });
  const [loading, setLoading] = useState(true);

  const currentUser = getUser();

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const [listings, bookings, reviews] = await Promise.all([
        API.get("/profile/listings"),
        API.get("/profile/bookings"),
        API.get("/profile/reviews"),
      ]);
      setData({ listings: listings.data, bookings: bookings.data, reviews: reviews.data });
    } catch (err) {
      console.error("Profile Fetch Error:", err);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) fetchProfileData();
  }, []);

  const handleCancelBooking = async (bookingId, listingId) => {
    const result = await Swal.fire({
      title: "Cancel Booking?",
      text: "Are you sure you want to cancel this trip?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--color-danger)",
      cancelButtonColor: "var(--color-text-muted)",
      confirmButtonText: "Yes, cancel it",
      cancelButtonText: "Keep trip",
    });

    if (!result.isConfirmed) return;

    try {
      await API.delete(`/listings/${listingId}/bookings/${bookingId}`);
      toast.success("Booking cancelled");
      fetchProfileData();
    } catch (err) {
      toast.error("Failed to cancel booking");
    }
  };



  const capitalize = (str) => {
    if (!str || typeof str !== "string") return str || "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (!currentUser) return <div className="profile-error">Please log in to view your profile.</div>;
  if (loading) return <Loading />;

  const renderTabContent = () => {
    switch (activeTab) {
      case "Listings":
        return <Listings listings={data.listings} />;
      case "Reviews":
        return (
          <ReviewsList 
            reviews={data.reviews} 
            onReviewDeleted={(deletedReviewId) => setData(prev => ({ ...prev, reviews: prev.reviews.filter(r => r._id !== deletedReviewId) }))} 
            showListingTitle={true} 
          />
        );
      case "Bookings":
        const today = new Date();
        const upcoming = data.bookings.filter(b => new Date(b.checkIn) >= today && b.status !== "cancelled")
          .map(b => ({ ...b, onCancel: handleCancelBooking }));
        const completed = data.bookings.filter(b => new Date(b.checkOut) < today || b.status === "cancelled");
        return (
          <div className="profile-bookings-view">
            <Bookings bookings={upcoming} title="Upcoming Trips" />
            {completed.length > 0 && (
              <>
                <div className="divider" />
                <Bookings bookings={completed} title="Past Trips" />
              </>
            )}
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          {currentUser.username[0].toUpperCase()}
        </div>
        <div className="profile-info">
          <h1>{capitalize(currentUser.username)}</h1>
          <p>{currentUser.email}</p>
          <span className="join-date">Member since {new Date(currentUser.createdAt || Date.now()).getFullYear()}</span>
        </div>
      </div>

      <div className="profile-tabs">
        {["Listings", "Reviews", "Bookings"].map(tab => (
          <button
            key={tab}
            className={`tab-link ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="profile-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Profile;
