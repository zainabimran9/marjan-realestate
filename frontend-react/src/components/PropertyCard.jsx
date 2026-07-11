import { Link } from "react-router-dom";
import { Favorites, formatPrice } from "../lib/api";
import { useState } from "react";

export default function PropertyCard({ property }) {
  const [isFav, setIsFav] = useState(Favorites.has(property.id));
  const img = property.images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80";

  const toggleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFav(Favorites.toggle(property.id));
  };

  return (
    <Link className="card" to={`/property/${property.id}`}>
      <div className="card-img">
        <img src={img} alt={property.title} loading="lazy" />
        <span className="card-tag">{property.type}</span>
        <button className="card-fav" aria-label="Save listing" onClick={toggleFav}>
          {isFav ? "\u2665" : "\u2661"}
        </button>
      </div>
      <div className="card-body">
        <div className="card-price mono">{property.priceLabel || formatPrice(property.price)}</div>
        <h3 className="card-title">{property.title}</h3>
        <div className="card-loc">{property.address}</div>
        <div className="card-specs">
          {property.areaSqft && <span>{property.areaSqft} sqft</span>}
          {property.bedrooms && <span>{property.bedrooms} bed</span>}
          {property.floor && <span>{property.floor}</span>}
        </div>
      </div>
    </Link>
  );
}
