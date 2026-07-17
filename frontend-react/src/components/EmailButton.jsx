const EMAIL = "sales@marjanclassic.example"; // update once the client provides their real inquiries inbox
const SUBJECT = "Inquiry — Merck Group of Builders";
const BODY = "Hi, I'd like more information about your projects.";

export default function EmailButton() {
  return (
    <a
      className="email-float"
      href={`mailto:${EMAIL}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(BODY)}`}
      aria-label="Email us"
    >
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 6-10 7L2 6" />
      </svg>
    </a>
  );
}
