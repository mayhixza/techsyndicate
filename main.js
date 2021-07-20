const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const businessRoutes = require("./routes/businessRoutes");

const dotenv = require("dotenv");
dotenv.config();

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
app.use("/business", businessRoutes);
app.get("/", (req, res) => res.render("index"));

app.get("/detours", (req, res) => {
  res.render("detours");
});

app.get("/rewards", (req, res) => {
  res.render("rewards");
});

app.get("/started", (req, res) => {
  res.render("started");
});
