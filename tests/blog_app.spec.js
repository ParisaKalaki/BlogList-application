const {
  test,
  describe,
  expect,
  beforeEach,
  screen,
} = require("@playwright/test");
const { loginWith, createBlog, likeBlog } = require("./helper");
const { element } = require("prop-types");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        name: "Superuser",
        username: "root",
        password: "salainen",
      },
    });
    await page.goto("/");
  });
  test("Login form is shown", async ({ page }) => {
    const locator = page.getByText("Log in to application");
    await expect(locator).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "root", "salainen");
      await expect(page.getByText("root logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "root", "wrong");

      const errorDiv = page.locator(".error");

      await expect(errorDiv).toContainText("wrong credentials");
      await expect(errorDiv).toHaveCSS("border-style", "solid");
      await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)");

      await expect(page.getByText("root logged in")).not.toBeVisible();
    });

    describe("when logged in", () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, "root", "salainen");
        await createBlog(
          page,
          "Harry Potter",
          "JK Rowling",
          "www.harry.com",
          true
        );
      });
      test("a new blog can be created", async ({ page }) => {
        await expect(
          page.getByText("a new blog Harry Potter by JK Rowling added.")
        ).toBeVisible();
      });

      test("a test can be edited", async ({ page }) => {
        await page.getByRole("button", { name: "view" }).click();
        const button = page.getByRole("button", { name: "like" });
        await button.click();
        expect(button.locator("..")).toHaveText("1like");
      });

      test("a test can deleted only by its owner", async ({ page }) => {
        await page.getByRole("button", { name: "view" }).click();
        await page.getByRole("button", { name: "remove" }).click();
        page.on("dialog", async (dialog) => await dialog.accept());
        await expect(
          page.getByText("Harry Potter JK Rowling")
        ).not.toBeVisible();

        await page.goto("/");
        await loginWith(page, "parisa", "123");
        await expect(
          page.getByRole("button", { name: "remove" })
        ).not.toBeVisible();
      });

      test("only the user who added the blog sees the blog's delete button", async ({
        page,
      }) => {
        await page.getByRole("button", { name: "view" }).click();
        await expect(
          page.getByRole("button", { name: "remove" })
        ).toBeVisible();
        await page.goto("/");
        await loginWith(page, "parisa", "123");
        await expect(
          page.getByRole("button", { name: "remove" })
        ).not.toBeVisible();
      });
      test("bloges are sorted based on likes", async ({ page }) => {
        await createBlog(page, "Divan", "Hafez", "www.divan.com", true);
        await createBlog(page, "Boostan", "Saadi", "www.boostan.com", true);
        await likeBlog(page, "Harry Potter JK Rowling");

        await likeBlog(page, "Divan Hafez");
        await likeBlog(page, "Divan Hafez");

        await likeBlog(page, "Boostan Saadi");
        await likeBlog(page, "Boostan Saadi");
        await likeBlog(page, "Boostan Saadi");

        const firstBlogTitle = await page.locator(".blog").nth(0).innerText();
        expect(firstBlogTitle).toBe("Boostan Saadiview");
        const secondBlogTitle = await page.locator(".blog").nth(1).innerText();
        expect(secondBlogTitle).toBe("Divan Hafezview");
        const thirdBlogTitle = await page.locator(".blog").nth(2).innerText();
        expect(thirdBlogTitle).toBe("Harry Potter JK Rowlingview");
      });
    });
  });
});
