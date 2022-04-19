/**
 * For logging access
 */
 module.exports = (req, res, next) => {
    console.log("-> Se llama", req.method, "::", req.url);
    next();
}