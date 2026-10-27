import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { AuthLayout } from "./Login";

export default function Register() {
  const navigate = useNavigate(); const { setUser } = useAuth();
  const [username, setUsername] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [error, setError] = useState(""); const [submitting, setSubmitting] = useState(false);
  async function handleSubmit(event) {
    event.preventDefault(); setError(""); setSubmitting(true);
    try { const { data } = await api.post("/auth/register", { username: username.trim(), email: email.trim(), password }); setUser(data.user); navigate("/"); }
    catch (err) { setError(err.response?.data?.message || "Could not create your account."); }
    finally { setSubmitting(false); }
  }
  return <AuthLayout eyebrow="MAKE YOURSELF AT HOME" title={<>Your ideas have<br /><em>a place here.</em></>} description="Join a community built around curiosity, honest lessons, and stories worth sharing."><form className="form-card" onSubmit={handleSubmit}><div className="form-heading"><h2>Create account</h2><p>It takes less than a minute.</p></div>{error && <div className="form-error">{error}</div>}<label>Username<input autoComplete="username" minLength="3" maxLength="24" value={username} onChange={e => setUsername(e.target.value)} placeholder="your_name" required /></label><label>Email address<input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required /></label><label>Password<input type="password" autoComplete="new-password" minLength="8" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" required /></label><button className="button button-primary button-wide" disabled={submitting}>{submitting ? "Creating account…" : "Create your account"} <span>↗</span></button><p className="form-switch">Already a member? <Link to="/login">Log in</Link></p></form></AuthLayout>;
}
