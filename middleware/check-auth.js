const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next();
    }
    try {
        const token = req.headers.authorization.slipt(" ")[1];
        if (!token) {
            const error = new HttpError("Authentication failed!");
            throw new Error(error);
        }

        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        req.userData = {userId: decodedToken.userId};
        next();
    } catch (err) {
        const error = new HttpError("Authentication failed!", 403);
        return next(error);
    }
    
}