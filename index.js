// Dependencies
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const path = require("path");
const PORT = process.env.PORT || 5000;
require("./services/cache");

// DB and Passport
require("./models/User");
require("./models/Blog");
require("./services/passport");

// Routes
const setupAuthRoutes = require("./routes/authRoutes");
const setupBlogRoutes = require("./routes/blogRoutes");

// Server and DB Settings
mongoose.Promise = global.Promise;
mongoose.connect(process.env.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const app = express();

// Server middleware
app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.cookieKey],
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Server Routes
setupAuthRoutes(app);
setupBlogRoutes(app);

console.log(process.env.NODE_ENV);
// Production-only settings
if (["production", "ci"].includes(process.env.NODE_ENV)) {
  app.use(express.static("client/build"));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve("client", "build", "index.html"))
  );
}

// Start Server
app.listen(PORT, () => console.log(`Listening on port`, PORT));
