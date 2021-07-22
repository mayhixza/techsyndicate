const fetch = require("node-fetch");
const { Router, query } = require("express");
const jwt = require("jsonwebtoken");
const Detour = require("../models/Detour");
const User = require("../models/User");

const router = Router();

//GET Routes
router.get("/create", (req, res) => {
  res.render("bizCreate");
});

router.get("/setup-detour", (req, res) => {
  res.render("business/setup-detour");
});

router.get("/listed", (req, res) => {
  res.render("business/listed");
});

router.get("/", (req, res) => {
  res.render("business/stats");
});

//POST Routes
router.post("/create", async (req, res) => {
  const id = jwt.decode(req.cookies.jwt).id;
  let { type, fragile, pickLocation, dropLocation } = req.body;

  // const data = await fetch(
  //   `https://atlas.mapmyindia.com/api/places/geocode?address=${pickLocation}`,
  //   {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer b4230734-0bcb-4b2d-bda5-a12b2f4b9066",
  //     },
  //   }
  // );
  // const json = await data.json();
  // pickLocation = json.copResults.eLoc;

  // const data2 = await fetch(
  //   `https://atlas.mapmyindia.com/api/places/geocode?address=${dropLocation}`,
  //   {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer b4230734-0bcb-4b2d-bda5-a12b2f4b9066",
  //     },
  //   }
  // );
  // dropLocation = await data2.json();
  // dropLocation = dropLocation.copResults.eLoc;

  if (fragile === undefined) {
    fragile = false;
  } else {
    fragile = true;
  }
  pickLocation = "NUS56A";
  dropLocation = "NTXV52";
  const distance = 0;
  
  // const distData = await fetch(`https://apis.mapmyindia.com/advancedmaps/v1/1552cd216febc8bf1934938997aaf215/distance_matrix/driving/${pickLocation}%3B${dropLocation}?region=IND&sources=0`, {
  //   method: 'GET',
  //   headers: { 'Content-Type': 'application/json' , 'Authorization': 'Bearer b4230734-0bcb-4b2d-bda5-a12b2f4b9066'},
  // });
  // let a = await distData.json();
  // let distInt = a.results.distances[0][1];
  let distInt = 125; //In Meters
  // const disJson = await distData.json();

  // try {
  //   const detour = await Detour.create({
  //     type,
  //     fragile,
  //     pickLocation,
  //     dropLocation,
  //     bizID: id,
  //     distance: distance,
  //   });
  //   return res.redirect("/business");
  // } catch (err) {
  //   console.log(err);
  //   return res.render("bizCreate", { error });
  // }
});

router.post("/search", async (req, res) => {
  //   const arr = [];
  //   const search = req.query.srch;
  //   const returnstr = "";
  //   const json = await fetch(
  //     `https://atlas.mapmyindia.com/api/places/search/json?query=${search}`,
  //     {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer b4230734-0bcb-4b2d-bda5-a12b2f4b9066",
  //       },
  //     }
  //   );
  //   let r = await json.json();
  //   console.log(r);
  //   if (r.suggestedLocations == []) {
  //     res.status(404).json("not found lmfao");
  //   }
  //   for (var i = 0; i < 5 && r.suggestedLocations.length; i++) {
  //     var obj = r.suggestedLocations[i];
  //     arr.push(obj);
  //   }

  //   res.json(arr);

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

module.exports = router;
