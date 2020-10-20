const util = require("util");
const redis = require("redis");
const redisClient = redis.createClient(process.env.redisURI);
redisClient.hget = util.promisify(redisClient.hget);

module.exports = redisClient;
