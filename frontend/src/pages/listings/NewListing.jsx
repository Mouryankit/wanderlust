import React, { useState } from "react";
import API from "../../api/axios";
import "../../styles/pages/NewListing.css";
import { useNavigate } from "react-router-dom";

const categories = [
  "Rooms",
  "Iconic Cities",
  "Mountains",
  "Castles",
  "Camping",
  "Farms",
  "Arctic",
  "Domes",
  "Boats",
  "Beach",
  "City",
  "Forest",
];

const NewListing = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: {
      name: "",
      type: "Point",
      coordinates: ["", ""], // [longitude, latitude]
    },
    country: "",
    category: "",
    totalRooms: 1,
  });

  const [imageFile, setImageFile] = useState(null);

  // handle change
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setImageFile(files[0]);
    }
    else if (name === "locationName") {
      setFormData({
        ...formData,
        location: { ...formData.location, name: value },
      });
    }
    else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      alert("Please upload an image");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("totalRooms", formData.totalRooms);
    data.append("country", formData.country);
    data.append("category", formData.category);
    data.append("locationName", formData.location.name);
    data.append("image", imageFile);

    // Properly log FormData contents
    console.log("Submitting Listing Data:");
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      // Note: We remove the manual Content-Type header so Axios can set it automatically with the correct boundary
      await API.post("/listings", data);

      alert("Listing created successfully!");
      navigate("/listings");

    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to create listing");
    }
  };

  return (
    <div className="nl-container">
      <div className="nl-form-wrapper">
        <h1>Create Listing</h1>

        <form className="nl-form" onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            className="nl-input"
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <textarea
            className="nl-textarea"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <input
            className="nl-input"
            type="number"
            name="price"
            placeholder="Price"
            min="1"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <input
            className="nl-input"
            type="number"
            name="totalRooms"
            placeholder="Total Rooms"
            min="1"
            value={formData.totalRooms}
            onChange={handleChange}
            required
          />

          <div className="form-group">
            <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>Upload Listing Image</label>
            <input
              className="nl-input"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              required
            />
          </div>

          <input
            className="nl-input"
            type="text"
            name="locationName"
            placeholder="Location Name (e.g. Delhi)"
            value={formData.location.name}
            onChange={handleChange}
            required
          />

          <input
            className="nl-input"
            type="text"
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            required
          />

          <select
            className="nl-select"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <button className="nl-submit-btn" type="submit">Create Listing</button>
        </form>
      </div>
    </div>
  );
};

export default NewListing;