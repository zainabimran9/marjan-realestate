import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Api, formatPrice } from "../lib/api";
import { toast } from "../lib/toast";

const emptyForm = {
  id: "", title: "", project: "Independent Listing", type: "apartment", status: "available",
  price: "", priceLabel: "", areaSqft: "", floor: "", bedrooms: "", bathrooms: "",
  city: "Karachi", featured: "false", address: "", images: "", amenities: "", description: ""
};

function statusColor(s) {
  return { available: "#3a6b30", reserved: "var(--brass)", sold: "var(--ink-soft)" }[s] || "var(--ink-soft)";
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("listings");
  const [listings, setListings] = useState(null);
  const [inquiries, setInquiries] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("marjan_admin_token")) {
      navigate("/admin/login");
      return;
    }
    loadListings();
    loadInquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function loadListings() {
    setListings(null);
    Api.getProperties({}).then(setListings).catch((e) => toast(`Couldn't load listings — ${e.message}`));
  }
  function loadInquiries() {
    setInquiries(null);
    Api.getInquiries().then(setInquiries).catch((e) => toast(`Couldn't load inquiries — ${e.message}`));
  }

  function logout() {
    localStorage.removeItem("marjan_admin_token");
    navigate("/admin/login");
  }

  function openForm(property = null) {
    if (!property) { setForm(emptyForm); setFormOpen(true); return; }
    setForm({
      id: property.id, title: property.title, project: property.project, type: property.type,
      status: property.status, price: property.price, priceLabel: property.priceLabel || "",
      areaSqft: property.areaSqft || "", floor: property.floor || "", bedrooms: property.bedrooms || "",
      bathrooms: property.bathrooms || "", city: property.city || "Karachi",
      featured: property.featured ? "true" : "false", address: property.address || "",
      images: (property.images || []).join("\n"), amenities: (property.amenities || []).join(", "),
      description: property.description || ""
    });
    setFormOpen(true);
  }

  async function saveListing(e) {
    e.preventDefault();
    setSaving(true);
    const body = {
      title: form.title, project: form.project, type: form.type, status: form.status,
      price: Number(form.price), priceLabel: form.priceLabel,
      areaSqft: form.areaSqft ? Number(form.areaSqft) : null,
      floor: form.floor, bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : null, city: form.city,
      featured: form.featured === "true", address: form.address, mapQuery: form.address,
      images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
      amenities: form.amenities.split(",").map((s) => s.trim()).filter(Boolean),
      description: form.description
    };
    try {
      if (form.id) await Api.updateProperty(form.id, body);
      else await Api.createProperty(body);
      toast("Listing saved");
      setFormOpen(false);
      loadListings();
    } catch (err) {
      toast(`Couldn't save — ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function deleteListing(id) {
    if (!window.confirm("Delete this listing? This can't be undone.")) return;
    try {
      await Api.deleteProperty(id);
      toast("Listing deleted");
      loadListings();
    } catch (err) {
      toast(`Couldn't delete — ${err.message}`);
    }
  }

  async function updateInquiryStatus(id, status) {
    try {
      await Api.updateInquiry(id, status);
      toast("Status updated");
      loadInquiries();
    } catch (err) {
      toast(`Couldn't update — ${err.message}`);
    }
  }

  const newCount = inquiries?.filter((i) => i.status === "new").length || 0;

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="brand">Merck Group<span>Admin Panel</span></div>
        <nav>
          <a href="#listings" className={tab === "listings" ? "active" : ""} onClick={(e) => { e.preventDefault(); setTab("listings"); }}>Listings</a>
          <a href="#inquiries" className={tab === "inquiries" ? "active" : ""} onClick={(e) => { e.preventDefault(); setTab("inquiries"); }}>
            Inquiries {newCount > 0 && `(${newCount})`}
          </a>
          <a href="#logout" onClick={(e) => { e.preventDefault(); logout(); }}>Sign Out</a>
        </nav>
      </aside>

      <main className="admin-main">
        {tab === "listings" && (
          <section>
            <div className="directory-head" style={{ color: "var(--ink)", marginBottom: 28 }}>
              <div>
                <h2 style={{ color: "var(--ink)" }}>Listings</h2>
                <p style={{ color: "var(--ink-soft)", margin: 0 }}>Add, edit or remove properties shown on the site.</p>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => openForm(null)}>+ New Listing</button>
            </div>

            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Title</th><th>Project</th><th>Type</th><th>Status</th><th>Price</th><th>City</th><th></th></tr></thead>
                <tbody>
                  {!listings && <tr><td colSpan={7}>Loading…</td></tr>}
                  {listings && !listings.length && <tr><td colSpan={7}>No listings yet. Click "New Listing" to add one.</td></tr>}
                  {listings && listings.map((p) => (
                    <tr key={p.id}>
                      <td>{p.title}</td>
                      <td>{p.project}</td>
                      <td>{p.type}</td>
                      <td><span style={{ color: statusColor(p.status), fontFamily: "var(--font-mono)", fontSize: ".78rem", textTransform: "uppercase" }}>{p.status}</span></td>
                      <td className="mono">{p.priceLabel || formatPrice(p.price)}</td>
                      <td>{p.city}</td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openForm(p)}>Edit</button>{" "}
                        <button className="btn btn-danger btn-sm" onClick={() => deleteListing(p.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === "inquiries" && (
          <section>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ color: "var(--ink)" }}>Inquiries</h2>
              <p style={{ color: "var(--ink-soft)", margin: 0 }}>Leads submitted from the contact form and listing pages.</p>
            </div>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Property</th><th>Budget</th><th>Type</th><th>Visit Date</th><th>Message</th><th>Received</th><th>Status</th></tr></thead>
                <tbody>
                  {!inquiries && <tr><td colSpan={10}>Loading…</td></tr>}
                  {inquiries && !inquiries.length && <tr><td colSpan={10}>No inquiries yet.</td></tr>}
                  {inquiries && inquiries.map((i) => (
                    <tr key={i.id}>
                      <td>{i.name}</td>
                      <td>{i.phone}</td>
                      <td>{i.email || "—"}</td>
                      <td>{i.propertyTitle || "General inquiry"}</td>
                      <td>{i.budgetRange || "—"}</td>
                      <td>{i.propertyType || "—"}</td>
                      <td className="mono" style={{ fontSize: ".78rem" }}>{i.siteVisitDate || "—"}</td>
                      <td style={{ maxWidth: 220 }}>{i.message || "—"}</td>
                      <td className="mono" style={{ fontSize: ".78rem" }}>{new Date(i.createdAt).toLocaleString()}</td>
                      <td>
                        <select value={i.status} style={{ fontSize: ".78rem", padding: "4px 6px" }} onChange={(e) => updateInquiryStatus(i.id, e.target.value)}>
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {formOpen && (
        <div style={{ display: "flex", position: "fixed", inset: 0, background: "rgba(20,32,27,0.5)", zIndex: 60, alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="form-card" style={{ maxWidth: 640, width: "100%", maxHeight: "88vh", overflowY: "auto" }}>
            <h3>{form.id ? "Edit Listing" : "New Listing"}</h3>
            <form onSubmit={saveListing}>
              <div className="form-grid">
                <div className="field"><label>Title *</label><input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                <div className="field"><label>Project</label><input type="text" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} /></div>
                <div className="field"><label>Type *</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option value="apartment">Apartment</option><option value="shop">Shop</option><option value="office">Office</option><option value="house">House</option><option value="plot">Plot</option>
                  </select>
                </div>
                <div className="field"><label>Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="available">Available</option><option value="reserved">Reserved</option><option value="sold">Sold</option>
                  </select>
                </div>
                <div className="field"><label>Price (PKR) *</label><input type="number" required min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
                <div className="field"><label>Price Label</label><input type="text" placeholder="e.g. PKR 85 Lac" value={form.priceLabel} onChange={(e) => setForm({ ...form, priceLabel: e.target.value })} /></div>
                <div className="field"><label>Area (sqft)</label><input type="number" min="0" value={form.areaSqft} onChange={(e) => setForm({ ...form, areaSqft: e.target.value })} /></div>
                <div className="field"><label>Floor</label><input type="text" placeholder="e.g. 4th Floor" value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} /></div>
                <div className="field"><label>Bedrooms</label><input type="number" min="0" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} /></div>
                <div className="field"><label>Bathrooms</label><input type="number" min="0" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} /></div>
                <div className="field"><label>City</label><input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
                <div className="field"><label>Featured</label>
                  <select value={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.value })}>
                    <option value="false">No</option><option value="true">Yes</option>
                  </select>
                </div>
              </div>
              <div className="field" style={{ marginTop: 16 }}><label>Address</label><input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
              <div className="field" style={{ marginTop: 16 }}><label>Image URLs (one per line)</label><textarea value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} /></div>
              <div className="field" style={{ marginTop: 16 }}><label>Amenities (comma separated)</label><input type="text" value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} /></div>
              <div className="field" style={{ marginTop: 16 }}><label>Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving…" : "Save Listing"}</button>
                <button type="button" className="btn btn-outline" onClick={() => setFormOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
