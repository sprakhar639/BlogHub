import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/auth-context";
import BlogCard from "../components/BlogCard";
import Loading from "../components/Loading";

export default function MyProfile() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }
    api
      .get("/blog/mine")
      .then(({ data }) => setBlogs(data.blogs || []))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load your stories."),
      )
      .finally(() => setLoading(false));
  }, [user, authLoading, navigate]);
  if (authLoading || loading) return <Loading label="Loading your profile" />;
  if (!user) return null;
  return (
    <div className="profile-page">
      <section className="profile-hero">
        <div className="profile-avatar">
          {user.username?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <div className="eyebrow">YOUR CORNER OF BLOGHUB</div>
          <h1>{user.username}</h1>
          <p>{user.email}</p>
          <div className="profile-stats">
            <span>
              <strong>{blogs.length}</strong>{" "}
              {blogs.length === 1 ? "story published" : "stories published"}
            </span>
            <span>
              Member since{" "}
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                    month: "short",
                    year: "numeric",
                  })
                : "recently"}
            </span>
          </div>
        </div>
        <Link className="button button-primary profile-write" to="/create">
          Write a story ↗
        </Link>
      </section>
      <section className="profile-stories">
        <div className="section-heading">
          <div>
            <div className="eyebrow">YOUR WRITING</div>
            <h2>
              Your stories<span className="heading-period">.</span>
            </h2>
          </div>
        </div>
        {error ? (
          <div className="form-error">{error}</div>
        ) : blogs.length ? (
          <div className="blog-grid">
            {blogs.map((blog, i) => (
              <BlogCard key={blog._id} blog={blog} index={i} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span>✳</span>
            <h3>Your first story starts here.</h3>
            <p>
              Share something you’ve learned, noticed, or can’t stop thinking
              about.
            </p>
            <Link to="/create" className="button button-primary">
              Write your first story ↗
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
