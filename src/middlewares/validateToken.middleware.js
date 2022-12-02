const jsonwebtoken = require("jsonwebtoken");

/**
 * For validating tokens
 */
module.exports = (req, res, next) => {
    console.log("validar", req.path)
    const nonSecurePaths = ['/', '/login', '/token', '/logout', '/test'];
    if (nonSecurePaths.includes(req.path)) return next();

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    // if (token == process.env.MASTER_TOKEN) next();
    else {
        jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        })
    }
}