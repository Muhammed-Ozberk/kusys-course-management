require('dotenv').config();

const shared = {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'kusys',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 5432),
    dialect: 'postgres',
    timezone: '+03:00',
    seederStorage: 'sequelize'
};

module.exports = {
    development: shared,
    test: { ...shared, database: process.env.DB_NAME || 'kusys_test' },
    production: shared
};
