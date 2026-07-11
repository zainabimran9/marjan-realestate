import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}`}>
      <div className="nav">
        <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
          Marjan Classic<span>Mall &amp; Residency</span>
        </Link>
        <nav>
          <ul className={`nav-links${menuOpen ? " open" : ""}`}>
            <li><NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink></li>
            <li><NavLink to="/listings" onClick={() => setMenuOpen(false)}>Listings</NavLink></li>
            <li><Link to="/#about" onClick={() => setMenuOpen(false)}>About the Project</Link></li>
            <li><NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact</NavLink></li>
          </ul>
        </nav>
        <div className="nav-actions">
          <Link to="/listings" className="btn btn-primary btn-sm">Browse Units</Link>
          <button className="nav-toggle" aria-label="Toggle menu" onClick={() => setMenuOpen((v) => !v)}>&#9776;</button>
        </div>
      </div>
    </header>
  );
}
