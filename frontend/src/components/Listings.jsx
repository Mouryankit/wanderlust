
import ListingCard from "./ListingCard.jsx";
import "../styles/components/Listings.css";

const Listings = ({ listings }) => {
  if (!listings || listings.length === 0) {
    return (
      <div className="listing-grid">
        <div className="empty-listings">
          <p>No listings found . . .</p>
        </div>
      </div>
    );
  }

  return (
    <div className="listing-grid">
      {listings.map((listing) => (
        <ListingCard
          key={listing._id}
          listing={listing}
        />
      ))}
    </div>
  );
};

export default Listings;
