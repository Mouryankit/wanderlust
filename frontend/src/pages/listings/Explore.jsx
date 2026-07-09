import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Listings from "../../components/Listings.jsx";
import CategoryFilter from "../../components/CategoryFilter.jsx";
import AdBanner from "../../components/AdBanner.jsx";
import Loading from "../../components/Loading.jsx";
import API from "../../api/axios.js";
import "../../styles/pages/Explore.css";

const Explore = () => {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState("All");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const searchParams = new URLSearchParams(location.search);
        if (activeCategory && activeCategory !== "All") {
          searchParams.set("category", activeCategory);
        }

        const res = await API.get(`/listings?${searchParams.toString()}`);
        setListings(res.data);
      } catch (err) {
        console.error("Explore Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.search, activeCategory]);

  // if (loading) return <Loading />;

  return (
    <div className="explore-page">
      <CategoryFilter
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <div className="explore-content">
        {
          loading ? <Loading/> : <Listings listings={listings} />
        }
        <AdBanner />
      </div>
    </div>
  );
};

export default Explore;
