// admin.js — auth guard + listings CRUD + inquiries management

if (!localStorage.getItem("marjan_admin_token")) {
  window.location.href = "login.html";
}

document.getElementById("logout-link").addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("marjan_admin_token");
  window.location.href = "login.html";
});

// ---------- Tabs ----------
document.querySelectorAll(".tab-link[data-tab]").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelectorAll(".tab-link[data-tab]").forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
    document.getElementById("tab-listings").style.display = link.dataset.tab === "listings" ? "block" : "none";
    document.getElementById("tab-inquiries").style.display = link.dataset.tab === "inquiries" ? "block" : "none";
  });
});

// ---------- Listings ----------
const listingsTbody = document.getElementById("listings-tbody");
const overlay = document.getElementById("listing-form-overlay");
const listingForm = document.getElementById("listing-form");

function statusBadgeColor(s) {
  return { available: "#3a6b30", reserved: "var(--brass)", sold: "var(--ink-soft)" }[s] || "var(--ink-soft)";
}

async function loadListings() {
  listingsTbody.innerHTML = `<tr><td colspan="7">Loading…</td></tr>`;
  try {
    const rows = await Api.getProperties({});
    if (!rows.length) {
      listingsTbody.innerHTML = `<tr><td colspan="7">No listings yet. Click "New Listing" to add one.</td></tr>`;
      return;
    }
    listingsTbody.innerHTML = rows.map((p) => `
      <tr>
        <td>${p.title}</td>
        <td>${p.project}</td>
        <td>${p.type}</td>
        <td><span style="color:${statusBadgeColor(p.status)}; font-family:var(--font-mono); font-size:.78rem; text-transform:uppercase;">${p.status}</span></td>
        <td class="mono">${p.priceLabel || formatPrice(p.price)}</td>
        <td>${p.city}</td>
        <td style="white-space:nowrap;">
          <button class="btn btn-outline btn-sm" onclick="editListing(${p.id})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteListing(${p.id})">Delete</button>
        </td>
      </tr>
    `).join("");
  } catch (err) {
    listingsTbody.innerHTML = `<tr><td colspan="7">Couldn't load listings — ${err.message}</td></tr>`;
  }
}

let currentListings = [];
async function refreshCache() {
  currentListings = await Api.getProperties({});
}

function openForm(property = null) {
  listingForm.reset();
  document.getElementById("form-title").textContent = property ? "Edit Listing" : "New Listing";
  document.getElementById("f-id").value = property?.id || "";
  document.getElementById("f-title").value = property?.title || "";
  document.getElementById("f-project").value = property?.project || "Independent Listing";
  document.getElementById("f-type").value = property?.type || "apartment";
  document.getElementById("f-status").value = property?.status || "available";
  document.getElementById("f-price").value = property?.price || "";
  document.getElementById("f-priceLabel").value = property?.priceLabel || "";
  document.getElementById("f-area").value = property?.areaSqft || "";
  document.getElementById("f-floor").value = property?.floor || "";
  document.getElementById("f-bed").value = property?.bedrooms || "";
  document.getElementById("f-bath").value = property?.bathrooms || "";
  document.getElementById("f-city").value = property?.city || "Karachi";
  document.getElementById("f-featured").value = property?.featured ? "true" : "false";
  document.getElementById("f-address").value = property?.address || "";
  document.getElementById("f-images").value = (property?.images || []).join("\n");
  document.getElementById("f-amenities").value = (property?.amenities || []).join(", ");
  document.getElementById("f-description").value = property?.description || "";
  overlay.style.display = "flex";
}

async function editListing(id) {
  await refreshCache();
  const p = currentListings.find((x) => x.id === id);
  if (p) openForm(p);
}
window.editListing = editListing;

async function deleteListing(id) {
  if (!confirm("Delete this listing? This can't be undone.")) return;
  try {
    await Api.deleteProperty(id);
    toast("Listing deleted");
    loadListings();
  } catch (err) {
    toast(`Couldn't delete — ${err.message}`);
  }
}
window.deleteListing = deleteListing;

document.getElementById("new-listing-btn").addEventListener("click", () => openForm(null));
document.getElementById("cancel-form-btn").addEventListener("click", () => { overlay.style.display = "none"; });

listingForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("f-id").value;
  const body = {
    title: document.getElementById("f-title").value,
    project: document.getElementById("f-project").value,
    type: document.getElementById("f-type").value,
    status: document.getElementById("f-status").value,
    price: Number(document.getElementById("f-price").value),
    priceLabel: document.getElementById("f-priceLabel").value,
    areaSqft: document.getElementById("f-area").value ? Number(document.getElementById("f-area").value) : null,
    floor: document.getElementById("f-floor").value,
    bedrooms: document.getElementById("f-bed").value ? Number(document.getElementById("f-bed").value) : null,
    bathrooms: document.getElementById("f-bath").value ? Number(document.getElementById("f-bath").value) : null,
    city: document.getElementById("f-city").value,
    featured: document.getElementById("f-featured").value === "true",
    address: document.getElementById("f-address").value,
    mapQuery: document.getElementById("f-address").value,
    images: document.getElementById("f-images").value.split("\n").map((s) => s.trim()).filter(Boolean),
    amenities: document.getElementById("f-amenities").value.split(",").map((s) => s.trim()).filter(Boolean),
    description: document.getElementById("f-description").value
  };

  const btn = listingForm.querySelector("button[type=submit]");
  btn.disabled = true; btn.textContent = "Saving…";
  try {
    if (id) await Api.updateProperty(id, body);
    else await Api.createProperty(body);
    toast("Listing saved");
    overlay.style.display = "none";
    loadListings();
  } catch (err) {
    toast(`Couldn't save — ${err.message}`);
  } finally {
    btn.disabled = false; btn.textContent = "Save Listing";
  }
});

// ---------- Inquiries ----------
const inquiriesTbody = document.getElementById("inquiries-tbody");

async function loadInquiries() {
  inquiriesTbody.innerHTML = `<tr><td colspan="7">Loading…</td></tr>`;
  try {
    const rows = await Api.getInquiries();
    document.getElementById("new-count-badge").textContent =
      rows.filter((r) => r.status === "new").length ? `(${rows.filter((r) => r.status === "new").length})` : "";

    if (!rows.length) {
      inquiriesTbody.innerHTML = `<tr><td colspan="7">No inquiries yet.</td></tr>`;
      return;
    }
    inquiriesTbody.innerHTML = rows.map((i) => `
      <tr>
        <td>${i.name}</td>
        <td>${i.phone}</td>
        <td>${i.email || "—"}</td>
        <td>${i.propertyTitle || "General inquiry"}</td>
        <td style="max-width:220px;">${i.message || "—"}</td>
        <td class="mono" style="font-size:.78rem;">${new Date(i.createdAt).toLocaleString()}</td>
        <td>
          <select onchange="updateInquiryStatus(${i.id}, this.value)" style="font-size:.78rem; padding:4px 6px;">
            <option value="new" ${i.status === "new" ? "selected" : ""}>New</option>
            <option value="contacted" ${i.status === "contacted" ? "selected" : ""}>Contacted</option>
            <option value="closed" ${i.status === "closed" ? "selected" : ""}>Closed</option>
          </select>
        </td>
      </tr>
    `).join("");
  } catch (err) {
    inquiriesTbody.innerHTML = `<tr><td colspan="7">Couldn't load inquiries — ${err.message}</td></tr>`;
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
window.updateInquiryStatus = updateInquiryStatus;

loadListings();
loadInquiries();
