// Importing necessary modules
const config = require('../config/config'); // Importing the configuration containing JWT secret key
const jwt = require('jsonwebtoken'); // Importing the JWT library

// Middleware function for JWT authentication
module.exports = (req, res, next) => {
    const authorization = req.headers.authorization;

    // Checking if the token is missing
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({
            status: false,
            error: 'Token not found',
            data: null
        });
    } else {
        const token = authorization.slice(7);

        // Verifying the token using the secret key from the config
        jwt.verify(token, config.jwt.secretKey, (err, decoded) => {
            if (err) {
                // Responding with an error if the token is not valid
                return res.status(401).json({
                    status: false,
                    error: 'Token not valid',
                    data: null
                });
            } else {
                // Attaching the decoded token payload to the request object
                req.decoded = decoded;
                return next(); // Allowing the request to proceed to the next middleware or route handler
            }
        });
    }
};
