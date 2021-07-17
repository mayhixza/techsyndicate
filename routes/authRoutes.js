const { Router } = require('express');

const router = Router();

//AUTH Middleware
const checkUser = (req, res, next) => {
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
};

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
  
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
          res.redirect('/login');
        } else {
          next();
        }
      });
    } else {
      res.redirect('/login');
    }
  };

const handleErrors = (err) => {
    let errors = { email: '', password: '' };
  
    if (err.message === 'incorrect email') {
      errors.email = 'That email is not registered';
    }
  
    if (err.message === 'incorrect password') {
      errors.password = 'That password is incorrect';
    }
  
    if (err.code === 11000) {
      errors.email = 'that email is already registered';
      return errors;
    }
  
    if (err.message.includes('user validation failed')) {
      Object.values(err.errors).forEach(({ properties }) => {
        errors[properties.path] = properties.message;
      });
    }
  
    return errors;
}
  
// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge
});
};


//GET Routes

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
});

//this is test route for pages that require auth
router.get('/protected', requireAuth, (req, res) => {
    res.render("userpage");
});

//POST Routes
router.post('/signup', async (req, res) => {
    const { name, email, buyer, password } = req.body;
  
    try {
      const user = await User.create({ name, email, buyer, password });
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(201).json({ user: user._id });
    }
    catch(err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
   
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.login(email, password);
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ user: user._id });
    } 
    catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
  
});
const {
  requireAuth,
  checkUser,
  notRequireAuth,
} = require("../middleware/authMiddleware");
const { Router } = require("express");
const authController = require("../controllers/authController");

const router = Router();

router.get("/signup", notRequireAuth, authController.signup_get);
router.post("/signup", notRequireAuth, authController.signup_post);
router.get("/login", notRequireAuth, authController.login_get);
router.post("/login", notRequireAuth, authController.login_post);
router.get("/logout", requireAuth, authController.logout_get);
router.get("/protected", requireAuth, authController.prot_test);

module.exports = router;
