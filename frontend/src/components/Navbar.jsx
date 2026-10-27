import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  async function handleLogout() {
    try { await logout(); navigate("/"); }
    catch { /* keep the session UI intact if the request fails */ }
  }
  return <header className="topbar"><nav className="nav-shell">
    <Link to="/" className="brand"><span className="brand-mark">b.</span><span>blog<span className="brand-accent">hub</span></span></Link>
    <div className="nav-links"><NavLink to="/" end>Discover</NavLink>
      {!loading && user && <NavLink to="/create">Write a story <span className="nav-plus">＋</span></NavLink>}
    </div>
    <div className="nav-actions">{loading ? <span className="nav-loading">Loading…</span> : user ? <>
      <Link to="/profile" className="avatar-link"><span className="avatar">{user.username?.[0]?.toUpperCase() || "U"}</span><span className="nav-username">{user.username}</span></Link>
      <button className="button button-quiet button-small" onClick={handleLogout}>Log out</button>
    </> : <><Link className="login-link" to="/login">Log in</Link><Link className="button button-primary button-small" to="/register">Get started <span>↗</span></Link></>}</div>
  </nav></header>;
}
