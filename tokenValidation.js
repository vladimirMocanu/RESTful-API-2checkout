const jsonWebToken = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("./models/User");

////Function used for validation token
module.exports = function (req, res, next) {
    const token = req.header("Authorization");
    //We use Baerer Auth (use in postman)
    var token1 = token.replace("Bearer ", "");
    if (!token1) return res.status(401).send("Token doesn`t exist");

    try {
        const verifyToken = jsonWebToken.verify(
            token1,
            process.env.ACCESS_TOKEN_SECRET
        );
        req.user = verifyToken;
        next();
    } catch (err) {
        res.status(400).send("Invalid token");
    }
};
