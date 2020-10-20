const Page = require("./helpers/page");

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("http://localhost:3000");
});

it("Should Logo Name is Blogster", async () => {
  const logoText = await page.$eval(".nav-wrapper a", (el) => el.innerHTML);

  expect(logoText).toEqual("Blogster");
});

it("Should start OAuth flow", async () => {
  await page.click(".right a");
  const url = await page.url();
  const OAuth = url.includes("accounts.google.com");
  expect(OAuth).toBe(true);
});

it("Shows Logout Button When signed in", async () => {
  await page.login();
  const logoutText = await page.$eval(
    'a[href="/auth/logout"]',
    (el) => el.innerHTML
  );

  expect(logoutText).toEqual("Logout");
});

afterEach(async () => {
  await page.close();
});
