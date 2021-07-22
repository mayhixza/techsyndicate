if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const businessRoutes = require("./routes/businessRoutes");
const travellerRoutes = require("./routes/travellerRoutes");
const User = require("./models/User");
const jwt = require("jsonwebtoken");

// DB CONNECTION
async function connectDB() {
  await mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
}
connectDB();

// App Settings
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/business", routeToBusiness, businessRoutes);
app.use("/traveller", routeToTraveller, travellerRoutes);
app.get("/", (req, res) => res.render("landing"));
app.get("*", (req, res) => res.send("<h1>404</h1>"));

// Middleware
function routeToBusiness(req, res, next) {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.redirect("/auth/login");
      } else {
        const user = await User.findById(decodedToken.id);
        if (user.business) {
          next();
        } else {
          res.redirect("/traveller");
        }
      }
    });
  } else {
    res.redirect("/auth/login");
  }
}
function routeToTraveller(req, res, next) {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.redirect("/auth/login");
      } else {
        const user = await User.findById(decodedToken.id);
        if (!user.business) {
          next();
        } else {
          res.redirect("/business");
        }
      }
    });
  } else {
    res.redirect("/auth/login");
  }
}
