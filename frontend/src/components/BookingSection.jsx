import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles/components/BookingSection.css";

const BookingSection = ({ listingId, currentUser, isOwner, price, onBookingChange }) => {
  const navigate = useNavigate();

  // Booking states
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [userBookings, setUserBookings] = useState([]);

  // Calculate dynamic price
  const calculatePricing = () => {
    if (!checkIn || !checkOut) return { days: 0, total: 0 };
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const timeDiff = end - start;
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    if (days <= 0) return { days: 0, total: 0 };
    
    const total = days * price * rooms;
    return { days, total };
  };

  const { days, total } = calculatePricing();

  useEffect(() => {
    const fetchUserBooking = async () => {
      if (!currentUser || isOwner) return;
      try {
        const res = await API.get(`/listings/${listingId}/bookings`);
        // Find all their active bookings
        const myBookings = res.data.filter(b =>
          (b.user._id === currentUser._id || b.user === currentUser._id) &&
          b.status !== "cancelled"
        );
        setUserBookings(myBookings);
      } catch (err) {
        console.error("Error fetching user booking:", err);
      }
    };

    fetchUserBooking();
  }, [listingId, currentUser, isOwner]);

  const handleBooking = async () => {
    if (!localStorage.getItem("token")) {
      alert("Please login to book this listing");
      navigate("/login");
      return;
    }

    if (days <= 0) {
      alert("Please select valid check-in and check-out dates");
      return;
    }

    const isConfirmed = window.confirm(
      `Confirm Booking Detail:\n\n` +
      `Check-in: ${checkIn}\n` +
      `Check-out: ${checkOut}\n` +
      `Rooms: ${rooms}\n` +
      `Total Price: ₹${total}\n\n` +
      `Are you sure you want to book?`
    );

    if (!isConfirmed) return;

    setBookingLoading(true);
    try {
      const res = await API.post(`/listings/${listingId}/bookings`, {
        checkIn,
        checkOut,
        guests,
        rooms,
      });
      alert(res.data.message || "Booking successful!");

      // Reset dates
      setCheckIn("");
      setCheckOut("");
      setGuests(1);
      setRooms(1);

      // Refresh to show booking status
      if (onBookingChange) onBookingChange();

      // Re-fetch local user booking status
      const bookingRes = await API.get(`/listings/${listingId}/bookings`);
      const myBookings = bookingRes.data.filter(b =>
        (b.user._id === currentUser._id || b.user === currentUser._id) &&
        b.status !== "cancelled"
      );
      setUserBookings(myBookings);

    } catch (err) {
      console.error("Booking error:", err.response?.data || err.message);
      const errorMsg = err.response?.data?.message || "Failed to book listing";
      alert(errorMsg);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Cancel this booking?")) {
      try {
        await API.delete(`/listings/${listingId}/bookings/${bookingId}`);
        alert("Booking cancelled successfully");
        setUserBookings(prev => prev.filter(b => b._id !== bookingId));
        if (onBookingChange) onBookingChange();
      } catch (err) {
        alert("Failed to cancel booking");
      }
    }
  };

  if (isOwner) return null;

  return (
    <div className="booking-box">
      {/* ALWAYS SHOW BOOKING FORM */}
      <div className="booking-form-section">
        <h3>Book this place</h3>
        <div className="booking-inputs">
          <div className="input-row">
            <div className="input-group date-input">
              <label>Check-in</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="input-group date-input">
              <label>Check-out</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
          <div className="input-row">
            <div className="input-group">
              <label>Guests</label>
              <input
                type="number"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                min="1"
                max="10"
              />
            </div>
            <div className="input-group">
              <label>Rooms</label>
              <input
                type="number"
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
                min="1"
                max={10}
              />
            </div>
          </div>
        </div>

        {days > 0 && (
          <div className="price-breakdown">
            <div className="price-item">
              <span>₹{price} x {days} nights x {rooms} {rooms === 1 ? 'room' : 'rooms'}</span>
              <span>₹{total}</span>
            </div>
            <hr />
            <div className="total-price-footer">
              <span>Total (INR)</span>
              <span>₹{total}</span>
            </div>
          </div>
        )}
        <button
          className="book-btn"
          onClick={handleBooking}
          disabled={bookingLoading}
        >
          {bookingLoading ? "Processing..." : "Reserve Now"}
        </button>
      </div>

      {/* SHOW LIST OF CURRENT BOOKINGS */}
      {userBookings.length > 0 && (
        <div className="user-bookings-list">
          <hr className="bookings-separator" />
          <h3>Your Current Bookings ({userBookings.length})</h3>
          <div className="bookings-container">
            {userBookings.map((booking) => (
              <div key={booking._id} className="booking-status-card mini">
                <div className="booking-summary">
                  <p><strong>DATES:</strong> {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</p>
                  <p><strong>ROOMS:</strong> {booking.rooms} • <strong>PAID:</strong> ₹{booking.totalPrice}</p>
                  <p>
                    <strong>STATUS:</strong>
                    <span className={`status-label status-${booking.status}`}>
                      {booking.status}
                    </span>
                  </p>
                </div>
                <button
                  className="cancel-btn mini"
                  onClick={() => handleCancelBooking(booking._id)}
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingSection;
