import { useState } from "react";
import { Api } from "../lib/api";
import { toast } from "../lib/toast";
import { usePageTransition, useEnterAnimation } from "../lib/animations";

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const pageRef = usePageTransition();
  const formRef = useEnterAnimation([], {});
  const sideRef = useEnterAnimation([], { delay: 0.15 });

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await Api.submitInquiry(form);
      toast("Message sent — our team will call you back shortly.");
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch (err) {
      toast(`Couldn't send message — ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div ref={pageRef}>
      <section className="section-tight" style={{ paddingTop: 56 }}>
        <div className="wrap">
          <div className="detail-layout">
            <div>
              <div className="eyebrow">Get in Touch</div>
              <h1 style={{ fontSize: "2.2rem", marginBottom: 14 }}>Book a site visit</h1>
              <p style={{ color: "var(--ink-soft)", maxWidth: "50ch", marginBottom: 32 }}>Tell us what you're looking for — a floor, a unit type, a budget — and our sales team will get back to you with current pricing and a visit slot.</p>

              <div className="form-card" ref={formRef}>
                <form onSubmit={submit}>
                  <div className="form-grid" style={{ marginBottom: 16 }}>
                    <div className="field"><label htmlFor="c-name">Full name</label><input type="text" id="c-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                    <div className="field"><label htmlFor="c-phone">Phone</label><input type="tel" id="c-phone" required placeholder="03xx-xxxxxxx" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                  </div>
                  <div className="field" style={{ marginBottom: 16 }}><label htmlFor="c-email">Email (optional)</label><input type="email" id="c-email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                  <div className="field" style={{ marginBottom: 20 }}><label htmlFor="c-message">What are you looking for?</label><textarea id="c-message" placeholder="e.g. 2-bed apartment, budget around 90 Lac" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
                  <button type="submit" className="btn btn-primary" disabled={sending}>{sending ? "Sending…" : "Send Message"}</button>
                </form>
              </div>
            </div>

            <div>
              <div className="sidebar-card" style={{ position: "static" }} ref={sideRef}>
                <h3>Sales Office</h3>
                <p style={{ fontSize: ".9rem" }}>Merck Group of Builders<br/>Sector 16-A, Shah Latif Town, Karachi</p>
                <p className="mono" style={{ fontSize: ".85rem", color: "var(--coral)" }}>+92 300 0000000</p>
                <p className="mono" style={{ fontSize: ".85rem" }}>sales@marjanclassic.example</p>
                <p style={{ fontSize: ".85rem", color: "var(--ink-soft)" }}>Open 10:00 AM – 7:00 PM, every day</p>
                <iframe
                  className="map-embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Sales office location"
                  src="https://www.google.com/maps?q=Sector+16-A+Shah+Latif+Town+Karachi&output=embed"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
