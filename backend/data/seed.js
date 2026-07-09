// Seeds data/properties.json and data/inquiries.json with starter content
// so the site isn't empty on first run. Safe to re-run — it overwrites.

const { writeTable } = require("../db");

const now = () => new Date().toISOString();

const properties = [
  {
    id: 1,
    project: "Marjan Classic Mall & Residency",
    title: "Marjan Classic Mall & Residency — 2 Bed Apartment",
    type: "apartment",
    status: "available",
    price: 8500000,
    priceLabel: "PKR 85 Lac",
    areaSqft: 950,
    bedrooms: 2,
    bathrooms: 2,
    floor: "4th Floor",
    city: "Karachi",
    address: "Sector 16-A, Shah Latif Town, Karachi",
    mapQuery: "Marjan Classic Mall & Residency, Sector 16-A, Shah Latif Town, Karachi",
    description:
      "A bright 2-bed, 2-bath apartment in Marjan Classic Mall & Residency, a mixed-use tower combining ground-floor retail with residential floors above in Shah Latif Town. Close to Sector 16-A's main artery, with a dedicated residential lobby separate from the mall entrance.",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80"
    ],
    amenities: ["Lift access", "24/7 security", "Reserved parking", "Backup generator", "Mosque on premises"],
    featured: true,
    createdAt: now()
  },
  {
    id: 2,
    project: "Marjan Classic Mall & Residency",
    title: "Marjan Classic Mall & Residency — 3 Bed Apartment",
    type: "apartment",
    status: "available",
    price: 12500000,
    priceLabel: "PKR 1.25 Crore",
    areaSqft: 1350,
    bedrooms: 3,
    bathrooms: 3,
    floor: "6th Floor",
    city: "Karachi",
    address: "Sector 16-A, Shah Latif Town, Karachi",
    mapQuery: "Marjan Classic Mall & Residency, Sector 16-A, Shah Latif Town, Karachi",
    description:
      "Corner-unit 3-bed apartment with cross-ventilation on two sides, a separate drawing and dining layout, and a covered balcony overlooking Sector 16-A.",
    images: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80"
    ],
    amenities: ["Lift access", "24/7 security", "Reserved parking", "Backup generator", "Mosque on premises"],
    featured: true,
    createdAt: now()
  },
  {
    id: 3,
    project: "Marjan Classic Mall & Residency",
    title: "Marjan Classic Mall & Residency — Ground Floor Shop",
    type: "shop",
    status: "available",
    price: 6500000,
    priceLabel: "PKR 65 Lac",
    areaSqft: 220,
    bedrooms: null,
    bathrooms: 1,
    floor: "Ground Floor",
    city: "Karachi",
    address: "Sector 16-A, Shah Latif Town, Karachi",
    mapQuery: "Marjan Classic Mall & Residency, Sector 16-A, Shah Latif Town, Karachi",
    description:
      "Ground-floor shop facing the main mall corridor — high foot traffic from both mall visitors and residents. Shell condition, ready for fit-out.",
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
      "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200&q=80"
    ],
    amenities: ["Main corridor frontage", "Shared washrooms", "24/7 security", "Loading access"],
    featured: true,
    createdAt: now()
  },
  {
    id: 4,
    project: "Marjan Classic Mall & Residency",
    title: "Marjan Classic Mall & Residency — First Floor Office / Shop",
    type: "office",
    status: "reserved",
    price: 4800000,
    priceLabel: "PKR 48 Lac",
    areaSqft: 180,
    bedrooms: null,
    bathrooms: 1,
    floor: "1st Floor",
    city: "Karachi",
    address: "Sector 16-A, Shah Latif Town, Karachi",
    mapQuery: "Marjan Classic Mall & Residency, Sector 16-A, Shah Latif Town, Karachi",
    description:
      "Compact first-floor unit suited to a clinic, tuition centre, or small office — directly above the mall's main atrium.",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80"
    ],
    amenities: ["Lift access", "Shared washrooms", "24/7 security"],
    featured: false,
    createdAt: now()
  },
  {
    id: 5,
    project: "Independent Listing",
    title: "5 Marla Residential Plot — DHA Phase 8",
    type: "plot",
    status: "available",
    price: 21000000,
    priceLabel: "PKR 2.1 Crore",
    areaSqft: 1250,
    bedrooms: null,
    bathrooms: null,
    floor: null,
    city: "Karachi",
    address: "DHA Phase 8, Karachi",
    mapQuery: "DHA Phase 8, Karachi",
    description:
      "Corner plot on a 40ft street in a developed block of DHA Phase 8, gas and electricity connections available on the street.",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80"
    ],
    amenities: ["Corner plot", "40ft street", "Gas & electricity on street"],
    featured: false,
    createdAt: now()
  },
  {
    id: 6,
    project: "Independent Listing",
    title: "4 Bed Bungalow — Gulshan-e-Iqbal",
    type: "house",
    status: "sold",
    price: 45000000,
    priceLabel: "PKR 4.5 Crore",
    areaSqft: 2400,
    bedrooms: 4,
    bathrooms: 4,
    floor: null,
    city: "Karachi",
    address: "Gulshan-e-Iqbal, Karachi",
    mapQuery: "Gulshan-e-Iqbal, Karachi",
    description:
      "Renovated double-storey bungalow with a front lawn, servant quarter, and covered parking for two cars. Sold — kept here as a past-sales reference.",
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80"
    ],
    amenities: ["Front lawn", "Servant quarter", "Covered parking"],
    featured: false,
    createdAt: now()
  }
];

writeTable("properties", properties);
writeTable("inquiries", []);

console.log(`Seeded ${properties.length} properties.`);
