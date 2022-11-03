const jsonwebtoken = require("jsonwebtoken");

module.exports = function (user) {
    // TODO ver de agregar expiracion
    return jsonwebtoken.sign(user, process.env.REFRESH_TOKEN_SECRET);
}