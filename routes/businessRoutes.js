const fetch = require("node-fetch");
const { Router, query } = require('express');
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

router.post('/search', async (req, res) => {
    const arr = [];
    const search = req.query.srch;
    const returnstr = "";
    // const json = await fetch(`https://atlas.mapmyindia.com/api/places/search/json?query=${search}`, {
    //     method: 'GET',
    //     headers: { 'Content-Type': 'application/json' , 'Authorization': 'Bearer cb368052-11e3-4a7f-a5dc-e56117d30c32'},
    // });
    // let r = await json.json()
    // let r = ``
    // console.log(r);
    // if(r.suggestedLocations==[]) {res.status(404).json("not found lmfao")}
    // for(var i = 0; i < 5 && r.suggestedLocations.length; i++) {
    //     var obj = r.suggestedLocations[i];
    //     arr.push(obj);
    // }
    res.json([
        {
            "type": "CITY",
            "placeAddress": "Haryana",
            "eLoc": "122JUF",
            "placeName": "Gurugram",
            "alternateName": "Gurgaon,Gurgaun",
            "keywords": [],
            "orderIndex": 1,
            "suggester": "alternateName"
        },
        {
            "type": "DISTRICT",
            "placeAddress": "Haryana",
            "eLoc": "GILSMV",
            "placeName": "Gurugram District",
            "alternateName": "Gurgaon District",
            "keywords": [],
            "orderIndex": 2,
            "suggester": "alternateName"
        },
        {
            "type": "POI",
            "placeAddress": "Gurgaon Farukh Nagar Road, Farrukhnagar, Gurugram District, Haryana, 122505",
            "eLoc": "6BTF3C",
            "placeName": "Sultanpur National Park",
            "alternateName": "Sultanpur Bird Sanctuary,Haryana Birds Paradise",
            "keywords": [
                "NTCBDS"
            ],
            "orderIndex": 3,
            "suggester": "placeName"
        },
        {
            "type": "POI",
            "placeAddress": "Gurgaon, Gurgaon Village, Gurugram, Haryana, 122006",
            "eLoc": "A4M7KC",
            "placeName": "Gurgaon Village 3",
            "alternateName": "",
            "keywords": [
                "HLTHSP"
            ],
            "orderIndex": 4,
            "suggester": "placeName"
        },
        {
            "type": "POI",
            "placeAddress": "Gurgaon Masani Road, Gurgaon Village, Gurugram, Haryana, 122006",
            "eLoc": "IYLW0E",
            "placeName": "Gurgaon Media Works",
            "alternateName": "",
            "keywords": [
                "SHPMAD"
            ],
            "orderIndex": 5,
            "suggester": "placeName"
        }
    ]);
});


module.exports = router;
