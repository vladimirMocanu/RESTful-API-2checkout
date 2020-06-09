const mongoose = require("mongoose");

const TokenSchema = mongoose.Schema(
    {
        idUser: {
            type: String,
            require: true,
        },
        token: {
            type: String,
            require: true,
        },
    },
    { versionKey: false }
);

module.exports = mongoose.model("refershtokens", TokenSchema);
