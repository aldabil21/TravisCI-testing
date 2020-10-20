const Keygrip = require("keygrip");
module.exports = (user) => {
  const id = { passport: { user: user._id.toString() } };
  const session = Buffer.from(JSON.stringify(id)).toString("base64");
  const keygrip = new Keygrip([process.env.cookieKey]);
  const sig = keygrip.sign(`express:sess=${session}`);

  return { session, sig };
};
