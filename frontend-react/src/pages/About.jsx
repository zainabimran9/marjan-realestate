import { Link } from "react-router-dom";
import lobbyCollage from "../assets/marjan/lobby-collage.jpg";
import { usePageTransition, useScrollReveal, useStaggerReveal } from "../lib/animations";

const services = [
  { title: "Land Development", desc: "Turning raw plots into buildable, properly zoned land with the infrastructure a project needs before construction starts." },
  { title: "Residential Construction", desc: "Apartments and residences built around real daily use — natural light, sensible layouts, and construction that holds up." },
  { title: "Commercial & Retail Space", desc: "Shops, offices and mall-format retail designed for footfall, visibility, and the practical needs of a business tenant." },
  { title: "Mixed-Use Developments", desc: "Projects like Marjan Classic that combine retail and residential in one address, each with its own dedicated access." },
  { title: "Project Management", desc: "Coordinating architecture, contractors, and timelines so a project moves from plan to handover without surprises." },
  { title: "Sales & Booking Support", desc: "A direct sales office that walks buyers and investors through units, pricing, and payment plans in person." }
];

export default function About() {
  const pageRef = usePageTransition();
  const introRef = useScrollReveal();
  const valuesRef = useScrollReveal();
  const servicesHeadRef = useScrollReveal();
  const servicesRef = useStaggerReveal(".form-card", []);

  return (
    <div ref={pageRef}>
      <section className="section-tight" style={{ paddingTop: 56 }}>
        <div className="wrap">
          <div className="eyebrow">About Us</div>
          <h1 style={{ fontSize: "2.4rem", marginBottom: 20, maxWidth: "18ch" }}>Certified builders and developers, based in Karachi</h1>

          <div className="detail-layout" ref={introRef}>
            <div>
              <p>Merck Group of Builders develops mixed-use commercial and residential projects across Karachi. Our work spans retail mall space, residential apartments, and the infrastructure that ties a development together — lift banks, dedicated lobbies, parking, and security — built to Class A construction standards.</p>
              <p>We work on a straightforward premise: a development should work as well for the people investing in it as for the people who'll live and work in it every day. That means real attention to layout, natural light, and the everyday logistics of a building — not just the finishes.</p>
              <p>Our current flagship project, <Link to="/projects/marjan-classic">Marjan Classic Mall &amp; Residency</Link>, reflects that approach: ground-floor retail with direct footfall, paired with residential floors that have their own separate, quieter entrance and dedicated amenities.</p>
            </div>
            <div className="sidebar-card" style={{ position: "static" }}>
              <h3>Get in Touch</h3>
              <p style={{ fontSize: ".9rem" }}>Karachi, Pakistan</p>
              <p className="mono" style={{ fontSize: ".85rem", color: "var(--coral)" }}>+92 300 0000000</p>
              <p className="mono" style={{ fontSize: ".85rem" }}>info@merckgroupofbuilders.example</p>
              <Link to="/contact" className="btn btn-primary btn-sm" style={{ marginTop: 16, width: "100%", justifyContent: "center" }}>Contact Us</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="wrap">
          <div className="section-head" ref={servicesHeadRef}>
            <div className="eyebrow">What We Offer</div>
            <h2>Our services</h2>
            <p>The full scope of what Merck Group of Builders takes on, from raw land to a finished, occupied building.</p>
          </div>
          <div className="grid" ref={servicesRef} style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            {services.map((s, i) => (
              <div key={i} className="form-card">
                <div className="mono" style={{ color: "var(--brass)", fontSize: ".78rem", marginBottom: 8 }}>0{i + 1}</div>
                <h3 style={{ fontSize: "1.1rem", marginBottom: 8 }}>{s.title}</h3>
                <p style={{ color: "var(--ink-soft)", fontSize: ".88rem", margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ background: "#fff", borderTop: "1px solid var(--line)" }}>
        <div className="wrap">
          <img src={lobbyCollage} alt="Interior finishes across a Merck Group of Builders development" style={{ width: "100%", borderRadius: 3, marginBottom: 40 }} loading="lazy" />

          <div className="grid" ref={valuesRef} style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            <div>
              <h3 style={{ fontSize: "1.1rem" }}>Delivery Discipline</h3>
              <p style={{ color: "var(--ink-soft)", fontSize: ".9rem" }}>We plan around realistic timelines and communicate delays honestly rather than overpromising at launch.</p>
            </div>
            <div>
              <h3 style={{ fontSize: "1.1rem" }}>Built for Daily Use</h3>
              <p style={{ color: "var(--ink-soft)", fontSize: ".9rem" }}>Layouts are designed around how residents and shop owners actually move through a building, not just how it renders.</p>
            </div>
            <div>
              <h3 style={{ fontSize: "1.1rem" }}>Direct Communication</h3>
              <p style={{ color: "var(--ink-soft)", fontSize: ".9rem" }}>Our sales office deals directly with buyers and investors — current pricing and availability are always a call away.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
