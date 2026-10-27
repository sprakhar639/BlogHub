import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/auth-context";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const key = identifier.includes("@") ? "email" : "username";
      const { data } = await api.post("/auth/login", {
        [key]: identifier.trim(),
        password,
      });
      setUser(data.user);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not log in. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <AuthLayout
      eyebrow="WELCOME BACK"
      title={
        <>
          Your next good read
          <br />
          <em>starts here.</em>
        </>
      }
      description="Pick up where you left off, or share a new idea with the community."
    >
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-heading">
          <h2>Log in</h2>
          <p>Good to have you back.</p>
        </div>
        {error && <div className="form-error">{error}</div>}
        <label>
          Username or email
          <input
            autoComplete="username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            required
          />
        </label>
        <button
          className="button button-primary button-wide"
          disabled={submitting}
        >
          {submitting ? "Logging in…" : "Log in to BlogHub"} <span>↗</span>
        </button>
        <p className="form-switch">
          New to BlogHub? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
function AuthLayout({ eyebrow, title, description, children }) {
  return (
    <div className="auth-layout">
      <div className="auth-intro">
        <div className="eyebrow">
          <span className="eyebrow-dot" /> {eyebrow}
        </div>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="auth-note">
          <span>✳</span>
          <p>“A little perspective can change the whole picture.”</p>
        </div>
      </div>
      {children}
    </div>
  );
}
export { AuthLayout };
