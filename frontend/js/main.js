// main.js — homepage: directory board + featured grid

function cardTemplate(p) {
  const img = p.images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80";
  const isFav = Favorites.has(p.id);
  return `
    <a class="card" href="property.html?id=${p.id}">
      <div class="card-img">
        <img src="${img}" alt="${p.title}" loading="lazy" />
        <span class="card-tag">${p.type}</span>
        <button class="card-fav" data-fav-id="${p.id}" aria-label="Save listing" onclick="event.preventDefault(); handleFavClick(${p.id}, this)">${isFav ? "&#9829;" : "&#9825;"}</button>
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
  toast(nowFav ? "Saved to favorites" : "Removed from favorites");
}
window.handleFavClick = handleFavClick;

function statusLabel(s) {
  return { available: "Available", reserved: "Reserved", sold: "Sold" }[s] || s;
}

async function loadDirectory() {
  const board = document.getElementById("directory-board");
  try {
    const all = await Api.getProperties({ project: "" });
    const marjanUnits = all.filter((p) => p.project === "Marjan Classic Mall & Residency")
      .sort((a, b) => (a.floor || "").localeCompare(b.floor || ""));

    document.getElementById("stat-available").textContent =
      all.filter((p) => p.status === "available").length;

    if (!marjanUnits.length) {
      board.innerHTML = `<div class="board-row"><span class="mono">No units listed yet.</span></div>`;
      return;
    }

    board.innerHTML = marjanUnits.map((p) => `
      <a class="board-row" href="property.html?id=${p.id}">
        <span class="board-floor">${p.floor || "—"}</span>
        <span class="board-unit">${p.title.replace("Marjan Classic Mall & Residency — ", "")}<small>${p.type} &middot; ${p.areaSqft || "—"} sqft</small></span>
        <span class="board-status ${p.status}">${statusLabel(p.status)}</span>
        <span class="board-price">${p.priceLabel || formatPrice(p.price)}</span>
        <span class="board-arrow">&rarr;</span>
      </a>
    `).join("");
    animateBoardRows();
  } catch (err) {
    board.innerHTML = `<div class="board-row"><span class="mono">Couldn't load the directory — ${err.message}</span></div>`;
  }
}

async function loadFeatured() {
  const grid = document.getElementById("featured-grid");
  try {
    const rows = await Api.getProperties({ featured: "true", status: "available" });
    if (!rows.length) {
      grid.innerHTML = `<div class="empty-state"><div class="glyph">&#9670;</div>No featured listings right now.</div>`;
      return;
    }
    grid.innerHTML = rows.slice(0, 6).map(cardTemplate).join("");
    animateReveal("#featured-grid .card");
  } catch (err) {
    grid.innerHTML = `<div class="empty-state">Couldn't load listings — ${err.message}</div>`;
  }
}

initHeroAnimation();
loadDirectory();
loadFeatured();
