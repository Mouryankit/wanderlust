import API from "../../api/axios";
import { useEffect, useState } from "react";
import Listings from "../../components/Listings.jsx";
import ExperienceAccordion from "../../components/ExperienceAccordion.jsx";
import AdBanner from "../../components/AdBanner.jsx";
import Loading from "../../components/Loading.jsx";
import "../../styles/pages/Home.css";

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const res = await API.get("/listings");
        setListings(res.data);
        setError(null);
      } catch (err) {
        console.error("Home Fetch Error:", err);
        setError("Failed to load listings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="home-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="home-container">
      <h2 className="explore-header">Explore Places</h2>
      <Listings listings={listings} />
      <ExperienceAccordion />
      <AdBanner />
    </div>
  );
};

export default Home;
