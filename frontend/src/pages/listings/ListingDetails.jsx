import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";
import ReviewForm from "../../components/reviews/ReviewForm";
import ReviewsList from "../../components/reviews/ReviewsList";
import Bookings from "../../components/Bookings";
import BookingSection from "../../components/BookingSection";
import "../../styles/pages/ListingDetails.css";
// import "../../styles/components/BookingSection.css"; // Now managed by BookingSection.jsx
import "../../styles/components/OwnerDashboard.css";

function ListingDetails() {
  const { id } = useParams();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const isLoggedIn = !!currentUser && !!token;

  const isOwner = isLoggedIn && listing && (
    currentUser._id === (listing.owner?._id || listing.owner)
  );

  // Booking states for owner view only
  const [allBookings, setAllBookings] = useState([]); // For Owner View

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await API.get(`/listings/${id}`);
        setListing(res.data);

        // Fetch bookings for this listing
        if (currentUser) {
          const bookingRes = await API.get(`/listings/${id}/bookings`);

          if (currentUser._id === res.data.owner?._id || currentUser.id === res.data.owner?._id) {
            // User is owner, set all bookings
            setAllBookings(bookingRes.data);
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const refreshListing = async () => {
    try {
      const res = await API.get(`/listings/${id}`);
      setListing(res.data);
    } catch (err) {
      console.log("Refresh error:", err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await API.delete(`/listings/${id}`);
        alert("Listing deleted successfully!");
        navigate("/listings");
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete listing");
      }
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (!listing) return <div className="error-msg">Listing not found</div>;

  return (
    <div className="listing-detail-container">

      {/* TITLE */}
      <h1 className="listing-detail-title">{listing.title}</h1>

      {/* IMAGE */}
      <div className="listing-detail-image-box">
        <img
          src={listing.image.url}
          alt={listing.title}
          className="listing-detail-image"
        />
      </div>

      {/* BASIC INFO */}
      <div className="listing-detail-info">
        <p><strong>Location:</strong> {listing.location.name}</p>
        <p><strong>Country:</strong> {listing.country}</p>
        <p><strong>Category:</strong> {listing.category}</p>
        <p><strong>Total Rooms:</strong> {listing.totalRooms}</p>
      </div>

      {/* PRICE */}
      <div className="listing-detail-price">
        <h2>₹{listing.price} / night</h2>
      </div>

      {/* DESCRIPTION */}
      <div className="listing-detail-description">
        <h3>About this place</h3>
        <p>{listing.description}</p>
      </div>

      {/* OWNER */}
      <div className="listing-detail-owner">
        <h3>Hosted by</h3>
        <p>{listing.owner?.username || "Owner"}</p>
      </div>

      {isOwner && isLoggedIn && (
        <div className="listing-detail-controls">
          <Link to={`/listings/${id}/edit`} className="edit-btn">Edit Listing</Link>
          <button onClick={handleDelete} className="delete-btn">Delete Listing</button>
        </div>
      )}

      {/* REVIEWS SECTION */}
      <ReviewsList
        listingId={id}
        reviews={listing.reviews}
        onReviewDeleted={refreshListing}
      />

      {/* ADD REVIEW FORM */}
      <ReviewForm
        listingId={id}
        onReviewAdded={refreshListing}
      />

      {/* BOOKING SECTION */}
      <BookingSection
        listingId={id}
        currentUser={currentUser}
        isOwner={isOwner}
        price={listing.price}
        onBookingChange={refreshListing}
      />

      {/* OWNER DASHBOARD SECTION */}
      {isOwner && isLoggedIn && (
        <div className="owner-dashboard">
          <h2 className="dashboard-title">Owner Booking Dashboard</h2>
          <hr className="dashboard-hr" />

          <Bookings
            title="Upcoming Bookings"
            bookings={allBookings.filter(b => b.status === "confirmed" && new Date(b.checkOut) >= new Date())}
          />

          <Bookings
            title="Completed Bookings"
            bookings={allBookings.filter(b => b.status === "confirmed" && new Date(b.checkOut) < new Date())}
          />

          <Bookings
            title="Cancelled Bookings"
            bookings={allBookings.filter(b => b.status === "cancelled")}
          />
        </div>
      )}

    </div>
  );
}

export default ListingDetails;