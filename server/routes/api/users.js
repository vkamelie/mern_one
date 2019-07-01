const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const { check, validationResult } = require("express-validator");

// bring in user model
const User = require("../../../models/User");
const Sectoken = process.env.jwtSecret;
//@route POST api/users
//#@desc Register user
//@access public
router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Needs to be valid email").isEmail(),
    check(
      "password",
      "Needs to be password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    try {
      //see if user exists
      let user = await User.findOne({ email: email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      //get users gravatar

      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });

      //create user but doesn't save it
      user = new User({
        name,
        email,
        avatar,
        password
      });

      //encrypt password

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      //anything that returns a promise use await
      await user.save();

      //return jsonwebtoken

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(payload, Sectoken, (err, token) => {
        console.log(token);
        if (err) throw err;
        res.json({ token });
      });

      res.send("user registered");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("sever error");
    }
  }
);

module.exports = router;
