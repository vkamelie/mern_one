const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/auth");
const User = require("../../../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

//@route GET api/auth
//#@desc test route
//@access public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@router post api/auth
// @desc authenticate user & user
//@access public

router.post(
  "/",
  [
    check("email", "please include a valid email").isEmail(),
    check("password", "password is required").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      //see if user exits
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "invalid credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "invalid credentials" }] });
      }

      //return jsonwebtoken

      const payload = {
        user: {
          id: user.id
        }
      };
      jwt.sign(payload, JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.msg);
      res.status(500).send("server error");
    }
  }
);

module.exports = router;
