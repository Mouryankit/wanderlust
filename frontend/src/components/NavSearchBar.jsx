import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/components/NavSearchBar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaSearch } from "react-icons/fa";

const NavSearchBar = ({ setMenuOpen }) => {
  const navigate = useNavigate();

  // Search State
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rooms, setRooms] = useState("");

  const today = new Date().toISOString().split("T")[0];

  // Logic to handle date change and ensure end date is after start date
  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    if (endDate && newStartDate > endDate) {
      setEndDate(newStartDate);
    }
  };

  // Perform search and navigate to listings page
  const handleSearch = () => {
    navigate(
      `/listings?location=${destination}&startDate=${startDate}&endDate=${endDate}&rooms=${rooms}`
    );
    if (setMenuOpen) setMenuOpen(false); // Close mobile menu
  };

  return (
    <div className="search-bar">
      {/* Destination Input */}
      <div className="input-group">
        <label>Where</label>
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>

      <div className="nav-divider"></div>

      {/* Check-in Date */}
      <div className="input-group">
        <label>Check in</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          minDate={today}
          placeholderText="check-in"
        />
      </div>

      <div className="nav-divider"></div>

      {/* Check-out Date */}
      <div className="input-group">
        <label>Check out</label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          placeholderText="check-out"
        />
      </div>

      <div className="nav-divider"></div>

      {/* Rooms Input */}
      <div className="input-group rooms">
        <label>Rooms</label>
        <input
          type="number"
          min="1"
          placeholder="Add rooms"
          value={rooms}
          onChange={(e) => setRooms(e.target.value)}
        />
      </div>

      {/* Search Button */}
      <button className="search-btn" onClick={handleSearch}> <FaSearch /></button>
    </div>
  );
};

export default NavSearchBar;
