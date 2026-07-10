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
