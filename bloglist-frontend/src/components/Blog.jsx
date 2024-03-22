import { useState } from "react";

const Blog = ({ blog, updateBlog, removeBlog, user }) => {
  const [visible, setVisible] = useState(false);
  const [numOfLikes, setNumOfLikes] = useState(blog.likes);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const addLike = (e) => {
    e.preventDefault();
    setNumOfLikes(numOfLikes + 1);
    updateBlog({ ...blog, likes: numOfLikes });
  };

  return (
    <div className="blog">
      <div style={blogStyle}>
        <span>
          <span>{blog.title} </span>
          <span>{blog.author}</span>
          <span>
            <button onClick={() => setVisible(!visible)}>
              {visible ? "hide" : "view"}
            </button>
          </span>
        </span>

        {visible && (
          <div className="details">
            <div>{blog.url}</div>
            <div>
              {numOfLikes}
              <button onClick={addLike}>like</button>
            </div>
            <div>{blog.user.name}</div>
            {blog.user.name === user.name && (
              <button onClick={() => removeBlog(blog)}>remove</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
