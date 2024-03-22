import { useState } from "react";

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = async (e) => {
    e.preventDefault();
    createBlog({
      title: title,
      author: author,
      url: url,
    });
  };
  return (
    <div className="formDiv">
      <h2>create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            data-testid="title"
            value={title}
            name="title"
            id="title"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          author:
          <input
            data-testid="author"
            value={author}
            name="author"
            id="author"
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div>
          url:
          <input
            data-testid="url"
            value={url}
            name="url"
            id="url"
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};
export default BlogForm;
