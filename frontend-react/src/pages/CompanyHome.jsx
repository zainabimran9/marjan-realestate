import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { projects } from "../lib/projects";
import ProjectCard from "../components/ProjectCard";
import elevationDay from "../assets/marjan/elevation-day.jpg";
import { useHeroTimeline, useHeroParallax, useScrollReveal, useStaggerReveal, usePageTransition } from "../lib/animations";

const slides = [
  {
    eyebrow: "Builders & Developers · Karachi",
    heading: "Building for how Karachi actually lives.",
    sub: "Merck Group of Builders designs and delivers mixed-use developments — residences, retail, and commercial space — built for the neighborhoods they sit in."
  },
  {
    eyebrow: "Now Booking · Marjan Classic Mall & Residency",
    heading: "A mall and a home, under one address.",
    sub: "Apartments, shops and offices with live availability — check current pricing before you visit in person."
  },
  {
    eyebrow: "Class A Construction Standards",
    heading: "Built around how a space actually gets used.",
    sub: "Every project starts with real attention to layout, natural light, and daily logistics — not just the finishes."
  }
];

export default function CompanyHome() {
  const pageRef = usePageTransition();
  const eyebrowRef = useRef(null);
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const actionsRef = useRef(null);
  useHeroTimeline({ eyebrow: eyebrowRef, heading: headingRef, sub: subRef, actions: actionsRef });
  const heroBgRef = useHeroParallax();
  const sectionHeadRef = useScrollReveal();
  const aboutRef = useScrollReveal();
  const ctaRef = useScrollReveal();
  const gridRef = useStaggerReveal(".card", []);

  const [slideIndex, setSlideIndex] = useState(0);
  const isFirstRender = useRef(true);

  // Auto-advance every 5.5s, pause-free (simple loop).
  useEffect(() => {
    const id = setInterval(() => {
      setSlideIndex((i) => (i + 1) % slides.length);
    }, 5500);
    return () => clearInterval(id);
  }, []);

  // Cross-fade the text block whenever the slide changes (skip on first mount,
  // since useHeroTimeline already handles the initial entrance).
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    const els = [eyebrowRef.current, headingRef.current, subRef.current].filter(Boolean);
    gsap.fromTo(els, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power2.out" });
  }, [slideIndex]);

  const goToSlide = (i) => {
    if (i === slideIndex) return;
    const els = [eyebrowRef.current, headingRef.current, subRef.current].filter(Boolean);
    gsap.to(els, { opacity: 0, y: -6, duration: 0.2, onComplete: () => setSlideIndex(i) });
  };

  const slide = slides[slideIndex];

  return (
    <div ref={pageRef}>
      <section
        className="hero"
        ref={heroBgRef}
        style={{ backgroundImage: `linear-gradient(180deg, rgba(15,20,17,0.55) 0%, rgba(15,25,20,0.6) 55%, rgba(10,16,13,0.9) 100%), url(${elevationDay})` }}
      >
        <div className="hero-inner">
          <div className="hero-eyebrow" ref={eyebrowRef}>{slide.eyebrow}</div>
          <h1 ref={headingRef}>{slide.heading}</h1>
          <p className="hero-sub" ref={subRef}>{slide.sub}</p>
          <div className="hero-actions" ref={actionsRef}>
            <Link to="/projects" className="btn btn-primary">View Our Projects</Link>
            <Link to="/contact" className="btn btn-ghost-light">Get in Touch</Link>
          </div>
          <div className="hero-slide-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`hero-dot${i === slideIndex ? " active" : ""}`}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goToSlide(i)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="projects">
        <div className="wrap">
          <div className="section-head" ref={sectionHeadRef}>
            <div className="eyebrow">Our Projects</div>
            <h2>What we're building</h2>
            <p>From live, ready-to-book developments to what's next.</p>
          </div>
          <div className="grid" ref={gridRef}>
            {projects.map((p) => <ProjectCard project={p} key={p.slug} />)}
          </div>
        </div>
      </section>

      <section className="section section-tight" style={{ background: "#fff", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="detail-layout" ref={aboutRef}>
            <div>
              <div className="eyebrow">About Us</div>
              <h2>Certified builders, judged by what we deliver</h2>
              <p>Merck Group of Builders develops mixed-use commercial and residential projects across Karachi, with a focus on locations that work for both investors and the families and businesses who'll actually use the space day to day.</p>
              <p>Every project is designed around Class A construction standards, modern amenities, and — most importantly — a delivery timeline we hold ourselves to.</p>
              <Link to="/about" className="btn btn-outline btn-sm">More About Us &rarr;</Link>
            </div>
            <div className="sidebar-card" style={{ position: "static" }}>
              <h3>Head Office</h3>
              <p style={{ fontSize: ".9rem" }}>Karachi, Pakistan</p>
              <p className="mono" style={{ fontSize: ".85rem", color: "var(--coral)" }}>+92 300 0000000</p>
              <p className="mono" style={{ fontSize: ".85rem" }}>info@merckgroupofbuilders.example</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap" ref={ctaRef}>
          <h2>Interested in one of our projects?</h2>
          <p>Reach out and our team will walk you through current availability and pricing.</p>
          <Link to="/contact" className="btn" style={{ background: "var(--ink)", color: "var(--ivory)" }}>Contact Us</Link>
        </div>
      </section>
    </div>
  );
}
