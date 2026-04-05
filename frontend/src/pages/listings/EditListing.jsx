import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import "../../styles/pages/EditListing.css";
import { useNavigate, useParams } from "react-router-dom";

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

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: {
      name: "",
    },
    country: "",
    category: "",
    totalRooms: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await API.get(`/listings/${id}`);
        const data = res.data;

        const currentUser = JSON.parse(localStorage.getItem("user"));
        const isOwner = currentUser && (
          currentUser._id === (data.owner?._id || data.owner)
        );

        if (!isOwner) {
          alert("You are not authorized to edit this listing");
          navigate(`/listings/${id}`);
          return;
        }

        setFormData({
          title: data.title || "",
          description: data.description || "",
          price: data.price || "",
          location: {
            name: data.location?.name || "",
          },
          country: data.country || "",
          category: data.category || "",
          totalRooms: data.totalRooms || "",
        });
        setExistingImage(data.image?.url || "");
        setLoading(false);
      } catch (err) {
        console.error("Error fetching listing:", err);
        alert("Failed to fetch listing details");
        navigate("/listings");
      }
    };

    fetchListing();
  }, [id, navigate]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("totalRooms", formData.totalRooms);
    data.append("country", formData.country);
    data.append("category", formData.category);
    data.append("locationName", formData.location.name);

    if (imageFile) {
      data.append("image", imageFile);
    }

    // Properly log FormData contents
    console.log("Updating Listing Data:");
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      // Note: We remove the manual Content-Type header so Axios can set it automatically with the correct boundary
      await API.put(`/listings/${id}`, data);
      alert("Listing updated successfully!");
      navigate(`/listings/${id}`);
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to update listing");
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="el-container">
      <div className="el-form-wrapper">
        <h1>Edit Listing</h1>

        <form className="el-form" onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-group">
            <label>Title</label>
            <input
              className="el-input"
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="el-textarea"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price (₹ / night)</label>
              <input
                className="el-input"
                type="number"
                name="price"
                placeholder="Price"
                min="1"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Total Rooms</label>
              <input
                className="el-input"
                type="number"
                name="totalRooms"
                placeholder="Total Rooms"
                min="1"
                value={formData.totalRooms}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Country</label>
              <input
                className="el-input"
                type="text"
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Current Image Preview</label>
            {existingImage && !imageFile && (
              <img
                src={existingImage}
                alt="Current listing"
                style={{ width: '100px', height: 'auto', borderRadius: '8px', marginBottom: '10px', display: 'block' }}
              />
            )}
            {imageFile && (
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '5px' }}>New image selected: {imageFile.name}</p>
            )}
            <input
              className="el-input"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
            />
            <small style={{ color: '#777', fontSize: '12px' }}>Leave blank to keep the current image.</small>
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              className="el-input"
              type="text"
              name="locationName"
              placeholder="Location Name (e.g. Delhi)"
              value={formData.location.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              className="el-select"
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
          </div>

          <button className="el-submit-btn" type="submit">Update Listing</button>
        </form>
      </div>
    </div>
  );
};

export default EditListing;
