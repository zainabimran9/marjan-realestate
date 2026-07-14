// projects.js — metadata about each Merck Group of Builders development.
// This is separate from the unit-level listings in the backend (which are
// filtered by their `project` field) — this file describes the projects
// themselves for the company site's "Our Projects" sections.

import facadeCloseup from "../assets/marjan/facade-closeup.jpg";

export const projects = [
  {
    slug: "marjan-classic",
    name: "Marjan Classic Mall & Residency",
    tagline: "A mall and a home, under one address.",
    location: "Sector 16-A, Shah Latif Town, Karachi",
    status: "available", // available | coming-soon
    statusLabel: "Units Available",
    coverImage: facadeCloseup,
    summary:
      "A mixed-use development combining ground-floor retail mall space with residential apartment floors above, on Sector 16-A's main frontage in Shah Latif Town."
  },
  {
    slug: "coming-soon",
    name: "Our Next Development",
    tagline: "Details being finalized — check back soon.",
    location: "Karachi",
    status: "coming-soon",
    statusLabel: "Coming Soon",
    coverImage: null,
    summary:
      "We're currently finalizing the details of our next project. Register your interest and our team will reach out as soon as bookings open."
  }
];

export function getProject(slug) {
  return projects.find((p) => p.slug === slug);
}
