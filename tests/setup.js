require("dotenv").config();
jest.setTimeout(10000);
require("../models/User");
const mongoose = require("mongoose");
mongoose.connect(process.env.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
