import { Link } from "react-router-dom";
import "../styles/components/ListingCard.css";

const ListingCard = ({ listing }) => {
  return (
    <div className="listing-card">

      <Link to={`/listings/${listing._id}`} className="listing-card">
        <div className="listing-image-container">
          <img
            src={listing.image.url}
            alt={listing.title}
            className="listing-image"
          />
          {/* Heart icon placeholder */}
          <span className="heart-btn">&#9825;</span>
        </div>
      </Link>

      <div className="listing-info">
        <div className="listing-header">
          <h3>{listing.location.name || listing.location}</h3>
          <span className="rating">
            ★ {listing.reviews && listing.reviews.length > 0
              ? (listing.reviews.reduce((acc, curr) => acc + curr.rating, 0) / listing.reviews.length).toFixed(1)
              : "No review"}
          </span>
        </div>

        <p className="listing-title">{listing.title}</p>
        <p className="price">
          <span className="price-amount">{listing.price} Rs..</span> /night
        </p>
      </div>

    </div>
  );
};

export default ListingCard;