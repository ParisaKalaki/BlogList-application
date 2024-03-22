const loginWith = async (page, username, password) => {
  await page.getByTestId("username").fill(username);
  await page.getByTestId("password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();
};

const createBlog = async (page, title, author, url) => {
  await page.getByRole("button", { name: "new blog" }).click();
  await page.getByTestId("title").fill(title);
  await page.getByTestId("author").fill(author);
  await page.getByTestId("url").fill(url);
  await page.getByRole("button", { name: "create" }).click();
  await page.getByRole("button", { name: "cancel" }).click();
};

const likeBlog = async (page, content) => {
  await page.getByText(content).getByRole("button", { name: "view" }).click();
  await page.getByRole("button", { name: "like" }).click();
  await page.getByRole("button", { name: "hide" }).click();
};

export { loginWith, createBlog, likeBlog };
