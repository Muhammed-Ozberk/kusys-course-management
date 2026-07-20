// Importing necessary modules and models
const { randomUUID } = require('crypto');
const bcrypt = require('bcrypt');
const allModels = require("./../models"); // Loading all DB models
const Users = allModels.Users; // Assuming "Users" is a model for users

const withoutPassword = user => {
    const value = user.toJSON ? user.toJSON() : { ...user };
    delete value.password;
    return value;
};

module.exports = {
    // Handler for GET /users
    userList: async function (req, res) {
        try {
            // Fetching all users from the database
            const users = await Users.findAll();
            
            // Cleaning up unnecessary data before sending the response
            users.forEach(user => {
                delete user.dataValues.isAdmin;
                delete user.dataValues.id;
                delete user.dataValues.password;
                delete user.dataValues.createdAt;
                delete user.dataValues.updatedAt;
            });
            
            return res.status(200).json({
                status: true, error: null, data: users
            });
        } catch (error) {
            return res.status(500).json({ status: false, error: error, data: null });
        }
    },
    
    // Handler for GET /users/:id
    userDetail: async function (req, res) {
        const userID = req.params.id;
        if (!userID) {
            return res.status(400).json({ status: false, error: 'User ID is required!', data: null });
        }
        try {
            // Finding a user by studentID
            const user = await Users.findOne({ where: { studentID: userID } });
            
            if (!user) {
                return res.status(404).json({ status: false, error: 'User not found!', data: null });
            }
            
            // Responding with relevant user data
            return res.status(200).json({
                status: true, error: null, data: {
                    studentID: user.studentID,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    birthDay: user.birthDay,
                }
            });
        } catch (error) {
            return res.status(500).json({ status: false, error: error, data: null });
        }
    },
    
    // Handler for POST /users/create
    userCreate: async function (req, res) {
        const { firstName, lastName, email, password, birthDay } = req.body;
        // Admin authorization is enforced by the route middleware.
        if (!firstName || !lastName || !email || !password || !birthDay) {
            return res.status(400).json({ status: false, error: 'All fields are required!', data: null });
        }
        
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            // Creating a new user
            const user = await Users.create({
                studentID: randomUUID(),
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashedPassword,
                birthDay: birthDay,
                isAdmin: false // Assuming the created user is not an admin
            });
            
            // Responding with the created user's data
            return res.status(200).json({ status: true, error: null, data: withoutPassword(user) });
        } catch (error) {
            return res.status(500).json({ status: false, error: error, data: null });
        }
    },
    
    // Handler for POST /users/update/:id
    userUpdate: async function (req, res) {
        const userID = req.params.id;
        const { firstName, lastName, email, password, birthDay } = req.body;
        
        // Validating input data and admin authority
        if (!userID) {
            return res.status(400).json({ status: false, error: 'User ID is required!', data: null });
        }
        
        try {
            // Finding the user to be updated
            const user = await Users.findOne({ where: { studentID: userID } });
            if (!user) {
                return res.status(404).json({ status: false, error: 'User not found!', data: null });
            }
            
            // Updating user data
            const updates = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                birthDay: birthDay,
            };
            if (password) {
                updates.password = await bcrypt.hash(password, 10);
            }
            await user.update(updates);
            
            // Responding with the updated user's data
            return res.status(200).json({ status: true, error: null, data: withoutPassword(user) });
        } catch (error) {
            return res.status(500).json({ status: false, error: error, data: null });
        }
    },
    
    // Handler for DELETE /users/:id
    userDelete: async function (req, res) {
        const userID = req.params.id;
        
        // Validating user ID and admin authority
        if (!userID) {
            return res.status(400).json({ status: false, error: 'User ID is required!', data: null });
        }
        
        try {
            // Finding the user to be deleted
            const user = await Users.findOne({ where: { studentID: userID } });
            if (!user) {
                return res.status(404).json({ status: false, error: 'User not found!', data: null });
            }
            
            // Deleting the user
            await user.destroy();
            
            // Responding with the deleted user's data
            return res.status(200).json({ status: true, error: null, data: withoutPassword(user) });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: false, error: error, data: null });
        }
    }
}
