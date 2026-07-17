import { useEffect, useState } from "react";
import { Api } from "../lib/api";
import { toast } from "../lib/toast";
import StarRating from "./StarRating";
import { useScrollReveal, useStaggerReveal } from "../lib/animations";

export default function ReviewsSection({ propertyTitle = null }) {
  const [reviews, setReviews] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", rating: 0, comment: "" });
  const [sending, setSending] = useState(false);

  const headRef = useScrollReveal();
  const listRef = useStaggerReveal(".review-card", [reviews]);

  useEffect(() => {
    Api.getReviews().then(setReviews).catch(() => setReviews([]));
  }, []);

  const avg = reviews?.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : 0;

  const submit = async (e) => {
    e.preventDefault();
    if (!form.rating) { toast("Please select a star rating."); return; }
    setSending(true);
    try {
      await Api.submitReview({ ...form, propertyTitle });
      toast("Thanks — your review is submitted and will appear once approved.");
      setForm({ name: "", rating: 0, comment: "" });
      setShowForm(false);
    } catch (err) {
      toast(`Couldn't submit — ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="section-tight" style={{ background: "#fff", borderTop: "1px solid var(--line)" }}>
      <div className="wrap">
        <div className="section-head" ref={headRef} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div className="eyebrow">Client Reviews</div>
            <h2 style={{ marginBottom: 6 }}>What people are saying</h2>
            {reviews?.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <StarRating value={Math.round(avg)} readOnly />
                <span className="mono" style={{ fontSize: ".85rem", color: "var(--ink-soft)" }}>
                  {avg.toFixed(1)} out of 5 &middot; {reviews.length} review{reviews.length === 1 ? "" : "s"}
                </span>
              </div>
            )}
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Cancel" : "Write a Review"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={submit} className="form-card" style={{ marginBottom: 32, maxWidth: 480 }}>
            <div className="field" style={{ marginBottom: 14 }}>
              <label>Your rating</label>
              <StarRating value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} size={28} />
            </div>
            <div className="field" style={{ marginBottom: 14 }}>
              <label htmlFor="rev-name">Your name</label>
              <input type="text" id="rev-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="field" style={{ marginBottom: 16 }}>
              <label htmlFor="rev-comment">Your review</label>
              <textarea id="rev-comment" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="Tell others about your experience…" />
            </div>
            <button type="submit" className="btn btn-primary btn-sm" disabled={sending}>{sending ? "Submitting…" : "Submit Review"}</button>
          </form>
        )}

        {!reviews && <p className="mono" style={{ fontSize: ".85rem", color: "var(--ink-soft)" }}>Loading reviews…</p>}
        {reviews && !reviews.length && (
          <p style={{ color: "var(--ink-soft)" }}>No reviews yet — be the first to share your experience.</p>
        )}
        <div className="grid" ref={listRef}>
          {reviews?.slice(0, 6).map((r) => (
            <div key={r.id} className="review-card form-card">
              <StarRating value={r.rating} readOnly size={16} />
              <p style={{ margin: "12px 0", fontSize: ".92rem" }}>{r.comment || "—"}</p>
              <p className="mono" style={{ fontSize: ".78rem", color: "var(--ink-soft)", margin: 0 }}>{r.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
