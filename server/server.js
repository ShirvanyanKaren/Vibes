const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
var jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const authMiddleware  = require("./utils/auth");
const path = require("path");
const axios = require("axios")

const PORT = process.env.PORT || 8080;

const router = require("./controllers/index.js");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());



app.use(router);
console.log("one")



app.get("/callback", (req,res)=>{
  let username = req.query
  const token = jwt.sign({username}, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRATION,
  });
  res.clearCookie('token')
  res.cookie('token', token)
  console.log(token)
  res.redirect(`http://localhost:3000/evolutions`)
})

app.get("/", (req, res) => {
  console.log("hello")
}
);

if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
  });
}

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log(`starting on port ${PORT}`);
  app.listen(PORT);
});