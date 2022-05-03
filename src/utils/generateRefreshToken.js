const jsonwebtoken = require("jsonwebtoken");

module.exports = function (user) {
    return jsonwebtoken.sign(user, process.env.REFRESH_TOKEN_SECRET);
}