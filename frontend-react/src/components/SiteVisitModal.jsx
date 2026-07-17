import { createContext, useContext, useState } from "react";
import { Api } from "../lib/api";
import { toast } from "../lib/toast";

const SiteVisitContext = createContext(null);

export function SiteVisitProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [propertyContext, setPropertyContext] = useState(null); // { id, title } or null
  const [form, setForm] = useState({ name: "", phone: "", date: "" });
  const [sending, setSending] = useState(false);

  const openModal = (context = null) => {
    setPropertyContext(context);
    setOpen(true);
  };
  const closeModal = () => setOpen(false);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await Api.submitInquiry({
        name: form.name,
        phone: form.phone,
        message: `Site visit requested for ${form.date || "a date to be confirmed"}.`,
        propertyId: propertyContext?.id || null,
        propertyTitle: propertyContext?.title || null,
        siteVisitDate: form.date
      });
      toast("Site visit requested — our team will confirm the time with you.");
      setForm({ name: "", phone: "", date: "" });
      setOpen(false);
    } catch (err) {
      toast(`Couldn't submit — ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <SiteVisitContext.Provider value={{ open: openModal }}>
      {children}
      {open && (
        <div
          style={{ display: "flex", position: "fixed", inset: 0, background: "rgba(20,32,27,0.5)", zIndex: 80, alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="form-card" style={{ maxWidth: 420, width: "100%" }}>
            <h3 style={{ marginBottom: 4 }}>Schedule a Site Visit</h3>
            <p style={{ fontSize: ".85rem", color: "var(--ink-soft)", marginBottom: 20 }}>
              {propertyContext?.title ? `For: ${propertyContext.title}` : "Our team will confirm the exact time with you."}
            </p>
            <form onSubmit={submit}>
              <div className="field" style={{ marginBottom: 12 }}>
                <label htmlFor="sv-name">Full name</label>
                <input type="text" id="sv-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="field" style={{ marginBottom: 12 }}>
                <label htmlFor="sv-phone">Phone</label>
                <input type="tel" id="sv-phone" required placeholder="03xx-xxxxxxx" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="field" style={{ marginBottom: 20 }}>
                <label htmlFor="sv-date">Preferred date</label>
                <input type="date" id="sv-date" value={form.date} min={new Date().toISOString().split("T")[0]} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button type="submit" className="btn btn-primary" disabled={sending} style={{ flex: 1, justifyContent: "center" }}>
                  {sending ? "Sending…" : "Request Visit"}
                </button>
                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SiteVisitContext.Provider>
  );
}

export function useSiteVisit() {
  return useContext(SiteVisitContext);
}
