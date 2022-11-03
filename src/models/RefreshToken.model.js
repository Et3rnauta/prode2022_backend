const mongoose = require("mongoose");

const RefreshTokenSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    refreshToken: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);

module.exports = RefreshToken;
