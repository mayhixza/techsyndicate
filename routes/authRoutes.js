const { Router } = require("express");
const router = Router();
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
router.get("*", checkUser);

//GET Routes

router.get("/signup", notRequireAuth, (req, res) => {
  res.render("signup", { error: false });
});

router.get("/login", notRequireAuth, (req, res) => {
  res.render("login", { error: false });
});

router.get("/logout", requireAuth, (req, res) => {
  res.clearCookie("jwt").redirect("/");
});

//this is test route for pages that require auth
router.get("/protected", requireAuth, (req, res) => {
  res.render("userpage");
});

//POST Routes
router.post("/signup", notRequireAuth, async (req, res) => {
  let { name, email, business, password } = req.body;

  if (business === undefined) {
    business = false;
  } else {
    business = true;
  }

  try {
    const user = await User.create({
      name,
      email,
      business,
      password,
      inDetour: false,
      points: 0,
    });
    const token = createToken(user._id);
    res
      .cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 })
      .redirect(business ? "/business" : "/traveller");
  } catch (err) {
    const error = handleErrors(err);
    return res.render("signup", { error });
  }
});

router.post("/login", notRequireAuth, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res
      .cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 })
      .redirect(user.business ? "/business" : "/traveller");
  } catch (err) {
    const error = handleErrors(err);
    res.render("login", { error });
  }
});

//AUTH Middleware
function checkUser(req, res, next) {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
}

function requireAuth(req, res, next) {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.redirect("/auth/login");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/auth/login");
  }
}

function notRequireAuth(req, res, next) {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.cookie("jwt", "", { maxAge: 1 }).redirect("/auth/login");
      } else {
        res.redirect("/");
      }
    });
  } else {
    next();
  }
}

function handleErrors(err) {
  let error = "";

  if (err.message === "incorrect email") {
    error = "That email is not registered";
  }

  if (err.message === "incorrect password") {
    error = "That password is incorrect";
  }

  if (err.code === 11000) {
    error = "that email is already registered";
    return error;
  }

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      error = properties.message;
    });
  }

  return error;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
function createToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
}

module.exports = router;
