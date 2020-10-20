const Page = require("./helpers/page");

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("http://localhost:3000");
});

describe("When logged in", () => {
  beforeEach(async () => {
    await page.login();
    await page.click('a[href="/blogs/new"]');
  });

  it("Can see blog from", async () => {
    const inputNumbers = await page.$$eval("input", (el) => el.length);
    const submitBtn = await page.$eval("form button", (el) => el.type);
    expect(inputNumbers).toEqual(2);
    expect(submitBtn).toEqual("submit");
  });
});

describe("When not Logged in", () => {
  it("Cannot create post", async () => {
    const status = await page.evaluate(() =>
      fetch("/api/blogs", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: "Jest Title", content: "Jest content" }),
      }).then((res) => res.status)
    );

    expect(status).toEqual(401);
  });

  it("Cannot fetch posts", async () => {
    const status = await page.evaluate(() =>
      fetch("/api/blogs", {
        method: "GET",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.status)
    );
    expect(status).toEqual(401);
  });
});

afterEach(async () => {
  await page.close();
});
