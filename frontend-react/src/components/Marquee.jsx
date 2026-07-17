// Marquee.jsx — an infinitely scrolling text banner. Pure CSS animation,
// duplicates the content once so the loop is seamless.

export default function Marquee({ items }) {
  return (
    <div className="marquee">
      <div className="marquee-track">
        {[...items, ...items].map((text, i) => (
          <span className="marquee-item" key={i}>
            <span className="marquee-dot">&#9670;</span> {text}
          </span>
        ))}
      </div>
    </div>
  );
}
