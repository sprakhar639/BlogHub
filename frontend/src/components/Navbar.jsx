import { useContext, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";

export default function Navbar() {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("Navbar must be rendered inside <AuthProvider>.");
  }

  const { user, loading, logout } = auth;
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("bloghub-theme") === "dark"
  );

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    localStorage.setItem("bloghub-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    function closeMenuOnOutsideClick(event) {
      if (!event.target.closest(".profile-menu-wrap")) {
        setMenuOpen(false);
      }
    }

    function closeMenuOnEscape(event) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("click", closeMenuOnOutsideClick);
    document.addEventListener("keydown", closeMenuOnEscape);

    return () => {
      document.removeEventListener("click", closeMenuOnOutsideClick);
      document.removeEventListener("keydown", closeMenuOnEscape);
    };
  }, []);

  async function handleLogout() {
    try {
      await logout();
      setMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <header className="topbar">
      <nav className="nav-shell">
        <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark">b.</span>
          <span>
            blog<span className="brand-accent">hub</span>
          </span>
        </Link>

        <div className="nav-links">
          <NavLink to="/" end onClick={() => setMenuOpen(false)}>
            Discover
          </NavLink>
          <a href="/#stories" onClick={() => setMenuOpen(false)}>
            Blogs
          </a>
          {!loading && user && (
            <NavLink to="/create" onClick={() => setMenuOpen(false)}>
              Write a story <span className="nav-plus">＋</span>
            </NavLink>
          )}
        </div>

        <div className="nav-actions">
          {loading ? (
            <span className="nav-loading">Loading…</span>
          ) : user ? (
            <div className="profile-menu-wrap">
              <button
                type="button"
                className={`profile-trigger${menuOpen ? " is-open" : ""}`}
                aria-label="Open profile menu"
                aria-expanded={menuOpen}
                aria-haspopup="true"
                onClick={() => setMenuOpen((open) => !open)}
              >
                <span className="avatar">
                  {user.username?.[0]?.toUpperCase() || "U"}
                </span>
                <span className="profile-chevron" aria-hidden="true">
                  ⌄
                </span>
              </button>

              {menuOpen && (
                <div className="profile-dropdown" role="menu">
                  <div className="dropdown-user">
                    <span className="avatar">
                      {user.username?.[0]?.toUpperCase() || "U"}
                    </span>
                    <strong>{user.username || "User"}</strong>
                  </div>

                  <Link
                    to="/profile"
                    className="dropdown-item"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="dropdown-icon" aria-hidden="true">♙</span>
                    <span>My Profile</span>
                  </Link>

                  <Link
                    to="/profile"
                    className="dropdown-item"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="dropdown-icon" aria-hidden="true">▤</span>
                    <span>My Blogs</span>
                  </Link>

                  <button
                    type="button"
                    className="dropdown-item"
                    role="menuitem"
                    onClick={() => setDarkMode((value) => !value)}
                  >
                    <span className="dropdown-icon" aria-hidden="true">
                      {darkMode ? "☀" : "◐"}
                    </span>
                    <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
                  </button>

                  <div className="dropdown-divider" />

                  <button
                    type="button"
                    className="dropdown-item logout-item"
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    <span className="dropdown-icon" aria-hidden="true">⇥</span>
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link className="login-link" to="/login">
                Log in
              </Link>
              <Link className="button button-primary button-small" to="/register">
                Get started <span>↗</span>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
