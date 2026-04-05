

import API from "../../api/axios";
import { useEffect, useState } from "react";
import Listings from "../../components/Listings.jsx";
import ExperienceAccordion from "../../components/ExperienceAccordion.jsx";
import AdBanner from "../../components/AdBanner.jsx";
import "../../styles/pages/Dashboard.css";


const Dashboard = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await API.get("/listings");
        setListings(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) return <h2> Loading . . . </h2>;

  return (
    <div className="dashboard">
      <h2 className="explore-header">Explore Places</h2>
      <Listings listings={listings} />
      <ExperienceAccordion />
      <AdBanner />
    </div>
  );
}

export default Dashboard;
