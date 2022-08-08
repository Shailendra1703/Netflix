const router = require("express").Router();
const User = require("../modals/user");
const Verify = require("../verifyToken");
const cryptoJS = require("crypto-js");

//update

router.put("/:id", Verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString();
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          //update the body
          $set: req.body,
        },
        { new: true } //to send the updated data
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json("You can Update only your account");
    }
  }
});

//delete
router.delete("/:id", Verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User Has been Deleted");
    } catch (err) {
      res.status(500).json("You can delete only your account");
    }
  }
});

//get
router.get("/find/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...info } = user._doc;
    res.status(200).json(info);
  } catch (err) {
    res.status(500).json("User not exist");
  }
});

//get all
router.get("/", Verify, async (req, res) => {
  //to see only new users we are using a query
  const query = req.query.new;
  if (req.user.isAdmin) {
    try {
      const users = query
        ? await User.find().sort({ _id: -1 }).limit(2)
        : await User.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(500).json("You Are not allowed to See all Users");
  }
});

//get user stats

router.get("/stats", Verify, async (req, res) => {
  const today = new Date();
  const lastYear = today.getFullYear(today.getFullYear() - 1);

  if (req.user.isAdmin) {
    try {
      const data = await User.aggregate([
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("You are not authenticated");
  }
});

module.exports = router;
