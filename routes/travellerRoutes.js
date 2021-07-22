const { Router } = require("express");
const jwt = require("jsonwebtoken");
const Detour = require("../models/Detour");
const User = require("../models/User");
const router = Router();

// Routes
router.get("/", (req, res) => {
  res.render("traveller/tIndex");
});
// Make a post route here for "/" and forward to /detours

router.get("/detours", (req, res) => {
  res.render("traveller/detours");
});

router.get("/rewards", (req, res) => {
  res.render("traveller/rewards");
});

router.get("/started", (req, res) => {
  res.render("traveller/started");
});

router.get("/welcome", (req, res) => {
  res.render("traveller/welcome");
});

//POST
router.post("/search", async (req, res) => {
  // const arr = [];
  // const search = req.query.srch;
  // const returnstr = "";
  // const json = await fetch(
  //   `https://atlas.mapmyindia.com/api/places/search/json?query=${search}`,
  //   {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer b4230734-0bcb-4b2d-bda5-a12b2f4b9066",
  //     },
  //   }
  // );
  // let r = await json.json();
  // console.log(r);
  // if (r.suggestedLocations == []) {
  //   res.status(404).json("not found lmfao");
  // }
  // for (var i = 0; i < 5 && r.suggestedLocations.length; i++) {
  //   var obj = r.suggestedLocations[i];
  //   arr.push(obj);
  // }

  // res.json(arr);

res.json([
  {
    type: "CITY",
    placeAddress: "Haryana",
    eLoc: "122JUF",
    placeName: "Gurugram",
    alternateName: "Gurgaon,Gurgaun",
    keywords: [],
    orderIndex: 1,
    suggester: "alternateName",
  },
  {
    type: "DISTRICT",
    placeAddress: "Haryana",
    eLoc: "GILSMV",
    placeName: "Gurugram District",
    alternateName: "Gurgaon District",
    keywords: [],
    orderIndex: 2,
    suggester: "alternateName",
  },
  {
    type: "POI",
    placeAddress:
      "Gurgaon Farukh Nagar Road, Farrukhnagar, Gurugram District, Haryana, 122505",
    eLoc: "6BTF3C",
    placeName: "Sultanpur National Park",
    alternateName: "Sultanpur Bird Sanctuary,Haryana Birds Paradise",
    keywords: ["NTCBDS"],
    orderIndex: 3,
    suggester: "placeName",
  },
  {
    type: "POI",
    placeAddress: "Gurgaon, Gurgaon Village, Gurugram, Haryana, 122006",
    eLoc: "A4M7KC",
    placeName: "Gurgaon Village 3",
    alternateName: "",
    keywords: ["HLTHSP"],
    orderIndex: 4,
    suggester: "placeName",
  },
  {
    type: "POI",
    placeAddress:
      "Gurgaon Masani Road, Gurgaon Village, Gurugram, Haryana, 122006",
    eLoc: "IYLW0E",
    placeName: "Gurgaon Media Works",
    alternateName: "",
    keywords: ["SHPMAD"],
    orderIndex: 5,
    suggester: "placeName",
  },
]);
});
// Middleware

module.exports = router;
