import React from "react";
import "../styles/components/Bookings.css";

const Bookings = ({ bookings, title }) => {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="no-bookings">
        <p>No {title.toLowerCase()} found.</p>
      </div>
    );
  }

  return (
    <div className="bookings-section">
      <h4 className="bookings-title">{title}</h4>
      <div className="bookings-grid">
        {bookings.map((booking) => {
          const isCompleted = new Date(booking.checkOut) < new Date();

          return (
            <div key={booking._id} className={`booking-card-item ${isCompleted ? 'completed' : 'upcoming'}`}>
              <div className="booking-card-header">
                <div className="user-info">
                  <div className="user-avatar">
                    {booking.user?.username?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="user-details">
                    <span className="username">{booking.user?.username || "Guest"}</span>
                    <span className="guest-count">
                      {booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'} • {booking.rooms} {booking.rooms === 1 ? 'Room' : 'Rooms'}
                    </span>
                  </div>
                </div>
                <div className={`booking-status-badge ${booking.status}`}>
                  {booking.status}
                </div>
              </div>

              <div className="booking-card-body">
                <div className="date-info">
                  <div className="date-block">
                    <label>Check-in</label>
                    <span>{new Date(booking.checkIn).toLocaleDateString()}</span>
                  </div>
                  <div className="date-divider">→</div>
                  <div className="date-block">
                    <label>Check-out</label>
                    <span>{new Date(booking.checkOut).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="booking-card-footer">
                <div className="total-price">
                  <label>Total Paid</label>
                  <span>₹{booking.totalPrice}</span>
                </div>
                {isCompleted && <span className="completed-marker">✓ Completed</span>}
                {!isCompleted && booking.status !== "cancelled" && booking.onCancel && (
                  <button 
                    className="cancel-booking-btn" 
                    onClick={() => booking.onCancel(booking._id, booking.listing?._id)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Bookings;
