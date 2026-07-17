import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Api, statusLabel, formatPrice } from "../lib/api";
import PropertyCard from "../components/PropertyCard";
import {
  useHeroTimeline, useHeroParallax, useCountUp,
  useScrollReveal, useBoardReveal, useStaggerReveal, usePageTransition
} from "../lib/animations";
import { useLightbox } from "../components/Lightbox";
import { useSiteVisit } from "../components/SiteVisitModal";
import InstallmentCalculator from "../components/InstallmentCalculator";
import ReviewsSection from "../components/ReviewsSection";

import elevationDay from "../assets/marjan/elevation-day.jpg";
import facadeCloseup from "../assets/marjan/facade-closeup.jpg";
import aerialRooftop from "../assets/marjan/aerial-rooftop.jpg";
import corridor1 from "../assets/marjan/corridor-1.jpg";
import corridor2 from "../assets/marjan/corridor-2.jpg";
import mobileMallExterior from "../assets/marjan/mobile-mall-exterior.jpg";
import modernElevation from "../assets/marjan/modern-elevation.jpg";
import floorplanLowerGround from "../assets/marjan/floorplan-lower-ground.jpg";
import floorplanGround from "../assets/marjan/floorplan-ground.jpg";
import floorplanFirst from "../assets/marjan/floorplan-first.jpg";
import floorplanTypical from "../assets/marjan/floorplan-typical.jpg";
import unitPlatinum from "../assets/marjan/unit-platinum.jpg";
import unitDiamond from "../assets/marjan/unit-diamond.jpg";
import unitGold from "../assets/marjan/unit-gold.jpg";

const gallery = [
  { src: facadeCloseup, label: "Street-level facade" },
  { src: elevationDay, label: "Full elevation" },
  { src: modernElevation, label: "Evening elevation" },
  { src: aerialRooftop, label: "Rooftop garden" },
  { src: mobileMallExterior, label: "Mall entrance" },
  { src: corridor1, label: "Residential corridor" },
  { src: corridor2, label: "Residential corridor" }
];

const floorPlans = [
  { src: floorplanLowerGround, label: "Lower Ground Floor — Shops" },
  { src: floorplanGround, label: "Ground Floor — Shops" },
  { src: floorplanFirst, label: "First Floor — Shops/Offices" },
  { src: floorplanTypical, label: "Typical Residential Floor" }
];

const unitTypes = [
  { src: unitPlatinum, label: "Platinum", size: "925.25 sq.ft." },
  { src: unitDiamond, label: "Diamond", size: "746.00 sq.ft." },
  { src: unitGold, label: "Gold", size: "574.25 sq.ft." }
];

export default function MarjanProject() {
  const [all, setAll] = useState(null);
  const [featured, setFeatured] = useState(null);
  const [error, setError] = useState(null);
  const lightbox = useLightbox();
  const siteVisit = useSiteVisit();

  useEffect(() => {
    Api.getProperties({}).then(setAll).catch((e) => setError(e.message));
    Api.getProperties({ featured: "true", status: "available" }).then(setFeatured).catch((e) => setError(e.message));
  }, []);

  const marjanUnits = (all || []).filter((p) => p.project === "Marjan Classic Mall & Residency")
    .sort((a, b) => (a.floor || "").localeCompare(b.floor || ""));
  const availableCount = marjanUnits.filter((p) => p.status === "available").length;

  const pageRef = usePageTransition();
  const eyebrowRef = useRef(null);
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const actionsRef = useRef(null);
  useHeroTimeline({ eyebrow: eyebrowRef, heading: headingRef, sub: subRef, actions: actionsRef });
  const heroBgRef = useHeroParallax();
  const floorsRef = useCountUp(all ? 6 : null, [all]);
  const useTypesRef = useCountUp(all ? 2 : null, [all]);
  const availableRef = useCountUp(all ? availableCount : null, [all]);
  const directoryHeadRef = useScrollReveal();
  const galleryHeadRef = useScrollReveal();
  const plansHeadRef = useScrollReveal();
  const sectionHeadRef = useScrollReveal();
  const aboutRef = useScrollReveal();
  const ctaRef = useScrollReveal();
  const boardRef = useBoardReveal([all]);
  const galleryRef = useStaggerReveal("img", []);
  const plansRef = useStaggerReveal("img", []);
  const gridRef = useStaggerReveal(".card", [featured]);

  return (
    <div ref={pageRef}>
      <section
        className="hero"
        ref={heroBgRef}
        style={{ backgroundImage: `linear-gradient(180deg, rgba(15,20,17,0.55) 0%, rgba(15,25,20,0.6) 55%, rgba(10,16,13,0.9) 100%), url(${elevationDay})` }}
      >
        <div className="hero-inner">
          <div className="hero-eyebrow" ref={eyebrowRef}>Sector 16-A &middot; Shah Latif Town &middot; Karachi</div>
          <h1 ref={headingRef}>A mall and a home, under one address.</h1>
          <p className="hero-sub" ref={subRef}>Marjan Classic Mall &amp; Residency pairs ground-floor retail with residential floors above — apartments, shops and offices, all with live availability you can check before you visit.</p>
          <div className="hero-actions" ref={actionsRef}>
            <Link to="/listings" className="btn btn-primary">View Available Units</Link>
            <button onClick={() => siteVisit.open({ title: "Marjan Classic Mall & Residency" })} className="btn btn-ghost-light">Book a Site Visit</button>
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

      <section className="section" id="gallery">
        <div className="wrap">
          <div className="section-head" ref={galleryHeadRef}>
            <div className="eyebrow">Renderings</div>
            <h2>A closer look</h2>
            <p>Click any image to view it full-size.</p>
          </div>
          <div className="grid" ref={galleryRef}>
            {gallery.map((g, i) => (
              <div key={i} className="card" style={{ cursor: "zoom-in" }} onClick={() => lightbox.open(g.src)}>
                <div className="card-img"><img src={g.src} alt={g.label} loading="lazy" /></div>
                <div className="card-body" style={{ padding: "14px 16px" }}>
                  <span style={{ fontSize: ".85rem", color: "var(--ink-soft)" }}>{g.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="featured" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head" ref={sectionHeadRef}>
            <div className="eyebrow">Featured</div>
            <h2>Currently available</h2>
            <p>A snapshot of what's open right now across the mall and residency floors.</p>
          </div>
          <div className="grid" ref={gridRef}>
            {!featured && <div className="empty-state">Loading listings…</div>}
            {featured && !featured.length && <div className="empty-state"><div className="glyph">&#9670;</div>No featured listings right now.</div>}
            {featured && featured.filter((p) => p.project === "Marjan Classic Mall & Residency").slice(0, 6).map((p) => <PropertyCard property={p} key={p.id} />)}
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
              <p style={{ color: "var(--ink-soft)", fontSize: ".85rem", marginTop: -8 }}>Developed by Merck Group of Builders</p>
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
                src="https://www.google.com/maps?q=Sector+16-A+Shah+Latif+Town+Karachi&output=embed"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="floor-plans">
        <div className="wrap">
          <div className="section-head" ref={plansHeadRef}>
            <div className="eyebrow">Floor Plans &amp; Unit Types</div>
            <h2>Layouts by floor</h2>
            <p>Click any plan to view it full-size.</p>
          </div>
          <div className="grid" ref={plansRef} style={{ marginBottom: 40 }}>
            {floorPlans.map((f, i) => (
              <div key={i} className="card" style={{ cursor: "zoom-in" }} onClick={() => lightbox.open(f.src)}>
                <div className="card-img" style={{ aspectRatio: "3/4" }}><img src={f.src} alt={f.label} loading="lazy" style={{ objectFit: "contain", background: "#fff" }} /></div>
                <div className="card-body" style={{ padding: "14px 16px" }}>
                  <span style={{ fontSize: ".85rem", color: "var(--ink-soft)" }}>{f.label}</span>
                </div>
              </div>
            ))}
          </div>
          <h3 style={{ marginBottom: 20 }}>Apartment Unit Types</h3>
          <div className="grid">
            {unitTypes.map((u, i) => (
              <div key={i} className="card" style={{ cursor: "zoom-in" }} onClick={() => lightbox.open(u.src)}>
                <div className="card-img" style={{ aspectRatio: "3/4" }}><img src={u.src} alt={u.label} loading="lazy" style={{ objectFit: "contain", background: "#fff" }} /></div>
                <div className="card-body" style={{ padding: "14px 16px" }}>
                  <span className="card-title" style={{ fontSize: "1rem" }}>{u.label}</span>
                  <span style={{ fontSize: ".8rem", color: "var(--ink-soft)", display: "block" }}>{u.size}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ background: "#fff", borderTop: "1px solid var(--line)" }}>
        <div className="wrap" style={{ maxWidth: 640 }}>
          <div className="eyebrow">Plan Your Budget</div>
          <h2 style={{ marginBottom: 20 }}>Payment Plan Calculator</h2>
          <InstallmentCalculator defaultPrice={8500000} />
        </div>
      </section>

      <ReviewsSection propertyTitle="Marjan Classic Mall & Residency" />

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
