import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/auth-context";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadBlog() {
      try {
        const { data } = await api.get(`/blog/${id}`);

        if (!cancelled) {
          setBlog(data.blog);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Could not load this story.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadBlog();

    return () => {
      cancelled = true;
    };
  }, [id, retryCount]);

  async function handleDelete() {
    if (
      !window.confirm("Delete this story permanently? This cannot be undone.")
    ) {
      return;
    }

    setDeleting(true);

    try {
      await api.delete(`/blog/${id}`);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete story.");
      setDeleting(false);
    }
  }

  if (loading) {
    return <Loading label="Opening the story" />;
  }

  if (error || !blog) {
    return (
      <div className="page-wrap detail-error">
        <ErrorMessage
          message={error || "Story not found"}
          onRetry={() => {
            setLoading(true);
            setRetryCount((count) => count + 1);
          }}
        />

        <Link to="/" className="back-link">
          ← Back to stories
        </Link>
      </div>
    );
  }

  const isOwner =
    user && blog.author && String(user._id) === String(blog.author._id);

  const date = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const paragraphs = (blog.content || "").split(/\n+/).filter(Boolean);

  return (
    <article className="article-page">
      {" "}
      <Link to="/" className="back-link">
        ← All stories{" "}
      </Link>
      <div className="article-hero-art">
        <span className="article-art-label">BLOGHUB FIELD NOTES</span>
        <span className="article-art-glyph">✳</span>
        <span className="article-art-caption">A STORY WORTH YOUR TIME</span>
      </div>
      <div className="article-content">
        <div className="eyebrow">COMMUNITY STORY</div>

        <h1>{blog.title}</h1>

        <div className="article-byline">
          <span className="avatar avatar-large">
            {blog.author?.username?.[0]?.toUpperCase() || "W"}
          </span>

          <div>
            <strong>{blog.author?.username || "Guest writer"}</strong>
            <span>Published {date}</span>
          </div>

          <span className="article-readtime">
            {Math.max(
              1,
              Math.ceil((blog.content || "").split(/\s+/).length / 220),
            )}{" "}
            min read
          </span>
        </div>

        {isOwner && (
          <div className="owner-actions">
            <span>YOUR STORY</span>

            <Link
              className="button button-outline button-small"
              to={`/edit/${blog._id}`}
            >
              Edit story ↗
            </Link>

            <button
              className="button button-danger button-small"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        )}

        <div className="article-body">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div className="article-end">
          <span>✳</span>
          <p>Thanks for reading. Keep your curiosity alive.</p>
        </div>

        <div className="article-bottom">
          <Link to="/" className="button button-dark">
            ← Discover more stories
          </Link>

          <span>
            Written by {blog.author?.username || "a community member"}
          </span>
        </div>
      </div>
    </article>
  );
}
