const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
    {
        FirstName: {
            type: String,
            require: true,
            min: 6,
            max: 255,
        },
        LastName: {
            type: String,
            require: true,
            min: 6,
            max: 255,
        },
        Email: {
            type: String,
            require: true,
            min: 6,
            max: 255,
        },
        Password: {
            type: String,
            require: true,
            min: 6,
            max: 255,
        },
        ConfirmPassword: {
            type: String,
            require: true,
            min: 6,
            max: 255,
        },
        CreatedDate: {
            type: Date,
            default: Date.now,
        },
    },
    { versionKey: false }
);

module.exports = mongoose.model("users", ProductSchema);
