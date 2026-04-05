import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Listings from "../../components/Listings.jsx";
import CategoryFilter from "../../components/CategoryFilter.jsx";
import AdBanner from "../../components/AdBanner.jsx";
import API from "../../api/axios.js";
import "../../styles/pages/Explore.css";

const Explore = () => {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState("All");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        // Parse search params from URL
        const searchParams = new URLSearchParams(location.search);

        // Combine category with search params
        if (activeCategory && activeCategory !== "All") {
          searchParams.set("category", activeCategory);
        }

        const res = await API.get(`/listings?${searchParams.toString()}`);
        setListings(res.data);
      } catch (err) {
        console.error("Error fetching listings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.search, activeCategory]);

  return (
    <div className="explore-page">
      <CategoryFilter
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <div className="explore-content">
        {loading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Searching for your next adventure...</p>
          </div>
        ) : (
          <Listings listings={listings} />
        )}

        <AdBanner />
      </div>
    </div>
  );
};

export default Explore;
