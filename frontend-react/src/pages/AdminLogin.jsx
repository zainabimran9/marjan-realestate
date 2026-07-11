import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Api } from "../lib/api";
import { usePageTransition } from "../lib/animations";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const pageRef = usePageTransition();

  useEffect(() => {
    if (localStorage.getItem("marjan_admin_token")) navigate("/admin/dashboard");
  }, [navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await Api.login(username, password);
      localStorage.setItem("marjan_admin_token", token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-shell" ref={pageRef}>
      <div className="login-card">
        <div className="brand" style={{ marginBottom: 28 }}>Marjan Classic<span>Admin Panel</span></div>
        <h2 style={{ fontSize: "1.5rem" }}>Sign in</h2>
        <p style={{ color: "var(--ink-soft)", fontSize: ".9rem", marginBottom: 24 }}>Manage listings and inquiries for the site.</p>
        <form onSubmit={submit}>
          <div className="field" style={{ marginBottom: 14 }}>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" required autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="field" style={{ marginBottom: 20 }}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
          {error && <p style={{ color: "var(--coral)", fontSize: ".85rem", marginTop: 14 }}>{error}</p>}
        </form>
        <Link to="/" style={{ display: "block", marginTop: 20, fontSize: ".85rem", color: "var(--ink-soft)" }}>&larr; Back to site</Link>
      </div>
    </div>
  );
}
