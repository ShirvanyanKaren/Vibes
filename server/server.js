const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
var jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const { authMiddleware } = require("./utils/auth");
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
  console.log(req.query)
  // var token = jwt.sign(req.query, process.env.CONSUMER_SECRET)
  // console.log(token)
  
  res.redirect(`http://localhost:8000/user_token?verifier=${req.query.oauth_verifier}`)
})

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