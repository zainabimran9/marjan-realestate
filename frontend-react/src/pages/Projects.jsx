import { projects } from "../lib/projects";
import ProjectCard from "../components/ProjectCard";
import { usePageTransition, useStaggerReveal } from "../lib/animations";

export default function Projects() {
  const pageRef = usePageTransition();
  const gridRef = useStaggerReveal(".card", []);

  return (
    <div ref={pageRef}>
      <section className="section-tight" style={{ paddingTop: 56 }}>
        <div className="wrap">
          <div className="eyebrow">Our Projects</div>
          <h1 style={{ fontSize: "2.4rem", marginBottom: 12 }}>Current &amp; upcoming developments</h1>
          <p style={{ color: "var(--ink-soft)", maxWidth: "60ch", marginBottom: 40 }}>Every Merck Group of Builders project, from what's live and bookable today to what's next.</p>

          <div className="grid" ref={gridRef}>
            {projects.map((p) => <ProjectCard project={p} key={p.slug} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
