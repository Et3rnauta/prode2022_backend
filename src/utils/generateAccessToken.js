const jsonwebtoken = require("jsonwebtoken");

module.exports = function (user) {
    return jsonwebtoken.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '40s' });
    // return jsonwebtoken.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
}