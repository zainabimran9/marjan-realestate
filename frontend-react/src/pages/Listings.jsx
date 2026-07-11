import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Api } from "../lib/api";
import PropertyCard from "../components/PropertyCard";
import { useStaggerReveal, usePageTransition } from "../lib/animations";

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const filters = {
    q: searchParams.get("q") || "",
    type: searchParams.get("type") || "",
    status: searchParams.get("status") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || ""
  };

  useEffect(() => {
    setResults(null);
    Api.getProperties(filters).then(setResults).catch((e) => setError(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  const pageRef = usePageTransition();
  const gridRef = useStaggerReveal(".card", [results]);

  return (
    <div ref={pageRef}>
      <section className="section-tight" style={{ paddingTop: 56 }}>
        <div className="wrap">
          <div className="eyebrow">All Listings</div>
          <h1 style={{ fontSize: "2.4rem", marginBottom: 8 }}>Find your unit</h1>
          <p style={{ color: "var(--ink-soft)", maxWidth: "60ch" }}>Search across every listing — Marjan Classic Mall &amp; Residency units and independently listed properties.</p>

          <div className="filters">
            <div className="field">
              <label htmlFor="q">Search</label>
              <input type="text" id="q" value={filters.q} placeholder="Title, project, address…" onChange={(e) => updateFilter("q", e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="type">Type</label>
              <select id="type" value={filters.type} onChange={(e) => updateFilter("type", e.target.value)}>
                <option value="">Any</option>
                <option value="apartment">Apartment</option>
                <option value="shop">Shop</option>
                <option value="office">Office</option>
                <option value="house">House</option>
                <option value="plot">Plot</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="status">Status</label>
              <select id="status" value={filters.status} onChange={(e) => updateFilter("status", e.target.value)}>
                <option value="">Any</option>
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="minPrice">Min Price (PKR)</label>
              <input type="number" id="minPrice" min="0" value={filters.minPrice} onChange={(e) => updateFilter("minPrice", e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="maxPrice">Max Price (PKR)</label>
              <input type="number" id="maxPrice" min="0" value={filters.maxPrice} onChange={(e) => updateFilter("maxPrice", e.target.value)} />
            </div>
          </div>

          <p className="mono" style={{ fontSize: ".82rem", color: "var(--ink-soft)", marginBottom: 20 }}>
            {results ? `${results.length} listing${results.length === 1 ? "" : "s"} found` : "Searching…"}
          </p>

          <div className="grid" ref={gridRef}>
            {!results && <div className="empty-state">Loading listings…</div>}
            {results && !results.length && <div className="empty-state"><div className="glyph">&#9670;</div>No listings match those filters. Try widening your search.</div>}
            {results && results.map((p) => <PropertyCard property={p} key={p.id} />)}
          </div>
          {error && <p className="mono" style={{ color: "var(--coral)" }}>Couldn't load listings — {error}</p>}
        </div>
      </section>
    </div>
  );
}
