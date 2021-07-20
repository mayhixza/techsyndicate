const { Router } = require('express');
const jwt = require('jsonwebtoken')
const Detour = require("../models/Detour");
const User = require("../models/User");

const router = Router();

//GET Routes
router.get('/create', (req, res) => {
    res.render("bizCreate");
});

router.get("/setup-detour", (req, res) => {
    res.render("business/setup-detour");
});

router.get("/listed", (req, res) => {
    res.render("business/listed");
});

//POST Routes
router.post("/create", async (req, res) => {
    const id = jwt.decode(req.cookies.jwt).id;
    let { type, fragile, pickLocation, dropLocation } = req.body;
  
    if (fragile === undefined) {
        fragile = false;
    } else {
        fragile = true;
    }
  
    try {
        const detour = await Detour.create({ type, fragile, pickLocation, dropLocation, bizID:id});
        return res.redirect('/');
    } catch (err) {
        const error = handleErrors(err);        
        return res.render("bizCreate", { error });
    }
  
});


module.exports = router;
