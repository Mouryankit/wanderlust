import React, { useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../../styles/pages/NewListing.css";

const categories = [
  "Rooms", "Iconic Cities", "Mountains", "Castles", "Camping",
  "Farms", "Arctic", "Domes", "Boats", "Beach", "City", "Forest",
];

const NewListing = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    country: "",
    category: "",
    totalRooms: 1,
    contactNo: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setImageFile(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!imageFile) {
      toast.error("Please upload an image");
      return;
    }

    setIsSubmitting(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    data.append("image", imageFile);

    try {
      await API.post("/listings", data);
      toast.success("Listing created successfully!");
      navigate("/listings");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="new-listing-page">
      <div className="form-card">
        <h1>Create New Listing</h1>
        <form className="listing-form" onSubmit={handleSubmit}>
          <input className="form-input" type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
          <textarea className="form-textarea" name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />

          <div className="form-row">
            <input className="form-input" type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
            <input className="form-input" type="number" name="totalRooms" placeholder="Total Rooms" value={formData.totalRooms} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <input className="form-input" type="text" name="location" placeholder="Location (City)" value={formData.location} onChange={handleChange} required />
            <input className="form-input" type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} required />
          </div>

          <input className="form-input" type="text" name="contactNo" placeholder="Contact Number" value={formData.contactNo} onChange={handleChange} required />

          <div className="file-input-group">
            <label>Listing Image</label>
            <input type="file" name="image" accept="image/*" onChange={handleChange} required />
          </div>

          <select className="form-select" name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
          </select>

          <button className="submit-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Listing"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewListing;