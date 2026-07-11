import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Api, statusLabel, formatPrice } from "../lib/api";
import PropertyCard from "../components/PropertyCard";
import {
  useHeroTimeline, useHeroParallax, useCountUp,
  useScrollReveal, useBoardReveal, useStaggerReveal, usePageTransition
} from "../lib/animations";

export default function Home() {
  const [all, setAll] = useState(null);
  const [featured, setFeatured] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Api.getProperties({}).then(setAll).catch((e) => setError(e.message));
    Api.getProperties({ featured: "true", status: "available" }).then(setFeatured).catch((e) => setError(e.message));
  }, []);

  const marjanUnits = (all || []).filter((p) => p.project === "Marjan Classic Mall & Residency")
    .sort((a, b) => (a.floor || "").localeCompare(b.floor || ""));
  const availableCount = (all || []).filter((p) => p.status === "available").length;

  const pageRef = usePageTransition();
  const heroTextRef = useHeroTimeline();
  const heroBgRef = useHeroParallax();
  const floorsRef = useCountUp(all ? 6 : null, [all]);
  const useTypesRef = useCountUp(all ? 2 : null, [all]);
  const availableRef = useCountUp(all ? availableCount : null, [all]);
  const directoryHeadRef = useScrollReveal();
  const sectionHeadRef = useScrollReveal();
  const aboutRef = useScrollReveal();
  const ctaRef = useScrollReveal();
  const boardRef = useBoardReveal([all]);
  const gridRef = useStaggerReveal(".card", [featured]);

  return (
    <div ref={pageRef}>
      <section className="hero" ref={heroBgRef}>
        <div className="hero-inner" ref={heroTextRef}>
          <div className="hero-eyebrow">Sector 16-A &middot; Shah Latif Town &middot; Karachi</div>
          <h1>A mall and a home, under one address.</h1>
          <p className="hero-sub">Marjan Classic Mall &amp; Residency pairs ground-floor retail with residential floors above — apartments, shops and offices, all with live availability you can check before you visit.</p>
          <div className="hero-actions">
            <Link to="/listings" className="btn btn-primary">View Available Units</Link>
            <Link to="/contact" className="btn btn-ghost-light">Book a Site Visit</Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><div className="num" ref={floorsRef}>0</div><div className="lbl">Floors</div></div>
            <div className="hero-stat"><div className="num" ref={useTypesRef}>0</div><div className="lbl">Use Types</div></div>
            <div className="hero-stat"><div className="num" ref={availableRef}>0</div><div className="lbl">Units Available</div></div>
            <div className="hero-stat"><div className="num">220+</div><div className="lbl">Sq.Ft. From</div></div>
          </div>
        </div>
      </section>

      <section className="directory">
        <div className="wrap">
          <div className="directory-head" ref={directoryHeadRef}>
            <div>
              <div className="eyebrow" style={{ color: "var(--brass-light)" }}>Building Directory</div>
              <h2>Browse by floor</h2>
              <p>Live status straight from the sales office — updated as units move from available to reserved to sold.</p>
            </div>
            <Link to="/listings" className="btn btn-ghost-light btn-sm">Full listings &rarr;</Link>
          </div>
          <div className="board" ref={boardRef}>
            {!all && <div className="board-row"><span className="mono" style={{ opacity: 0.5 }}>Loading directory…</span></div>}
            {all && !marjanUnits.length && <div className="board-row"><span className="mono">No units listed yet.</span></div>}
            {marjanUnits.map((p) => (
              <Link className="board-row" to={`/property/${p.id}`} key={p.id}>
                <span className="board-floor">{p.floor || "—"}</span>
                <span className="board-unit">
                  {p.title.replace("Marjan Classic Mall & Residency — ", "")}
                  <small>{p.type} &middot; {p.areaSqft || "—"} sqft</small>
                </span>
                <span className={`board-status ${p.status}`}>{statusLabel(p.status)}</span>
                <span className="board-price">{p.priceLabel || formatPrice(p.price)}</span>
                <span className="board-arrow">&rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="featured">
        <div className="wrap">
          <div className="section-head" ref={sectionHeadRef}>
            <div className="eyebrow">Featured</div>
            <h2>Currently available</h2>
            <p>A snapshot of what's open right now across the mall and residency floors.</p>
          </div>
          <div className="grid" ref={gridRef}>
            {!featured && <div className="empty-state">Loading listings…</div>}
            {featured && !featured.length && <div className="empty-state"><div className="glyph">&#9670;</div>No featured listings right now.</div>}
            {featured && featured.slice(0, 6).map((p) => <PropertyCard property={p} key={p.id} />)}
          </div>
          {error && <p className="mono" style={{ color: "var(--coral)" }}>Couldn't load listings — {error}</p>}
        </div>
      </section>

      <section className="section section-tight" id="about" style={{ background: "#fff", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="detail-layout" ref={aboutRef}>
            <div>
              <div className="eyebrow">About the Project</div>
              <h2>Built for two kinds of days</h2>
              <p>Marjan Classic Mall &amp; Residency sits on Sector 16-A's main frontage in Shah Latif Town — a ground-and-first-floor retail mall with a separate residential lobby serving the apartment floors above. Shops get direct footfall from the mall corridor; apartments get a quieter entrance, dedicated lift bank, and 24/7 security shared across the building.</p>
              <p>It's built for residents who want their daily errands — a tuition centre, a clinic, a grocery shop — a lift ride away, and for shop owners who want a residential customer base built into the same address.</p>
              <ul className="amenity-list">
                <li>24/7 security</li><li>Backup generator</li><li>Reserved parking</li><li>Separate residential lobby</li><li>Mosque on premises</li><li>Lift access on all floors</li>
              </ul>
            </div>
            <div className="sidebar-card" style={{ position: "static" }}>
              <h3>Location</h3>
              <p className="mono" style={{ fontSize: ".85rem", color: "var(--ink-soft)" }}>Sector 16-A, Shah Latif Town, Karachi</p>
              <iframe
                className="map-embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Marjan Classic Mall & Residency location"
                src="https://www.google.com/maps?q=Marjan+Classic+Mall+%26+Residency+Sector+16-A+Shah+Latif+Town+Karachi&output=embed"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap" ref={ctaRef}>
          <h2>Have a unit in mind?</h2>
          <p>Send us your details and floor preference — our team will call you back with current pricing and a site visit slot.</p>
          <Link to="/contact" className="btn" style={{ background: "var(--ink)", color: "var(--ivory)" }}>Get in Touch</Link>
        </div>
      </section>
    </div>
  );
}
