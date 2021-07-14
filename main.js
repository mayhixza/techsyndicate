const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const authRoutes = require('./routes/authRoutes');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

// App Settings
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());

app.get('*', checkUser);
app.get('/', (req, res) => res.render('index'));
app.use(authRoutes);

// Port
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});