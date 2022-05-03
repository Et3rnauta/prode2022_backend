const mongoose = require('mongoose');
const RefreshToken = require('../models/RefreshToken.model');

module.exports.refresh_token_exists = async function (refreshToken) {
    const query = await RefreshToken.findOne({ refreshToken }).exec()
        .catch((error) => {
            if (error.name === "CastError") {
                throw { number: 403 }
            } else {
                throw { content: error }
            }
        });
        
    return query === null;
}

module.exports.refresh_token_post = async function (refreshToken) {
    let data = {
        _id: new mongoose.Types.ObjectId,
        refreshToken,
    }

    const newRefreshToken = await RefreshToken.create(data)
        .catch((error) => {
            return { content: error }
        });
    return newRefreshToken;
}

module.exports.refresh_token_delete = async function (refreshToken) {
    const answer = await RefreshToken.deleteOne({ refreshToken }).exec()
        .catch((error) => {
            if (error.name === "CastError") {
                throw { number: 403 }
            } else {
                throw { content: error }
            }
        });

    return answer.deletedCount === 1;
}