// listings.js — search + filter listings, reads/writes filter state to the URL

const form = document.getElementById("filter-form");
const grid = document.getElementById("results-grid");
const countEl = document.getElementById("result-count");

function cardTemplate(p) {
  const img = p.images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80";
  const isFav = Favorites.has(p.id);
  return `
    <a class="card" href="property.html?id=${p.id}">
      <div class="card-img">
        <img src="${img}" alt="${p.title}" loading="lazy" />
        <span class="card-tag">${p.type}</span>
        <button class="card-fav" aria-label="Save listing" onclick="event.preventDefault(); handleFavClick(${p.id}, this)">${isFav ? "&#9829;" : "&#9825;"}</button>
      </div>
      <div class="card-body">
        <div class="card-price mono">${p.priceLabel || formatPrice(p.price)}</div>
        <h3 class="card-title">${p.title}</h3>
        <div class="card-loc">${p.address}</div>
        <div class="card-specs">
          ${p.areaSqft ? `<span>${p.areaSqft} sqft</span>` : ""}
          ${p.bedrooms ? `<span>${p.bedrooms} bed</span>` : ""}
          ${p.floor ? `<span>${p.floor}</span>` : ""}
        </div>
      </div>
    </a>`;
}

function handleFavClick(id, btn) {
  const nowFav = Favorites.toggle(id);
  btn.innerHTML = nowFav ? "&#9829;" : "&#9825;";
}
window.handleFavClick = handleFavClick;

function readFilters() {
  const data = new FormData(form);
  const params = {};
  for (const [k, v] of data.entries()) if (v) params[k] = v;
  return params;
}

function applyFiltersToForm(params) {
  for (const [k, v] of Object.entries(params)) {
    const el = form.elements[k];
    if (el) el.value = v;
  }
}

async function runSearch(pushState = true) {
  const params = readFilters();
  if (pushState) {
    const qs = new URLSearchParams(params).toString();
    history.replaceState(null, "", qs ? `?${qs}` : "listings.html");
  }
  grid.innerHTML = `<div class="empty-state">Searching…</div>`;
  try {
    const rows = await Api.getProperties(params);
    countEl.textContent = `${rows.length} listing${rows.length === 1 ? "" : "s"} found`;
    grid.innerHTML = rows.length
      ? rows.map(cardTemplate).join("")
      : `<div class="empty-state"><div class="glyph">&#9670;</div>No listings match those filters. Try widening your search.</div>`;
    animateReveal("#results-grid .card");
  } catch (err) {
    grid.innerHTML = `<div class="empty-state">Couldn't load listings — ${err.message}</div>`;
  }
}

form.addEventListener("input", () => runSearch());
form.addEventListener("submit", (e) => e.preventDefault());

// initialize from URL query params (e.g. links from home page: ?type=apartment)
const initialParams = Object.fromEntries(new URLSearchParams(window.location.search));
applyFiltersToForm(initialParams);
runSearch(false);
