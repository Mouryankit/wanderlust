import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../api/axios";
import { getToken, getUser } from "../../utils/token";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import ReviewForm from "../../components/ReviewForm";
import ReviewsList from "../../components/ReviewsList";
import BookingSection from "../../components/BookingSection";
import OwnerBookingDashboard from "../../components/OwnerBookingDashboard";
import Loading from "../../components/Loading";
import "../../styles/pages/ListingDetails.css";

function ListingDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const currentUser = getUser();
  const isLoggedIn = !!getToken();

  const isOwner = isLoggedIn && listing && (
    currentUser?._id === (listing.owner?._id || listing.owner)
  );

  const [allBookings, setAllBookings] = useState([]);

  const capitalize = (str) => {
    if (!str || typeof str !== "string") return str || "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await API.get(`/listings/${id}`);
        setListing(res.data);

        if (currentUser) {
          const bookingRes = await API.get(`/listings/${id}/bookings`);
          if (currentUser._id === res.data.owner?._id) {
            setAllBookings(bookingRes.data);
          }
        }
      } catch (err) {
        console.error("Fetch listing error:", err);
        toast.error("Failed to load listing");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const refreshListing = async () => {
    try {
      const res = await API.get(`/listings/${id}`);
      setListing(res.data);
    } catch (err) {
      // console.log("Refresh error:", err);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Listing?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--color-danger)",
      cancelButtonColor: "var(--color-text-muted)",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await API.delete(`/listings/${id}`);
        toast.success("Listing deleted successfully!");
        navigate("/listings");
      } catch (err) {
        console.error("Delete error:", err);
        toast.error("Failed to delete listing");
      }
    }
  };



  if (loading) return <Loading />;
  if (!listing) return <div className="error-msg">Listing not found</div>;

  const imageUrl = listing.image?.url || listing.images?.[0]?.url || listing.image || listing.images?.[0];

  return (
    <div className="listing-detail-container">
      {/* TITLE */}
      <h1 className="listing-detail-title">{capitalize(listing.title)}</h1>

      {/* IMAGE */}
      <div className="listing-detail-image-box">
        <img
          src={typeof imageUrl === "string" ? imageUrl : imageUrl?.url}
          alt={listing.title}
          className="listing-detail-image"
        />
      </div>

      {/* BASIC INFO */}
      <div className="listing-detail-info">
        <p><strong>Location:</strong> {capitalize(listing.location?.name || listing.location)}</p>
        <p><strong>Country:</strong> {capitalize(listing.country)}</p>
        <p><strong>Category:</strong> {capitalize(listing.category)}</p>
        <p><strong>Total Rooms:</strong> {listing.totalRooms || 0}</p>
      </div>

      {/* PRICE */}
      <div className="listing-detail-price">
        <h2>&#8377;{listing.price.toLocaleString("en-IN")} / night</h2>
      </div>

      {/* DESCRIPTION */}
      <div className="listing-detail-description">
        <h3>About this place</h3>
        <p>{listing.description}</p>
      </div>

      {isOwner && isLoggedIn && (
        <div className="listing-detail-controls">
          <Link to={`/listings/${id}/edit`} className="edit-btn">Edit Listing</Link>
          <button onClick={handleDelete} className="delete-btn">Delete Listing</button>
        </div>
      )}

      {/* OWNER */}
      <div className="listing-detail-owner">
        <h3>Hosted by</h3>
        <p>{capitalize(listing.owner?.username || "Owner")}</p>
      </div>

      {/* CONTACT */}
      <div className="listing-detail-contact">
        <h3>Contact Info</h3>
        <p>&#128222; {listing.contactNo || "Not provided"}</p>
      </div>

      <hr />

      {/* REVIEWS SECTION */}

      {/* <ReviewsList
        title="Reviews"
        reviews={listing.reviews}
        listingId={id}
        onReviewDeleted={refreshListing}
      /> */}
      <ReviewsList
        title="Reviews"
        reviews={listing.reviews}
        listingId={id}
        onReviewDeleted={(deletedReviewId) =>
          setListing(prev => ({
            ...prev,
            reviews: prev.reviews.filter(
              review => review._id !== deletedReviewId
            )
          }))
        }
      />

      {/* ADD REVIEW FORM */}
      <ReviewForm
        listingId={id}
        onReviewAdded={refreshListing}
      />

      <hr />

      {/* BOOKING SECTION */}
      <BookingSection
        listingId={id}
        listing={listing}
        currentUser={currentUser}
        isOwner={isOwner}
        price={listing.price}
        onBookingChange={refreshListing}
      />

      {/* OWNER DASHBOARD SECTION */}
      {isOwner && isLoggedIn && (
        <OwnerBookingDashboard bookings={allBookings} />
      )}
    </div>
  );
}

export default ListingDetails;