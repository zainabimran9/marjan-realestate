// StarRating.jsx — display mode (readOnly, shows a rating value) or
// interactive mode (value + onChange, used in the review submission form).

export default function StarRating({ value = 0, onChange, readOnly = false, size = 20 }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div style={{ display: "inline-flex", gap: 2 }} role={readOnly ? "img" : "radiogroup"} aria-label={`${value} out of 5 stars`}>
      {stars.map((n) => (
        <span
          key={n}
          onClick={() => !readOnly && onChange?.(n)}
          style={{
            cursor: readOnly ? "default" : "pointer",
            fontSize: size,
            lineHeight: 1,
            color: n <= value ? "var(--brass)" : "var(--line)",
            transition: "color 0.15s ease"
          }}
        >
          &#9733;
        </span>
      ))}
    </div>
  );
}
