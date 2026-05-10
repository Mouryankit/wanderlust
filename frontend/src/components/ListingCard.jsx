import React from "react";
import { Link } from "react-router-dom";
import "../styles/components/ListingCard.css";

const ListingCard = ({ listing }) => {
  // If listing is missing, don't crash
  if (!listing) return null;

  // Safe capitalization function
  const capitalize = (str) => {
    if (!str || typeof str !== "string") return str || "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const locationName = typeof listing.location === "object" 
    ? listing.location.name 
    : (listing.location || "Unknown Location");

  // Fix: Handle both listing.image.url (singular) and listing.images[0].url (plural)
  const imageUrl = listing.image?.url || listing.images?.[0]?.url || listing.image || listing.images?.[0];
  const fallbackImage = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80";

  return (
    <div className="listing-card">
      <Link to={`/listings/${listing._id}`}>
        <div className="listing-image-container">
          <img
            src={typeof imageUrl === "string" ? imageUrl : (imageUrl?.url || fallbackImage)}
            alt={listing.title || "Listing"}
            className="listing-image"
          />
        </div>
      </Link>

      <div className="listing-info">
        <div className="listing-header">
          <h3>{capitalize(locationName)}</h3>
          <span className="rating">
            <span style={{ color: "var(--color-primary)" }}>&#9733;</span>{" "}
            {listing.reviews && listing.reviews.length > 0
              ? (listing.reviews.reduce((acc, curr) => acc + curr.rating, 0) / listing.reviews.length).toFixed(1)
              : "No review"}
          </span>
        </div>

        <p className="listing-title">{listing.title || "No Title"}</p>
        <p className="price">
          <span className="price-amount">{listing.price || 0} Rs.</span> /night
        </p>
      </div>
    </div>
  );
};

export default ListingCard;