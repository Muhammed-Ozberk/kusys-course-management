require('dotenv').config();

module.exports = {
    jwt: {
        secretKey: process.env.JWT_SECRET || 'development-only-secret-change-me',
        options: {
            expiresIn: process.env.JWT_EXPIRES_IN || '1h'
        }
    }
};
