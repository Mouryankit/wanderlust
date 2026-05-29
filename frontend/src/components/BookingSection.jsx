import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { getToken } from "../utils/token";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Bookings from "./Bookings";
import "../styles/components/BookingSection.css";
import Swal from "sweetalert2";

const BookingSection = ({ listingId, listing, currentUser, isOwner, price, onBookingChange }) => {
  const navigate = useNavigate();

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [status, setStatus] = useState(null);   // null | "available" | "unavailable"
  const [loading, setLoading] = useState(false);
  const [userBookings, setUserBookings] = useState([]);

  // Fetch user's existing bookings for this listing
  useEffect(() => {
    if (!currentUser || isOwner) return;
    API.get(`/listings/${listingId}/bookings`)
      .then((res) => {
        const mine = res.data.filter(
          (b) => (b.user._id || b.user) === currentUser._id && b.status !== "cancelled"
        );
        setUserBookings(mine);
      })
      .catch(console.error);
  }, [listingId, currentUser, isOwner]);

  // Calculate total price
  const nights = checkIn && checkOut
    ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000)
    : 0;
  const total = nights > 0 ? nights * price * rooms : 0;

  // Reset availability when user changes inputs
  const resetStatus = () => setStatus(null);

  // ── Step 1: Check if the selected dates are available ──
  const checkAvailability = async () => {
    if (!getToken()) return navigate("/login");
    if (!checkIn || !checkOut || total <= 0) return toast.error("Please select valid dates.");

    setLoading(true);
    setStatus(null);

    try {
      // Use the new backend middleware verification route
      const toDateOnly = (d) => d ? `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` : null;

      await API.post(`/listings/${listingId}/bookings/verify`, {
        checkIn: toDateOnly(checkIn),
        checkOut: toDateOnly(checkOut),
        guests,
        rooms
      });

      setStatus("available");
    } catch (err) {
      setStatus("unavailable");
      // Display the specific validation error message from the backend (e.g. "Only 2 rooms left")
      toast.error(err.response?.data?.message || "Could not check availability. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Confirm and create the booking ──
  const handleBooking = async () => {
    const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

    const result = await Swal.fire({
      title: "Confirm Your Booking",
      html: `
        <div style="text-align:left; line-height:2; font-size:0.95rem;">
          <p><strong>Property:</strong> ${listing?.title || "This listing"}</p>
          <p><strong>Check-in:</strong>  ${fmt(checkIn)}</p>
          <p><strong>Check-out:</strong> ${fmt(checkOut)}</p>
          <p><strong>Guests:</strong>    ${guests}</p>
          <p><strong>Rooms:</strong>     ${rooms}</p>
          <hr/>
          <p><strong>Total:</strong> ₹${total.toLocaleString("en-IN")}</p>
        </div>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "var(--color-primary)",
      cancelButtonColor: "var(--color-text-muted)",
      confirmButtonText: "Yes, Book It!",
      cancelButtonText: "Go Back",
    });

    if (!result.isConfirmed) return;

    try {
      // send date-only strings (YYYY-MM-DD) to avoid timezone shifts when serialized
      const toDateOnly = (d) => d ? `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` : null;

      await API.post(`/listings/${listingId}/bookings`, { checkIn: toDateOnly(checkIn), checkOut: toDateOnly(checkOut), guests, rooms });
      toast.success("Booking confirmed!");
      setCheckIn(null); setCheckOut(null); setGuests(1); setRooms(1); setStatus(null);
      if (onBookingChange) onBookingChange();
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed. Please try again.");
    }
  };

  //timezone issue fix for datepicker by normalizing time to 00:00:00 before sending to backend
  const normalizeDate = (date) => {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
  };

    // ── Cancel an existing booking ──
  const cancelBooking = async (id) => {
    const result = await Swal.fire({
      title: "Cancel Booking?",
      text: "Are you sure you want to cancel this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--color-danger)",
      cancelButtonColor: "var(--color-text-muted)",
      confirmButtonText: "Yes, Cancel It",
      cancelButtonText: "Keep Booking",
    });

    if (!result.isConfirmed) return;

    try {
      await API.delete(`/listings/${listingId}/bookings/${id}`);
      toast.success("Booking cancelled.");
      setUserBookings((prev) => prev.filter((b) => b._id !== id));
      if (onBookingChange) onBookingChange();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel booking.");
    }
  };

  if (isOwner) return null;

  return (
    <div className="booking-sidebar">
      <div className="booking-card">
        <h3>&#8377;{price.toLocaleString("en-IN")} <span className="per-night">/ night</span></h3>

        {/* Date & guest inputs */}
        <div className="booking-inputs-grid">
          <div className="input-field">
            <label>CHECK-IN</label>
            <DatePicker selected={checkIn} onChange={(d) => { setCheckIn(normalizeDate(d)); resetStatus(); }}
              selectsStart startDate={checkIn} endDate={checkOut} minDate={new Date()} placeholderText="Select date" />
          </div>
          <div className="input-field">
            <label>CHECK-OUT</label>
            <DatePicker selected={checkOut} onChange={(d) => { setCheckOut(normalizeDate(d)); resetStatus(); }}
              selectsEnd startDate={checkIn} endDate={checkOut} minDate={checkIn || new Date()} placeholderText="Select date" />
          </div>
          <div className="input-field">
            <label>GUESTS</label>
            <input type="number" value={guests} min="1" onChange={(e) => setGuests(Number(e.target.value))} />
          </div>
          <div className="input-field">
            <label>ROOMS</label>
            <input type="number" value={rooms} min="1" onChange={(e) => { setRooms(Number(e.target.value)); resetStatus(); }} />
          </div>
        </div>

        {/* Price preview */}
        {total > 0 && (
          <div className="price-summary">
            <div className="price-row">
              <span>Estimated Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>
        )}

        {/* Step 1 — Check Availability */}
        <button className="check-btn" onClick={checkAvailability} disabled={loading}>
          {loading ? "Checking..." : "Check Availability"}
        </button>

        {/* Availability result */}
        {status === "available" && <div className="availability-banner available">Dates are available!</div>}
        {status === "unavailable" && <div className="availability-banner unavailable">No rooms available for these dates.</div>}

        {/* Step 2 — Reserve (only shown when available) */}
        {status === "available" && (
          <button className="reserve-btn" onClick={handleBooking}>Reserve Now</button>
        )}
      </div>

      {/* User's existing bookings */}
      {userBookings.length > 0 && (
        <Bookings
          bookings={userBookings.map(b => ({ ...b, onCancel: cancelBooking }))}
          title={listing?.title || "Your Bookings"}
        />
      )}
    </div>
  );
};

export default BookingSection;
