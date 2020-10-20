const { clearCache } = require("../services/cache");

exports.cleanCache = async (req, res, next) => {
  await next();
  clearCache(req.user.id);
  console.log("CACHE CLEARD");
};
