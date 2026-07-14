import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project.slug}`} className="card">
      <div className="card-img">
        {project.coverImage ? (
          <img src={project.coverImage} alt={project.name} loading="lazy" />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--ivory-dim)", color: "var(--ink-soft)", fontFamily: "var(--font-mono)", fontSize: ".8rem", letterSpacing: ".05em", textTransform: "uppercase" }}>
            Renderings coming soon
          </div>
        )}
        <span className="card-tag">{project.status === "available" ? "Live" : "Coming Soon"}</span>
      </div>
      <div className="card-body">
        <h3 className="card-title">{project.name}</h3>
        <div className="card-loc">{project.location}</div>
        <p style={{ fontSize: ".88rem", color: "var(--ink-soft)", margin: 0 }}>{project.tagline}</p>
      </div>
    </Link>
  );
}
