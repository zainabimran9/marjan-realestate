import { useState } from "react";
import { Api } from "../lib/api";
import { toast } from "../lib/toast";
import { usePageTransition, useEnterAnimation } from "../lib/animations";

const emptyForm = {
  name: "", phone: "", email: "", city: "", source: "",
  budgetRange: "", propertyType: "", message: ""
};

export default function Contact() {
  const [form, setForm] = useState(emptyForm);
  const [sending, setSending] = useState(false);

  const pageRef = usePageTransition();
  const formRef = useEnterAnimation([], {});
  const sideRef = useEnterAnimation([], { delay: 0.15 });

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await Api.submitInquiry(form);
      toast("Message sent — our team will call you back shortly.");
      setForm(emptyForm);
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
              <h1 style={{ fontSize: "2.2rem", marginBottom: 14 }}>Let's talk about your property goal</h1>
              <p style={{ color: "var(--ink-soft)", maxWidth: "50ch", marginBottom: 32 }}>Tell us a bit about what you're looking for and our sales team will get back to you with current pricing and availability.</p>

              <div className="form-card" ref={formRef}>
                <form onSubmit={submit}>
                  <div className="form-grid" style={{ marginBottom: 16 }}>
                    <div className="field"><label htmlFor="c-name">Full name *</label><input type="text" id="c-name" required value={form.name} onChange={set("name")} /></div>
                    <div className="field"><label htmlFor="c-phone">Phone *</label><input type="tel" id="c-phone" required placeholder="03xx-xxxxxxx" value={form.phone} onChange={set("phone")} /></div>
                  </div>
                  <div className="form-grid" style={{ marginBottom: 16 }}>
                    <div className="field"><label htmlFor="c-email">Email</label><input type="email" id="c-email" value={form.email} onChange={set("email")} /></div>
                    <div className="field"><label htmlFor="c-city">City</label><input type="text" id="c-city" placeholder="Karachi" value={form.city} onChange={set("city")} /></div>
                  </div>
                  <div className="form-grid" style={{ marginBottom: 16 }}>
                    <div className="field">
                      <label htmlFor="c-budget">Budget Range</label>
                      <select id="c-budget" value={form.budgetRange} onChange={set("budgetRange")}>
                        <option value="">Select a range</option>
                        <option value="Under 50 Lac">Under 50 Lac</option>
                        <option value="50 Lac - 1 Crore">50 Lac – 1 Crore</option>
                        <option value="1 - 2 Crore">1 – 2 Crore</option>
                        <option value="2 - 5 Crore">2 – 5 Crore</option>
                        <option value="5 Crore+">5 Crore+</option>
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="c-type">Property Type</label>
                      <select id="c-type" value={form.propertyType} onChange={set("propertyType")}>
                        <option value="">Select a type</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Shop">Shop</option>
                        <option value="Office">Office</option>
                        <option value="Plot">Plot</option>
                        <option value="House">House</option>
                      </select>
                    </div>
                  </div>
                  <div className="field" style={{ marginBottom: 16 }}>
                    <label htmlFor="c-source">How did you find us?</label>
                    <select id="c-source" value={form.source} onChange={set("source")}>
                      <option value="">Select an option</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Google Search">Google Search</option>
                      <option value="Referral">Referral</option>
                      <option value="Site Visit / Walk-in">Site Visit / Walk-in</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="field" style={{ marginBottom: 20 }}><label htmlFor="c-message">Additional message</label><textarea id="c-message" placeholder="e.g. 2-bed apartment, budget around 90 Lac" value={form.message} onChange={set("message")} /></div>
                  <button type="submit" className="btn btn-primary" disabled={sending}>{sending ? "Sending…" : "Submit Now"}</button>
                </form>
              </div>
            </div>

            <div>
              <div className="sidebar-card" style={{ position: "static" }} ref={sideRef}>
                <h3>Sales Office</h3>
                <p style={{ fontSize: ".9rem" }}>Marjan Classic Mall &amp; Residency<br/>Sector 16-A, Shah Latif Town, Karachi</p>
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
