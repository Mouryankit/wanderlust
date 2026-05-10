import React from "react";
import Bookings from "./Bookings";
import "../styles/components/OwnerBookingDashboard.css";

const OwnerBookingDashboard = ({ bookings }) => {
  if (!bookings) return null;

  const upcomingBookings = bookings.filter(
    (b) => b.status === "confirmed" && new Date(b.checkOut) >= new Date()
  );

  const completedBookings = bookings.filter(
    (b) => b.status === "confirmed" && new Date(b.checkOut) < new Date()
  );

  const cancelledBookings = bookings.filter((b) => b.status === "cancelled");

  return (
    <div className="owner-dashboard-container">
      <h2 className="dashboard-main-title">Owner Booking Dashboard</h2>
      <hr className="dashboard-separator" />

      <Bookings
        title="Upcoming Bookings"
        bookings={upcomingBookings}
        isOwnerView={true}
      />

      <Bookings
        title="Completed Bookings"
        bookings={completedBookings}
        isOwnerView={true}
      />

      <Bookings
        title="Cancelled Bookings"
        bookings={cancelledBookings}
        isOwnerView={true}
      />
    </div>
  );
};

export default OwnerBookingDashboard;
