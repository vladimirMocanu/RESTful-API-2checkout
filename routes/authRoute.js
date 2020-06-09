const router = require("express").Router();
const User = require("../models/User");
const Token = require("../models/Token");
const bcrypt = require("bcryptjs");
const jsonWebToken = require("jsonwebtoken");
const verifyToken = require("../tokenValidation");
const { registerValidation, loginValidation } = require("../userValidation");

//Get all users (optional)
router.get("/", verifyToken, async (req, res) => {
    try {
        const getProducts = await User.find();
        res.json(getProducts);
    } catch (err) {
        res.status(400).json({ message: err });
    }
});
//Register new user
router.post("/register", async (req, res) => {
    //Validate date
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //checking if the user is exist
    const userNameExist = await User.findOne({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
    });
    if (userNameExist) return res.status(400).send("User name exist");

    const userEmailExist = await User.findOne({
        Email: req.body.Email,
    });
    if (userEmailExist) return res.status(400).send("User email exist");

    //Encrypt password
    const encryptPassword = await bcrypt.hash(
        req.body.Password,
        await bcrypt.genSalt(10)
    );

    //Create/add new user
    const user = new User({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Email: req.body.Email,
        Password: encryptPassword,
    });
    try {
        const newUser = await user.save();
        res.send({ user: user._id });
    } catch (err) {
        res.status(400).send(err);
    }
});
//Login user
router.post("/login", async (req, res) => {
    //Validate date
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //checking if the email exist
    const user = await User.findOne({
        Email: req.body.Email,
    });
    if (!user) return res.status(400).send("Email or password is wrong");

    //Checking if the password is correct
    const validPassword = await bcrypt.compare(
        req.body.Password,
        user.Password
    );
    if (!validPassword)
        return res.status(400).send("Email or password is wrong");

    //Create token
    const accessToken = jsonWebToken.sign(
        { _id: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10m" }
    );
    //Create refresh token
    const refreshToken = jsonWebToken.sign(
        { _id: user._id },
        process.env.REFRESH_TOKEN_SECRET
    );

    //Add refreshToken to DB
    const token1 = new Token({
        idUser: user._id,
        token: refreshToken,
    });
    try {
        const token2 = await token1.save();
    } catch (err) {
        res.status(400).send(err);
    }
    //Send response => accestoken and refreshToken
    res.header("Authorization", accessToken).send({
        accessToken: accessToken,
        refreshToken: refreshToken,
    });
});

//Generate new accessToken with refreshToken from DB
router.post("/token", async (req, res) => {
    const refreshToken = req.body.token;
    //Check is refresh token exist
    if (refreshToken == null) return res.sendStatus(401);
    const refreshTokenDB = await Token.findOne({
        token: refreshToken,
    });
    if (!refreshTokenDB) return res.status(400).send("RefreshToken is wrong");

    //Try to create a new accessToken
    //Create new token
    const accessToken = jsonWebToken.sign(
        { _id: refreshTokenDB.idUser },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10m" }
    );

    //Send token
    res.send({ accessToken: accessToken });
});

//Delete refreshtoken from DB => logout user
router.delete("/logout", async (req, res) => {
    try {
        const deleteRefreshToken = await Token.deleteOne({
            token: req.body.token,
        });
        res.sendStatus(204).send("Logout successfully");
    } catch (err) {
        res.sendStatus(401);
    }
});

module.exports = router;
