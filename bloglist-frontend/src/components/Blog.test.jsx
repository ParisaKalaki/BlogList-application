import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import { describe, test } from "vitest";

describe("<Blog />", () => {
  let container;
  const mockHandler = vi.fn();
  beforeEach(() => {
    const blog = {
      title: "Harry Potter",
      author: "JK Rowling",
      url: "www.harry.com",
      likes: 20,
      user: { name: "root" },
    };
    const user = { name: "root" };

    container = render(
      <Blog blog={blog} user={user} updateBlog={mockHandler} />
    ).container;
  });

  test("renders title and author", () => {
    const element = screen.getByText("Harry Potter");
    const element2 = screen.getByText("JK Rowling");

    expect(element).toBeDefined();
    expect(element2).toBeDefined();
  });

  test("not renders URL and likes", () => {
    const element1 = screen.queryByText("www.harry.com");
    const element2 = screen.queryByText("20");

    expect(element1).toBeNull();
    expect(element2).toBeNull();
  });

  test("URL and likes are shown when the view button clicked", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("view");
    await user.click(button);

    const div = container.querySelector(".details");
    expect(div).not.toHaveStyle("display: none");
  });

  test("Clicking the button twice calls event handler twice", async () => {
    const user = userEvent.setup();
    const viewButton = screen.getByText("view");
    await user.click(viewButton);

    const likeButton = screen.getByText("like");
    await user.click(likeButton);
    await user.click(likeButton);

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
