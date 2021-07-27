const fetch = require("node-fetch");
const { Router } = require("express");
const jwt = require("jsonwebtoken");
const Detour = require("../Models/Detour");
const User = require("../Models/User");
const router = Router();
const mongoose = require("mongoose");

// Routes
router.get("/", checkInTour, (req, res) => {
  res.render("traveller/welcome");
});
router.post("/", checkInTour, (req, res) => {
  const body = req.body;
  res.redirect(
    `/traveller/detours?pick=${body.pickeLoc}&drop=${body.dropeLoc}`
  );
});

router.get("/detours", checkInTour, async (req, res) => {
  const detours = await Detour.find({ active: true, taken: false });
  const { pick, drop } = req.query;
  let detoursNear = [];

  for (let detour of detours) {
    const distData = await fetch(
      `https://apis.mapmyindia.com/advancedmaps/v1/9dafa78f7b63a4f0391967a5f43ee66f/distance_matrix/driving/${detour.pickLocation}%3B${pick}?region=IND&sources=0`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer a038ca9a-2d12-4a5a-a137-3f87b431d758',
        },
      }
    );
    let a = await distData.json();
    let distInt = a.results.distances[0][1];

    // let distInt = 125;

    if (distInt < 5000) {
      const distData2 = await fetch(
        `https://apis.mapmyindia.com/advancedmaps/v1/9dafa78f7b63a4f0391967a5f43ee66f/distance_matrix/driving/${detour.dropLocation}%3B${drop}?region=IND&sources=0`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: 'Bearer a038ca9a-2d12-4a5a-a137-3f87b431d758',
          },
        }
      );
      let a2 = await distData2.json();
      let distInt2 = a2.results.distances[0][1];

      // let distInt2 = 125;

      if (distInt2 < 5000) {
        detoursNear.push(detour);
      }
    }
  }

  for (let detour of detoursNear) {
    const saveDetour = detour;
    detoursNear.splice(detoursNear.indexOf(detour), 1);

    let user = await User.findById(detour.bizID);
    saveDetour.bizID = user.name;

    detoursNear.push(saveDetour);
  }

  res.render("traveller/detours", { detours: detoursNear });
});

router.get("/inTour/:id", async (req, res) => {
  const user = jwt.decode(req.cookies.jwt).id;
  const detour = await Detour.findById(req.params.id);

  await Detour.updateOne(
    { _id: req.params.id, active: true, taken: false },
    {
      $set: {
        taken: true,
        assignedTo: user,
      },
    }
  );

  await User.updateOne(
    { _id: user },
    {
      $set: {
        inDetour: true,
        detour: req.params.id,
      },
    }
  );

  res.render("traveller/started", { id: req.params.id, detour: detour });
});

router.get("/rewards", checkInTour, (req, res) => {
  res.render("traveller/rewards");
});

router.get("/pick", async (req, res) => {
  let pickLocELoc;
  const detour = await Detour.findById(mongoose.Types.ObjectId(req.query.ID));
  pickLocELoc = detour.pickLocation;

  const addressFetch = await fetch(
    `https://apis.mapmyindia.com/advancedmaps/v1/9dafa78f7b63a4f0391967a5f43ee66f/rev_geocode?lat=${req.query.lat}&lng=${req.query.long}&region=IND`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: 'Bearer a038ca9a-2d12-4a5a-a137-3f87b431d758',
      },
    }
  );
  const addressJson = await addressFetch.json();
  const addressString = addressJson.results[0].formatted_address;
  const eLocFetch = await fetch(
    `https://atlas.mapmyindia.com/api/places/textsearch/json?query=${addressString}&region=IND&location=${req.query.lat}%2C${req.query.long}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: 'Bearer a038ca9a-2d12-4a5a-a137-3f87b431d758',
      },
    }
  );
  const eLocJson = await eLocFetch.json();
  const eLoc = eLocJson.suggestedLocations[0].eLoc;
  const distData2 = await fetch(
    `https://apis.mapmyindia.com/advancedmaps/v1/9dafa78f7b63a4f0391967a5f43ee66f/distance_matrix/driving/${eLoc}%3B${pickLocELoc}?region=IND&sources=0`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: 'Bearer a038ca9a-2d12-4a5a-a137-3f87b431d758',
      },
    }
  );
  let a2 = await distData2.json();
  let distInt2 = a2.results.distances[0][1];

  // let distInt2 = 125;

  if (distInt2 < 900) {
    await Detour.updateOne(
      { _id: mongoose.Types.ObjectId(req.query.ID) },
      {
        $set: {
          picked: true,
        },
      }
    );

    res.json({ done: true });
  } else {
    res.json({ done: false });
  }
});

router.get("/drop", async (req, res) => {
  try {
    let pickLocELoc;
    const detour = await Detour.findOne({
      _id: mongoose.Types.ObjectId(req.query.ID),
      picked: true,
    });
    pickLocELoc = detour.dropLocation;
    const addressFetch = await fetch(
      `https://apis.mapmyindia.com/advancedmaps/v1/9dafa78f7b63a4f0391967a5f43ee66f/rev_geocode?lat=${req.query.lat}&lng=${req.query.long}&region=IND`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer a038ca9a-2d12-4a5a-a137-3f87b431d758',
        },
      }
    );
    const addressJson = await addressFetch.json();
    const addressString = addressJson.results[0].formatted_address;
    const eLocFetch = await fetch(
      `https://atlas.mapmyindia.com/api/places/textsearch/json?query=${addressString}&region=IND&location=${req.query.lat}%2C${req.query.long}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer a038ca9a-2d12-4a5a-a137-3f87b431d758',
        },
      }
    );
    const eLocJson = await eLocFetch.json();
    const eLoc = eLocJson.suggestedLocations[0].eLoc;
    const distData2 = await fetch(
      `https://apis.mapmyindia.com/advancedmaps/v1/9dafa78f7b63a4f0391967a5f43ee66f/distance_matrix/driving/${eLoc}%3B${pickLocELoc}?region=IND&sources=0`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer a038ca9a-2d12-4a5a-a137-3f87b431d758',
        },
      }
    );
    let a2 = await distData2.json();
    let distInt2 = a2.results.distances[0][1];

    // let distInt2 = 125;

    if (distInt2 < 900) {
      await Detour.updateOne(
        { _id: mongoose.Types.ObjectId(req.query.ID), picked: true },
        {
          $set: {
            dropped: true,
            active: false,
          },
        }
      );

      const user = await User.findById(jwt.decode(req.cookies.jwt).id);
      await User.updateOne(
        { _id: jwt.decode(req.cookies.jwt).id },
        {
          $set: {
            reward: user.points + detour.reward,
            inDetour: false,
            detour: "",
          },
        }
      );

      res.json({ done: true });
    } else {
      console.log("Not actually near");
      res.json({ done: false });
    }
  } catch (err) {
    console.log(err);
    res.json({ done: false });
  }
});

router.get("/collect", checkInTour, async (req, res) => {
  const detour = await Detour.findOne({ _id: req.query.id, dropped: true });
  res.render("traveller/collect", { reward: detour.reward });
});

//POST
router.post("/search", checkInTour, async (req, res) => {
  const arr = [];
  const search = req.query.srch;
  const returnstr = "";
  const json = await fetch(
    `https://atlas.mapmyindia.com/api/places/search/json?query=${search}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: 'Bearer a038ca9a-2d12-4a5a-a137-3f87b431d758',
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

// Middleware
async function checkInTour(req, res, next) {
  const id = jwt.decode(req.cookies.jwt).id;
  const user = await User.findById(id);

  if (user.inDetour) {
    res.redirect(`/traveller/inTour/${user.detour}`);
  } else {
    next();
  }
}

module.exports = router;
