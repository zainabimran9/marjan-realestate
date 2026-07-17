import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Api, Favorites, formatPrice, statusLabel } from "../lib/api";
import { toast } from "../lib/toast";
import { useLightbox } from "../components/Lightbox";
import { useSiteVisit } from "../components/SiteVisitModal";
import InstallmentCalculator from "../components/InstallmentCalculator";
import { useStaggerReveal, usePageTransition } from "../lib/animations";

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [error, setError] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const lightbox = useLightbox();
  const siteVisit = useSiteVisit();

  useEffect(() => {
    setProperty(null);
    Api.getProperty(id)
      .then((p) => { setProperty(p); setIsFav(Favorites.has(p.id)); })
      .catch((e) => setError(e.message));
  }, [id]);

  const pageRef = usePageTransition();
  const galleryRef = useStaggerReveal("img", [property], { stagger: 0.08 });

  const toggleFav = () => {
    if (!property) return;
    setIsFav(Favorites.toggle(property.id));
  };

  const submitInquiry = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await Api.submitInquiry({ ...form, propertyId: property.id, propertyTitle: property.title });
      toast("Inquiry sent — our team will call you back shortly.");
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch (err) {
      toast(`Couldn't send inquiry — ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  if (error) return <div className="wrap" style={{ paddingTop: 36 }}><div className="empty-state">Couldn't load this listing — {error}</div></div>;
  if (!property) return <div className="wrap" style={{ paddingTop: 36 }}><div className="empty-state">Loading listing…</div></div>;

  const gallery = property.images?.length ? property.images : ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80"];
  const sideImgs = gallery.slice(1, 3);

  return (
    <div ref={pageRef} className="wrap" style={{ paddingTop: 36 }}>
      <div className="eyebrow">{property.project}</div>
      <h1 style={{ fontSize: "2.1rem", marginBottom: 6 }}>{property.title}</h1>
      <p style={{ color: "var(--ink-soft)", marginBottom: 28 }}>{property.address}</p>

      <div className="detail-gallery" ref={galleryRef}>
        <img src={gallery[0]} alt={property.title} style={{ cursor: "zoom-in" }} onClick={() => lightbox.open(gallery[0])} />
        <div className="detail-gallery-side">
          {(sideImgs.length ? sideImgs : [gallery[0]]).map((src, i) => (
            <img key={i} src={src} alt="" style={{ cursor: "zoom-in" }} onClick={() => lightbox.open(src)} />
          ))}
        </div>
      </div>

      <div className="detail-layout">
        <div>
          <h3>Overview</h3>
          <p>{property.description || "No description provided yet."}</p>

          <div className="spec-list">
            <div className="spec-item"><div className="num">{property.areaSqft ? `${property.areaSqft} sqft` : "—"}</div><div className="lbl">Area</div></div>
            <div className="spec-item"><div className="num">{property.bedrooms ?? "—"}</div><div className="lbl">Bedrooms</div></div>
            <div className="spec-item"><div className="num">{property.bathrooms ?? "—"}</div><div className="lbl">Bathrooms</div></div>
            <div className="spec-item"><div className="num">{property.floor || "—"}</div><div className="lbl">Floor</div></div>
          </div>

          <h3>Amenities</h3>
          <ul className="amenity-list">
            {(property.amenities || []).length ? property.amenities.map((a, i) => <li key={i}>{a}</li>) : <li>Not specified</li>}
          </ul>

          <h3 style={{ marginTop: 32, marginBottom: 20 }}>Payment Plan Calculator</h3>
          <InstallmentCalculator defaultPrice={property.price} />

          <h3 style={{ marginTop: 32 }}>Location</h3>
          <iframe
            className="map-embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Property location"
            src={`https://www.google.com/maps?q=${encodeURIComponent(property.mapQuery || property.address)}&output=embed`}
          />
        </div>

        <div>
          <div className="sidebar-card">
            <span className={`status-pill ${property.status}`}>{statusLabel(property.status)}</span>
            <div className="price">{property.priceLabel || formatPrice(property.price)}</div>
            <p style={{ fontSize: ".82rem", color: "var(--ink-soft)", marginBottom: 20 }}>{property.type} &middot; {property.floor || property.city}</p>

            <button className="btn btn-outline btn-sm" style={{ width: "100%", justifyContent: "center", marginBottom: 10 }} onClick={toggleFav}>
              {isFav ? "\u2665 Saved to favorites" : "\u2661 Save to favorites"}
            </button>
            <button className="btn btn-primary btn-sm" style={{ width: "100%", justifyContent: "center", marginBottom: 20 }} onClick={() => siteVisit.open({ id: property.id, title: property.title })}>
              Schedule a Site Visit
            </button>

            <h3 style={{ fontSize: "1.05rem" }}>Interested?</h3>
            <form onSubmit={submitInquiry}>
              <div className="field" style={{ marginBottom: 12 }}>
                <label htmlFor="name">Full name</label>
                <input type="text" id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="field" style={{ marginBottom: 12 }}>
                <label htmlFor="phone">Phone</label>
                <input type="tel" id="phone" required placeholder="03xx-xxxxxxx" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="field" style={{ marginBottom: 12 }}>
                <label htmlFor="email">Email (optional)</label>
                <input type="email" id="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="field" style={{ marginBottom: 16 }}>
                <label htmlFor="message">Message</label>
                <textarea id="message" placeholder="I'd like to know more about this unit…" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={sending}>
                {sending ? "Sending…" : "Send Inquiry"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
