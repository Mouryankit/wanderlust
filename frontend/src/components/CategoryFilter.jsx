import React from "react";
import {
  MdWhatshot,
  MdBedroomParent,
  MdLocationCity,
  MdTerrain,
  MdAcUnit,
  MdDirectionsBoat,
  MdBeachAccess,
  MdApartment,
  MdForest,
  MdApps
} from "react-icons/md";
import { GiCastle, GiCampingTent, GiBarn, GiIgloo } from "react-icons/gi";
import "../styles/components/CategoryFilter.css";

const categories = [
  { label: "All", icon: <MdApps /> },
  { label: "Rooms", icon: <MdBedroomParent /> },
  { label: "Iconic Cities", icon: <MdLocationCity /> },
  { label: "Mountains", icon: <MdTerrain /> },
  { label: "Castles", icon: <GiCastle /> },
  { label: "Camping", icon: <GiCampingTent /> },
  { label: "Farms", icon: <GiBarn /> },
  { label: "Arctic", icon: <MdAcUnit /> },
  { label: "Domes", icon: <GiIgloo /> },
  { label: "Boats", icon: <MdDirectionsBoat /> },
  { label: "Beach", icon: <MdBeachAccess /> },
  { label: "City", icon: <MdApartment /> },
  { label: "Forest", icon: <MdForest /> },
];

const CategoryFilter = ({ activeCategory, onCategoryChange }) => {

  return (
    <div className="categories-header-grid">
      <div className="categories-container-grid">
        <div className="categories-grid-wrapper">
          {categories.map((cat, index) => (
            <div
              key={index}
              className={`category-item-grid ${activeCategory === cat.label ? "active" : ""
                }`}
              onClick={() => onCategoryChange(cat.label)}
            >
              <div className="category-icon">{cat.icon}</div>
              <div className="category-label">{cat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
