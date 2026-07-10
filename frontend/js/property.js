// property.js — loads one listing by ?id= and renders detail + inquiry form

const id = Number(new URLSearchParams(window.location.search).get("id"));
const root = document.getElementById("property-root");

function statusLabel(s) {
  return { available: "Available", reserved: "Reserved", sold: "Sold" }[s] || s;
}

function render(p) {
  document.getElementById("page-title").textContent = `${p.title} | Marjan Classic Mall & Residency`;

  const gallery = p.images?.length ? p.images : ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80"];
  const mainImg = gallery[0];
  const sideImgs = gallery.slice(1, 3);

  root.innerHTML = `
    <div class="eyebrow">${p.project}</div>
    <h1 style="font-size:2.1rem; margin-bottom:6px;">${p.title}</h1>
    <p style="color:var(--ink-soft); margin-bottom:28px;">${p.address}</p>

    <div class="detail-gallery">
      <img src="${mainImg}" alt="${p.title}" />
      <div class="detail-gallery-side">
        ${sideImgs.map((src) => `<img src="${src}" alt="" />`).join("") || `<img src="${mainImg}" alt="" />`}
      </div>
    </div>

    <div class="detail-layout">
      <div>
        <h3>Overview</h3>
        <p>${p.description || "No description provided yet."}</p>

        <div class="spec-list">
          <div class="spec-item"><div class="num">${p.areaSqft ? p.areaSqft + " sqft" : "—"}</div><div class="lbl">Area</div></div>
          <div class="spec-item"><div class="num">${p.bedrooms ?? "—"}</div><div class="lbl">Bedrooms</div></div>
          <div class="spec-item"><div class="num">${p.bathrooms ?? "—"}</div><div class="lbl">Bathrooms</div></div>
          <div class="spec-item"><div class="num">${p.floor || "—"}</div><div class="lbl">Floor</div></div>
        </div>

        <h3>Amenities</h3>
        <ul class="amenity-list">
          ${(p.amenities || []).map((a) => `<li>${a}</li>`).join("") || "<li>Not specified</li>"}
        </ul>

        <h3 style="margin-top:32px;">Location</h3>
        <iframe class="map-embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?q=${encodeURIComponent(p.mapQuery || p.address)}&output=embed"></iframe>
      </div>

      <div>
        <div class="sidebar-card">
          <span class="status-pill ${p.status}">${statusLabel(p.status)}</span>
          <div class="price">${p.priceLabel || formatPrice(p.price)}</div>
          <p style="font-size:.82rem; color:var(--ink-soft); margin-bottom:20px;">${p.type} &middot; ${p.floor || p.city}</p>

          <button class="btn btn-outline btn-sm" id="fav-btn" style="width:100%; justify-content:center; margin-bottom:20px;">
            ${Favorites.has(p.id) ? "&#9829; Saved to favorites" : "&#9825; Save to favorites"}
          </button>

          <h3 style="font-size:1.05rem;">Interested?</h3>
          <form id="inquiry-form">
            <div class="field" style="margin-bottom:12px;">
              <label for="name">Full name</label>
              <input type="text" id="name" required />
            </div>
            <div class="field" style="margin-bottom:12px;">
              <label for="phone">Phone</label>
              <input type="tel" id="phone" required placeholder="03xx-xxxxxxx" />
            </div>
            <div class="field" style="margin-bottom:12px;">
              <label for="email">Email (optional)</label>
              <input type="email" id="email" />
            </div>
            <div class="field" style="margin-bottom:16px;">
              <label for="message">Message</label>
              <textarea id="message" placeholder="I'd like to know more about this unit…"></textarea>
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center;">Send Inquiry</button>
          </form>
        </div>
      </div>
    </div>
  `;

  animateReveal(".detail-gallery img", { stagger: 0.08 });
  animateReveal(".detail-layout > div", { y: 16, stagger: 0.12 });
  initLightbox(".detail-gallery img");

  document.getElementById("fav-btn").addEventListener("click", () => {
    const nowFav = Favorites.toggle(p.id);
    document.getElementById("fav-btn").innerHTML = nowFav ? "&#9829; Saved to favorites" : "&#9825; Save to favorites";
    toast(nowFav ? "Saved to favorites" : "Removed from favorites");
  });

  document.getElementById("inquiry-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector("button[type=submit]");
    btn.disabled = true;
    btn.textContent = "Sending…";
    try {
      await Api.submitInquiry({
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value,
        propertyId: p.id,
        propertyTitle: p.title
      });
      toast("Inquiry sent — our team will call you back shortly.");
      e.target.reset();
    } catch (err) {
      toast(`Couldn't send inquiry — ${err.message}`);
    } finally {
      btn.disabled = false;
      btn.textContent = "Send Inquiry";
    }
  });
}

async function init() {
  if (!id) {
    root.innerHTML = `<div class="empty-state">No listing specified.</div>`;
    return;
  }
  try {
    const p = await Api.getProperty(id);
    render(p);
  } catch (err) {
    root.innerHTML = `<div class="empty-state">Couldn't load this listing — ${err.message}</div>`;
  }
}

init();
