const express = require("express");
const router = express.Router();
const usersRoutes = require("./api/users");
// const authRoutes = require("./api/oath");


router.use("/api/users", usersRoutes);
// router.use("/api/callback", authRoutes);

module.exports = router;