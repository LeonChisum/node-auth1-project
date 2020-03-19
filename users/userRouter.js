const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../data/config");

// custom middleware
// const protected = require('../middleware/protected')

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
          console.log(req.session)
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

router.get('/users', protected, async (req, res, next) => {
  try {
    console.log(req.session)
    const users = await db('users').select("username")
    res.status(200).json(users)
  } catch (error) {
    next(error)
  }
})

function protected(req, res, next) {
  if (!req.session && !req.session.userID) {
    res.status(401).json({ message: 'you shall not pass!'})
  } else {
      next()
  }
}
module.exports = router