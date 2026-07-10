// animations.js — GSAP-powered motion, layered on top of the static site.
// Every function checks that GSAP actually loaded before doing anything,
// so if the CDN is ever blocked or slow, the site still works — it just
// won't animate. Nothing here touches data, forms, or the backend.

function initHeroAnimation() {
  if (!window.gsap) return;
  gsap.timeline()
    .from(".hero-eyebrow", { opacity: 0, y: 16, duration: 0.6, ease: "power2.out" })
    .from(".hero h1", { opacity: 0, y: 26, duration: 0.8, ease: "power2.out" }, "-=0.35")
    .from(".hero-sub", { opacity: 0, y: 16, duration: 0.6, ease: "power2.out" }, "-=0.45")
    .from(".hero-actions .btn", { opacity: 0, y: 12, duration: 0.5, stagger: 0.1, ease: "power2.out" }, "-=0.3")
    .from(".hero-stat", { opacity: 0, y: 16, duration: 0.5, stagger: 0.08, ease: "power2.out" }, "-=0.2");
}

// Fade + rise reveal for a set of elements already in the DOM (e.g. after
// a fetch call injects cards). Safe to call multiple times.
function animateReveal(selector, opts = {}) {
  if (!window.gsap) return;
  const items = document.querySelectorAll(selector);
  if (!items.length) return;
  gsap.fromTo(
    items,
    { opacity: 0, y: 22 },
    { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: "power2.out", ...opts }
  );
}

function animateBoardRows() {
  if (!window.gsap) return;
  const rows = document.querySelectorAll(".board-row");
  if (!rows.length) return;
  gsap.fromTo(
    rows,
    { opacity: 0, x: -18 },
    { opacity: 1, x: 0, duration: 0.5, stagger: 0.06, ease: "power2.out", delay: 0.15 }
  );
}

// Scroll-triggered reveal for static sections (about, CTA band, section
// headers) that are already in the HTML on page load.
function initScrollReveals() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll("[data-reveal]").forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 28,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 85%" }
    });
  });
}

document.addEventListener("DOMContentLoaded", initScrollReveals);

// Count up a number element from 0 to target. Falls back to a plain
// text set if GSAP hasn't loaded for any reason.
function animateCounter(el, target, opts = {}) {
  if (!el) return;
  if (!window.gsap) { el.textContent = target; return; }
  const obj = { val: 0 };
  gsap.to(obj, {
    val: target,
    duration: 1.3,
    ease: "power2.out",
    onUpdate: () => { el.textContent = Math.round(obj.val); },
    ...opts
  });
}

// Floating WhatsApp contact button — shown on every page. Update the
// phone number once the client provides their real WhatsApp number.
function injectWhatsAppButton(phoneDigitsOnly = "923000000000", message = "Hi, I'm interested in Marjan Classic Mall & Residency") {
  if (document.querySelector(".wa-float")) return;
  const a = document.createElement("a");
  a.className = "wa-float";
  a.href = `https://wa.me/${phoneDigitsOnly}?text=${encodeURIComponent(message)}`;
  a.target = "_blank";
  a.rel = "noopener";
  a.setAttribute("aria-label", "Chat on WhatsApp");
  a.innerHTML = `<svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor"><path d="M16.001 3C9.11 3 3.5 8.61 3.5 15.5c0 2.42.68 4.68 1.87 6.61L3 29l7.1-2.32a12.44 12.44 0 0 0 5.9 1.5h.01c6.89 0 12.5-5.61 12.5-12.5S22.89 3 16 3zm0 22.7h-.01a10.2 10.2 0 0 1-5.2-1.43l-.37-.22-3.86 1.26 1.27-3.76-.24-.39a10.18 10.18 0 0 1-1.56-5.46c0-5.64 4.6-10.24 10.25-10.24 2.74 0 5.31 1.07 7.25 3.01a10.18 10.18 0 0 1 3 7.24c0 5.64-4.6 10.24-10.25 10.24zm5.61-7.67c-.31-.15-1.82-.9-2.1-1s-.49-.15-.69.15-.79 1-.97 1.2-.36.23-.67.08a8.35 8.35 0 0 1-2.45-1.51 9.2 9.2 0 0 1-1.7-2.11c-.18-.31 0-.47.14-.62.14-.14.31-.36.46-.54.15-.18.2-.31.31-.51.1-.2.05-.39-.03-.54s-.69-1.66-.94-2.27c-.25-.6-.5-.51-.69-.52h-.59a1.14 1.14 0 0 0-.82.39 3.46 3.46 0 0 0-1.08 2.58c0 1.52 1.11 2.99 1.26 3.2.15.2 2.19 3.34 5.3 4.69.74.32 1.32.51 1.77.65.74.24 1.42.2 1.96.12.6-.09 1.82-.74 2.08-1.46.26-.72.26-1.33.18-1.46-.08-.13-.28-.2-.59-.35z"/></svg>`;
  document.body.appendChild(a);
}
document.addEventListener("DOMContentLoaded", () => injectWhatsAppButton());

// Click-to-enlarge lightbox for property gallery images.
function initLightbox(imgSelector) {
  const imgs = document.querySelectorAll(imgSelector);
  if (!imgs.length) return;

  let overlay = document.querySelector(".lightbox-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    overlay.innerHTML = `<button class="lightbox-close" aria-label="Close">&times;</button><img class="lightbox-img" src="" alt="" />`;
    document.body.appendChild(overlay);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay || e.target.classList.contains("lightbox-close")) {
        overlay.classList.remove("open");
      }
    });
  }

  imgs.forEach((img) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => {
      overlay.querySelector(".lightbox-img").src = img.src;
      overlay.classList.add("open");
    });
  });
}
