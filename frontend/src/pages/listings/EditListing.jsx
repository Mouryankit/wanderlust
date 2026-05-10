import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import { getUser } from "../../utils/token";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import "../../styles/pages/EditListing.css";

const categories = [
  "Rooms", "Iconic Cities", "Mountains", "Castles", "Camping",
  "Farms", "Arctic", "Domes", "Boats", "Beach", "City", "Forest",
];

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    country: "",
    category: "",
    totalRooms: "",
    contactNo: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await API.get(`/listings/${id}`);
        const data = res.data;
        const currentUser = getUser();

        if (currentUser?._id !== (data.owner?._id || data.owner)) {
          toast.error("Unauthorized");
          return navigate(`/listings/${id}`);
        }

        setFormData({
          title: data.title || "",
          description: data.description || "",
          price: data.price || "",
          location: data.location || "",
          country: data.country || "",
          category: data.category || "",
          totalRooms: data.totalRooms || "",
          contactNo: data.contactNo || "",
        });
        setExistingImage(data.image?.url || "");
      } catch (err) {
        navigate("/listings");
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id, navigate]);

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
    setIsSubmitting(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    if (imageFile) data.append("image", imageFile);

    try {
      await API.put(`/listings/${id}`, data);
      toast.success("Listing updated successfully!");
      navigate(`/listings/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="edit-listing-page">
      <div className="form-card">
        <h1>Edit Listing</h1>
        <form className="listing-form" onSubmit={handleSubmit}>
          <input className="form-input" type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
          <textarea className="form-textarea" name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />

          <div className="form-row">
            <input className="form-input" type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
            <input className="form-input" type="number" name="totalRooms" placeholder="Total Rooms" value={formData.totalRooms} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <input className="form-input" type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
            <input className="form-input" type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} required />
          </div>

          <input className="form-input" type="text" name="contactNo" placeholder="Contact Number" value={formData.contactNo} onChange={handleChange} required />

          <div className="image-edit-section">
            <label>Update Image</label>
            {existingImage && !imageFile && <img src={existingImage} alt="Current" className="current-img-preview" />}
            <input type="file" name="image" accept="image/*" onChange={handleChange} />
            <small>Leave empty to keep existing image</small>
          </div>

          <select className="form-select" name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
          </select>

          <button className="submit-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditListing;
