import { Link } from "react-router-dom";

function BlogCard({ blog }) {
  const getExcerpt = (content) => {
    if (!content) {
      return "";
    }

    if (content.length <= 180) {
      return content;
    }

    return `${content.slice(0, 180)}...`;
  };

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <article>
      <Link to={`/blog/${blog._id}`}>
        <h2>{blog.title}</h2>
      </Link>

      <p>{getExcerpt(blog.content)}</p>

      <div>
        {blog.author && (
          <span>
            By {blog.author.username}
          </span>
        )}

        {blog.createdAt && (
          <span>
            {" · "}
            {formatDate(blog.createdAt)}
          </span>
        )}
      </div>

      <Link to={`/blog/${blog._id}`}>
        Read more →
      </Link>
    </article>
  );
}

export default BlogCard;