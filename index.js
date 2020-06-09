const rateLimit = require("express-rate-limit");
const app = require("express")();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
//Import Routes
const productRoute = require("./routes/productRoute");
const authRoute = require("./routes/authRoute");
require("dotenv/config");

//Listening
app.listen(3000, () => console.log("Server up and running"));

//Connect to DB
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("Connect to DB")
);

//Define rate limit
const rateLimiterUsingThirdParty = rateLimit({
    windowMs: 60 * 1000, // 1 min in milliseconds
    max: 100, //max 100 requests
    message: "You have exceeded the 100 requests in 1 min limit!",
    headers: true,
});

//Use ratelimit
app.use(rateLimiterUsingThirdParty);

//BodyParser
app.use(bodyParser.json());

//Import Routes
app.use("/product", productRoute);
app.use("/user", authRoute);
