const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

const protect = (req, res, next) => {
    try {

        // get token from header
        const token = req.headers.authorization;

        if (!token) {
            // return res.status(401).json({
            //     message: "No token provided"
            // });
            throw new ApiError(401, "No token provided");
        }

        // remove Bearer from token
        const actualToken = token.split(" ")[1];

        // verify token
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

        // save user id in request
        req.user = decoded;

        next();

    } catch (error) {
        // return res.status(401).json({
        //     message: "Invalid token"
        // });
        throw new ApiError(401, "Invalid token");
    }
};

module.exports = protect;