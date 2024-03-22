import { render, screen } from "@testing-library/react";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";

test("<BlogForm /> updates parent state and calls onSubmit", async () => {
  const createBlog = vi.fn();
  const user = userEvent.setup();

  const { container } = render(<BlogForm createBlog={createBlog} />);
  const title = container.querySelector("#title");
  const author = container.querySelector("#author");
  const url = container.querySelector("#url");

  const sendButton = screen.getByText("create");

  await user.type(title, "title");
  await user.type(author, "author");
  await user.type(url, "url");
  await user.click(sendButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe("title");
  expect(createBlog.mock.calls[0][0].author).toBe("author");
  expect(createBlog.mock.calls[0][0].url).toBe("url");
});
