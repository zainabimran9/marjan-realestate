import { useState } from "react";
import { Link } from "react-router-dom";
import { Api } from "../lib/api";
import { toast } from "../lib/toast";
import { usePageTransition, useEnterAnimation } from "../lib/animations";

export default function ComingSoonProject() {
  const pageRef = usePageTransition();
  const cardRef = useEnterAnimation([]);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await Api.submitInquiry({ ...form, message: "Interested in the upcoming project — please notify me when details are available." });
      toast("Thanks — we'll reach out as soon as this project launches.");
      setForm({ name: "", phone: "" });
    } catch (err) {
      toast(`Couldn't send — ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div ref={pageRef} className="wrap" style={{ paddingTop: 56, paddingBottom: 80 }}>
      <div className="eyebrow">Our Projects</div>
      <h1 style={{ fontSize: "2.2rem", marginBottom: 8 }}>Our Next Development</h1>
      <p style={{ color: "var(--ink-soft)", marginBottom: 32 }}>Karachi &middot; Details being finalized</p>

      <div className="detail-layout">
        <div>
          <div className="empty-state" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 3, padding: "60px 30px" }}>
            <div className="glyph">&#9670;</div>
            <p style={{ maxWidth: "44ch", margin: "0 auto" }}>We're currently finalizing the design and unit details for our next project. Renderings, floor plans, and pricing will be added here as soon as they're ready.</p>
          </div>
          <p style={{ marginTop: 24 }}>In the meantime, take a look at <Link to="/projects/marjan-classic">Marjan Classic Mall &amp; Residency</Link>, our current live development — or leave your details below and we'll notify you the moment this project opens for booking.</p>
        </div>

        <div ref={cardRef}>
          <div className="sidebar-card">
            <h3 style={{ fontSize: "1.05rem" }}>Notify Me</h3>
            <form onSubmit={submit}>
              <div className="field" style={{ marginBottom: 12 }}>
                <label htmlFor="ns-name">Full name</label>
                <input type="text" id="ns-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="field" style={{ marginBottom: 16 }}>
                <label htmlFor="ns-phone">Phone</label>
                <input type="tel" id="ns-phone" required placeholder="03xx-xxxxxxx" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={sending}>
                {sending ? "Sending…" : "Notify Me"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
