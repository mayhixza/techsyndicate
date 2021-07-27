const fetch = require("node-fetch");
const { Router, query } = require("express");
const jwt = require("jsonwebtoken");
const Detour = require("../Models/Detour");
const User = require("../Models/User");

const router = Router();

//GET Routes
router.get("/", (req, res) => {
  res.render("business/stats");
});

router.get("/create", (req, res) => {
  res.render("business/bizCreate");
});

router.get("/listed", (req, res) => {
  res.render("business/listed");
});

//POST Routes
router.post("/create", async (req, res) => {
  const id = jwt.decode(req.cookies.jwt).id;
  let {
    type,
    fragile,
    pickLocation,
    dropLocation,
    pickFlat,
    dropFlat,
    pickeLoc,
    dropeLoc,
  } = req.body;

  const actualAddressPick = pickLocation;
  const actualAddressDrop = dropLocation;

  const data = await fetch(
    `https://atlas.mapmyindia.com/api/places/geocode?address=${pickLocation}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer a038ca9a-2d12-4a5a-a137-3f87b431d758`,
      },
    }
  );
  const json = await data.json();
  pickLocation = json.copResults.eLoc;

  const data2 = await fetch(
    `https://atlas.mapmyindia.com/api/places/geocode?address=${dropLocation}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer a038ca9a-2d12-4a5a-a137-3f87b431d758`,
      },
    }
  );
  dropLocation = await data2.json();
  dropLocation = dropLocation.copResults.eLoc;

  if (fragile === undefined) {
    fragile = false;
  } else {
    fragile = true;
  }

  const distData = await fetch(
    `https://apis.mapmyindia.com/advancedmaps/v1/9dafa78f7b63a4f0391967a5f43ee66f/distance_matrix/driving/${pickLocation}%3B${dropLocation}?region=IND&sources=0`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer a038ca9a-2d12-4a5a-a137-3f87b431d758`,
      },
    }
  );
  let a = await distData.json();
  let distInt = a.results.distances[0][1];

  // let distInt = 125; //In Meters

  let reward = Math.floor(distInt / 1000);

  try {
    const detour = await Detour.create({
      type,
      fragile,
      pickLocation: pickeLoc,
      dropLocation: dropeLoc,
      pickFlat: pickFlat,
      dropFlat: dropFlat,
      bizID: id,
      distance: distInt,
      reward: reward,
      active: true,
      taken: false,
      pickAddress: actualAddressPick,
      dropAddress: actualAddressDrop,
    });
    return res.redirect("/business");
  } catch (err) {
    console.log(err);
    return res.render("bizCreate", { error });
  }
});

router.post("/search", async (req, res) => {
  try {
    const arr = [];
    const search = req.query.srch;
    const returnstr = "";
    const json = await fetch(
      `https://atlas.mapmyindia.com/api/places/search/json?query=${search}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer a038ca9a-2d12-4a5a-a137-3f87b431d758`,
        },
      }
    );
    let r = await json.json();
    console.log(r);
    if (r.suggestedLocations == []) {
      res.status(404).json("not found lmfao");
    }
    for (var i = 0; i < 5 && r.suggestedLocations.length; i++) {
      var obj = r.suggestedLocations[i];
      arr.push(obj);
    }

    res.json(arr);
  } catch (err) {
    res.json({ err: err }).status(400);
  }

  // res.json([
  //   {
  //     type: "CITY",
  //     placeAddress: "Haryana",
  //     eLoc: "122JUF",
  //     placeName: "Gurugram",
  //     alternateName: "Gurgaon,Gurgaun",
  //     keywords: [],
  //     orderIndex: 1,
  //     suggester: "alternateName",
  //   },
  //   {
  //     type: "DISTRICT",
  //     placeAddress: "Haryana",
  //     eLoc: "GILSMV",
  //     placeName: "Gurugram District",
  //     alternateName: "Gurgaon District",
  //     keywords: [],
  //     orderIndex: 2,
  //     suggester: "alternateName",
  //   },
  //   {
  //     type: "POI",
  //     placeAddress:
  //       "Gurgaon Farukh Nagar Road, Farrukhnagar, Gurugram District, Haryana, 122505",
  //     eLoc: "6BTF3C",
  //     placeName: "Sultanpur National Park",
  //     alternateName: "Sultanpur Bird Sanctuary,Haryana Birds Paradise",
  //     keywords: ["NTCBDS"],
  //     orderIndex: 3,
  //     suggester: "placeName",
  //   },
  //   {
  //     type: "POI",
  //     placeAddress: "Gurgaon, Gurgaon Village, Gurugram, Haryana, 122006",
  //     eLoc: "A4M7KC",
  //     placeName: "Gurgaon Village 3",
  //     alternateName: "",
  //     keywords: ["HLTHSP"],
  //     orderIndex: 4,
  //     suggester: "placeName",
  //   },
  //   {
  //     type: "POI",
  //     placeAddress:
  //       "Gurgaon Masani Road, Gurgaon Village, Gurugram, Haryana, 122006",
  //     eLoc: "IYLW0E",
  //     placeName: "Gurgaon Media Works",
  //     alternateName: "",
  //     keywords: ["SHPMAD"],
  //     orderIndex: 5,
  //     suggester: "placeName",
  //   },
  // ]);
});

module.exports = router;
