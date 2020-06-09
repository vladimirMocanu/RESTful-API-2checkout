const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
    {
        Name: {
            type: String,
            min: 6,
            max: 255,
            require: true,
        },
        Price: {
            type: Number,
            require: true,
        },
        Category: {
            type: String,
            min: 6,
            max: 255,
            require: true,
        },
        CreatedDate: {
            type: Date,
            default: Date.now,
        },
        UpdatedDate: {
            type: Date,
            default: Date.now,
        },
    },
    { versionKey: false }
);

module.exports = mongoose.model("products", ProductSchema);
