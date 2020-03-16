const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../data/config");

const router = express.Router();

const saltRounds = 12;

router.post("/register", async (req, res, next) => {
  try {
    const user = req.body;
    const username = user.username;
    const password = user.password;

    if (user && username && password) {
      user.password = await bcrypt.hash(password, saltRounds);
      const [id] = await db("users").insert(user);
    }  else {
        res.status(400).json({ message: "missing required fields"})
    }

    res.json({ message: `Succesfully signed up with username ${user.username}`});
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
    try {   
        const { username, password } = req.body
        const user = await db("users").where("username", username).first()
        const passwordCheck = await bcrypt.compare(password, user.password)

        if( user && passwordCheck ) {
            res.status(200).json({
                message: `Welcome ${user.username}`
            })
        } else {
            res.status(400).json({
                message: "Invalid Credentials"
            })
        }
    } catch (error) {
        next(error)
    }
})
module.exports = router