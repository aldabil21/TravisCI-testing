const mongoose = require("mongoose");
const RedisClient = require("./redis");
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || "default");
  return this;
};

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  const query = JSON.stringify(
    Object.assign({}, this.getFilter(), this.getOptions(), {
      model: this.mongooseCollection.name,
    })
  );

  // console.log(query);

  const cached = await RedisClient.hget(this.hashKey, query);

  if (cached) {
    console.log("FROM CACHE");
    // console.log(cached);
    const doc = JSON.parse(cached);
    const _doc = Array.isArray(doc)
      ? doc.map((d) => new this.model(d))
      : new this.model(doc);
    return _doc;
  }

  const result = await exec.apply(this, arguments);

  console.log("FROM DB");
  RedisClient.hset(this.hashKey, query, JSON.stringify(result));
  RedisClient.expire(this.hashKey, 60);
  return result;
};

exports.clearCache = (key) => {
  RedisClient.del(JSON.stringify(key));
};
