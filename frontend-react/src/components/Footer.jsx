import { Link } from "react-router-dom";
import merckLogo from "../assets/merck-logo.png";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <img
              src={merckLogo}
              alt="Merck Group of Builders"
              style={{ height: 44, width: "auto", marginBottom: 14, borderRadius: 3, background: "#fff", padding: "4px 8px" }}
            />
            <p style={{ maxWidth: "36ch", fontSize: ".9rem" }}>
              Sector 16-A, Shah Latif Town, Karachi. Apartments, shops and offices under one roof.
            </p>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><Link to="/listings">All Listings</Link></li>
              <li><Link to="/listings?type=apartment">Apartments</Link></li>
              <li><Link to="/listings?type=shop">Shops</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li>+92 300 0000000</li>
              <li>sales@merckgroupofbuilders.example</li>
              <li>Sector 16-A, Shah Latif Town, Karachi</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; 2026 Merck Group of Builders. All rights reserved.</span>
          <Link to="/admin/login" style={{ opacity: 0.6 }}>Admin</Link>
        </div>
      </div>
    </footer>
  );
}
