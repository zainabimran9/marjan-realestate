import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Marquee from "./components/Marquee";
import WhatsAppButton from "./components/WhatsAppButton";
import EmailButton from "./components/EmailButton";
import Toast from "./components/Toast";
import { LightboxProvider } from "./components/Lightbox";
import { SiteVisitProvider } from "./components/SiteVisitModal";
import { useCardTilt } from "./lib/animations";
import CompanyHome from "./pages/CompanyHome";
import About from "./pages/About";
import Projects from "./pages/Projects";
import MarjanProject from "./pages/MarjanProject";
import ComingSoonProject from "./pages/ComingSoonProject";
import Listings from "./pages/Listings";
import PropertyDetail from "./pages/PropertyDetail";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import "./style.css";

function ScrollManager() {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) { el.scrollIntoView({ behavior: "smooth" }); return; }
    }
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

const marqueeItems = [
  "Live Bookings Open — Marjan Classic Mall & Residency",
  "Apartments, Shops & Offices Available",
  "Sector 16-A, Shah Latif Town, Karachi",
  "Flexible Installment Plans Available",
  "Book a Site Visit Today"
];

function SiteLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Marquee items={marqueeItems} />
      <Footer />
      <EmailButton />
      <WhatsAppButton />
    </>
  );
}

export default function App() {
  useCardTilt();
  return (
    <BrowserRouter basename="/marjan-realestate">
      <LightboxProvider>
      <SiteVisitProvider>
        <ScrollManager />
        <Routes>
          <Route path="/" element={<SiteLayout><CompanyHome /></SiteLayout>} />
          <Route path="/about" element={<SiteLayout><About /></SiteLayout>} />
          <Route path="/projects" element={<SiteLayout><Projects /></SiteLayout>} />
          <Route path="/projects/marjan-classic" element={<SiteLayout><MarjanProject /></SiteLayout>} />
          <Route path="/projects/coming-soon" element={<SiteLayout><ComingSoonProject /></SiteLayout>} />
          <Route path="/listings" element={<SiteLayout><Listings /></SiteLayout>} />
          <Route path="/property/:id" element={<SiteLayout><PropertyDetail /></SiteLayout>} />
          <Route path="/contact" element={<SiteLayout><Contact /></SiteLayout>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
        <Toast />
      </SiteVisitProvider>
      </LightboxProvider>
    </BrowserRouter>
  );
}
