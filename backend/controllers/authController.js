// Importing necessary modules
const config = require('../config/config'); // Importing configuration settings
const jwt = require('jsonwebtoken'); // Importing the JWT module
const bcrypt = require('bcrypt');

// Importing DB Models
const allModels = require("./../models"); // Loading all DB models
const Users = allModels.Users; // Assuming "Users" is a model for user data

module.exports = {

    // Handler for POST /login
    login: async function (req, res) {
        const { email, password } = req.body; // Extracting email and password from request body

        // Checking if email and password are provided
        if (!email) {
            return res.status(400).json({ status: false, error: 'Email is required!', data: null });
        }
        if (!password) {
            return res.status(400).json({ status: false, error: 'Password is required!', data: null });
        }

        try {
            // Finding a user with the provided email
            const user = await Users.findOne({ where: { email: email } });
            
            // If user doesn't exist
            if (!user) {
                return res.status(400).json({ status: false, error: 'User not found!', data: null });
            }

            // If password matches
            if (await bcrypt.compare(password, user.password)) {
                // Creating a JWT token
                const token = jwt.sign({ id: user.studentID, isAdmin: user.isAdmin }, config.jwt.secretKey, config.jwt.options);
                
                const safeUser = user.toJSON ? user.toJSON() : { ...user };
                delete safeUser.password;

                // Responding with token and user data
                return res.status(200).json({ status: true, error: null, data: { token: token, user: safeUser } });
            } else {
                // Password is incorrect
                return res.status(400).json({ status: false, error: 'Password is incorrect!', data: null });
            }

        } catch (error) {
            // Internal server error
            return res.status(500).json({ status: false, error: error, data: null });
        }
    }
    // POST /login handler ends here
}
