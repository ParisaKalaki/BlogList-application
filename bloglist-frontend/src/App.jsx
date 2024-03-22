import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newBlog, setNewBlog] = useState("");

  useEffect(() => {
    blogService.getAll().then((initialsBlogs) => {
      setBlogs(initialsBlogs.sort((a, b) => b.likes - a.likes));
    });
  }, []);
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const addBlog = async (blogObject) => {
    const returnedBlog = await blogService.create(blogObject);
    setBlogs(blogs.concat(returnedBlog));
    setErrorMessage(
      `a new blog ${blogObject.title} by ${blogObject.author} added.`
    );
    setNewBlog("");
  };

  const addLike = async (blogObject) => {
    const returnedBlog = await blogService.update(blogObject.id, blogObject);
    const blogsWithUpdated = blogs.map((blog) =>
      blog.id === blogObject.id ? returnedBlog : blog
    );
    blogsWithUpdated.sort((a, b) => b.likes - a.likes);
    setBlogs(blogsWithUpdated);
    setErrorMessage(
      `a new blog ${blogObject.title} by ${blogObject.author} updated.`
    );
  };

  const deleteBlog = async (blogObject) => {
    await blogService.remove(blogObject.id);
    setBlogs(blogs.filter((blog) => blog.id !== blogObject.id));
    window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`);
  };

  const handleClick = () => {
    window.localStorage.clear();
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);

      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorMessage("wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={errorMessage} />
        <LoginForm
          handleSubmit={handleLogin}
          handleUsernameChange={(e) => setUsername(e.target.value)}
          handlePasswordChange={(e) => setPassword(e.target.value)}
          username={username}
          password={password}
        />
      </div>
    );
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} />
      <div>
        {user.username} logged in
        <button onClick={handleClick()}>logout</button>
      </div>
      <div>
        <Togglable buttonLabel="new blog">
          <BlogForm createBlog={addBlog} />
        </Togglable>
      </div>

      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={addLike}
          removeBlog={deleteBlog}
          user={user}
        />
      ))}
    </div>
  );
};

export default App;
