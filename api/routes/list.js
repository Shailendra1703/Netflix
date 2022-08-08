const router = require("express").Router();
const List = require("../modals/list");
const verify = require("../verifyToken");

//create

router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newList = new List(req.body);
    try {
      const addedList = await newList.save();
      res.status(200).json(addedList);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("You are Not allowed");
  }
});

//delete
router.delete("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await List.findByIdAndDelete(req.params.id);
      res.status(200).json("Deleted Succesfully");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("You are Not allowed");
  }
});

//get

router.get("/", verify, async (req, res) => {
  const typeQuery = req.body.type;
  const genreQuery = req.body.genre;
  let list = [];
  try {
    if (typeQuery) {
      if (genreQuery) {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery, genre: genreQuery } },
        ]);
      } else {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery } },
        ]);
      }
    } else {
      list = await List.aggregate([{ $sample: { size: 10 } }]);
    }
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
