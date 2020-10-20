const puppeteer = require("puppeteer");
const sessionFactory = require("../factories/session");
const userFactory = require("../factories/user");

const browserOptions = {
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
};
class Page {
  static async build(options = {}) {
    const _browser = await puppeteer.launch({
      browserOptions,
      options,
    });
    const _page = await _browser.newPage();
    const _customPage = new Page(_page, _browser);
    return new Proxy(_customPage, {
      get: function (target, property) {
        return target[property] || _page[property] || _browser[property];
      },
    });
  }

  constructor(page, browser) {
    this.page = page;
    this.browser = browser;
  }

  async login(returnTo = `${this.page.url()}blogs`) {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);
    await this.page.setCookie(
      {
        name: "express:sess",
        value: session,
        expires: Date.now() + 24 * 30 * 60 * 60 * 1000,
      },
      {
        name: "express:sess.sig",
        value: sig,
        expires: Date.now() + 24 * 30 * 60 * 60 * 1000,
      }
    );
    await this.page.goto(returnTo);
    // await this.page.waitFor(1000);
    await this.page.waitFor('a[href="/auth/logout"]');
  }

  close() {
    this.browser.close();
  }
}

module.exports = Page;
