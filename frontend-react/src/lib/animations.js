import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Fades + rises an element in on mount. Attach the returned ref to the DOM node.
export function useEnterAnimation(deps = [], vars = {}) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", ...vars });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

// Staggered reveal for a list of child elements (e.g. cards) whenever
// the dependency (like fetched data) changes.
export function useStaggerReveal(selector, deps = [], vars = {}) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const items = ref.current.querySelectorAll(selector);
    if (!items.length) return;
    gsap.fromTo(items, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.07, ease: "power2.out", ...vars });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

// Count up a number from 0 to target whenever target changes (e.g. once
// data loads from the API).
export function useCountUp(target, deps = []) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || target == null) return;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 1.2,
      ease: "power2.out",
      onUpdate: () => { if (ref.current) ref.current.textContent = Math.round(obj.val); }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, ...deps]);
  return ref;
}

// Hero timeline: eyebrow -> heading -> subtext -> buttons -> stats.
// Takes explicit refs to each element rather than class selectors —
// avoids any ambiguity from compound selectors combined with scoped
// gsap.context() lookups.
export function useHeroTimeline(refs) {
  useEffect(() => {
    const { eyebrow, heading, sub, actions } = refs;
    if (!eyebrow.current || !heading.current || !sub.current) return;
    const btns = actions.current ? actions.current.querySelectorAll(".btn") : [];
    const tl = gsap.timeline()
      .from(eyebrow.current, { opacity: 0, y: 16, duration: 0.6, ease: "power2.out" })
      .from(heading.current, { opacity: 0, y: 26, duration: 0.8, ease: "power2.out" }, "-=0.35")
      .from(sub.current, { opacity: 0, y: 16, duration: 0.6, ease: "power2.out" }, "-=0.45");
    if (btns.length) tl.from(btns, { opacity: 0, y: 12, duration: 0.5, stagger: 0.1, ease: "power2.out" }, "-=0.3");
    return () => tl.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

// Background parallax drift on scroll.
export function useHeroParallax() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const anim = gsap.to(ref.current, {
      backgroundPositionY: "38%",
      ease: "none",
      scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true }
    });
    return () => anim.scrollTrigger?.kill();
  }, []);
  return ref;
}

// Scroll-triggered reveal for a static section further down the page.
export function useScrollReveal(vars = {}) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const anim = gsap.from(ref.current, {
      opacity: 0, y: 28, duration: 0.7, ease: "power2.out",
      scrollTrigger: { trigger: ref.current, start: "top 85%" },
      ...vars
    });
    return () => anim.scrollTrigger?.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ref;
}

// 3D tilt-toward-cursor on hover, delegated so it works on dynamically
// rendered card grids without re-binding per card.
export function useCardTilt() {
  useEffect(() => {
    const onMove = (e) => {
      const card = e.target.closest?.(".card");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const x = e.clientX - rect.left - cx;
      const y = e.clientY - rect.top - cy;
      card.style.transform = `perspective(800px) rotateX(${(-y / cy) * 5}deg) rotateY(${(x / cx) * 5}deg) translateY(-6px)`;
    };
    const onLeave = (e) => {
      const card = e.target.closest?.(".card");
      if (card) card.style.transform = "";
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave, true);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave, true);
    };
  }, []);
}

// Board rows sliding in from the left, staggered.
export function useBoardReveal(deps = []) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const rows = ref.current.querySelectorAll(".board-row");
    if (!rows.length) return;
    gsap.fromTo(rows, { opacity: 0, x: -18 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.06, ease: "power2.out", delay: 0.15 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

// Page-level fade-in on route change, used once per page component.
export function usePageTransition() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: "power1.out" });
  }, []);
  return ref;
}
