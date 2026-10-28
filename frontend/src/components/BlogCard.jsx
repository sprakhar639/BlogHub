import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/auth-context";

const palettes = ["mint", "lavender", "peach", "blue"];

function formatDate(date) {
  return date
    ? new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Recently";
}

function excerpt(text = "", max = 160) {
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
}

export default function BlogCard({ blog, index = 0 }) {
  const palette = palettes[index % palettes.length];
  const navigate = useNavigate();
  const { user } = useAuth();

  const [likesCount, setLikesCount] = useState(blog.likesCount ?? 0);
  const [likedByMe, setLikedByMe] = useState(blog.likedByMe ?? false);
  const [liking, setLiking] = useState(false);
  const [likeError, setLikeError] = useState("");

  async function handleLike() {
    if (!user) {
      navigate("/login");
      return;
    }

    if (liking) return;

    setLiking(true);
    setLikeError("");

    try {
      const response = likedByMe
        ? await api.delete(`/blog/${blog._id}/like`)
        : await api.post(`/blog/${blog._id}/like`);

      const updatedBlog = response.data.blog;

      setLikesCount(updatedBlog.likesCount ?? 0);
      setLikedByMe(updatedBlog.likedByMe ?? false);
    } catch (error) {
      setLikeError(
        error.response?.data?.message ||
          "Unable to update your like. Please try again.",
      );
    } finally {
      setLiking(false);
    }
  }

  return (
    <article className="blog-card" style={{ "--delay": `${index * 65}ms` }}>
      <Link
        to={`/blog/${blog._id}`}
        className={`card-art art-${palette}`}
        aria-label={`Read ${blog.title}`}
      >
        <span className="art-orb orb-one" />
        <span className="art-orb orb-two" />

        <span className="art-label">
          FIELD NOTES&nbsp; / &nbsp;{String(index + 1).padStart(2, "0")}
        </span>

        <span className="art-glyph">{["✳", "◒", "✺", "⌘"][index % 4]}</span>
      </Link>

      <div className="card-body">
        <div className="card-meta">
          <span>{blog.author?.username || "Guest writer"}</span>
          <i />
          {formatDate(blog.createdAt)}
        </div>

        <h2>
          <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
        </h2>

        <p>{excerpt(blog.content)}</p>

        <div className="card-bottom">
          <span className="read-time">
            {Math.max(
              1,
              Math.ceil((blog.content || "").split(/\s+/).length / 220),
            )}{" "}
            min read
          </span>

          <div className="card-actions">
            <button
              type="button"
              className={`like-button ${likedByMe ? "is-liked" : ""}`}
              onClick={handleLike}
              disabled={liking}
              aria-label={likedByMe ? "Unlike this story" : "Like this story"}
              aria-pressed={likedByMe}
              title={likedByMe ? "Unlike this story" : "Like this story"}
            >
              <span aria-hidden="true">{likedByMe ? "♥" : "♡"}</span>
              <span>{likesCount}</span>
            </button>

            <Link className="read-link" to={`/blog/${blog._id}`}>
              Read story <span>↗</span>
            </Link>
          </div>
        </div>

        {likeError && (
          <p className="like-error" role="alert">
            {likeError}
          </p>
        )}
      </div>
    </article>
  );
}
