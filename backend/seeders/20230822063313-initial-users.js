'use strict';

const bcrypt = require('bcrypt');

/** 
 * This script is a Sequelize migration.
 * It defines how to insert initial user data into the 'Users' table and how to roll it back.
 * @type {import('sequelize-cli').Migration} 
 */
module.exports = {
  // The 'up' function defines how to insert initial user data into the 'Users' table
  async up(queryInterface, Sequelize) {
    const password = await bcrypt.hash('1234', 10);
    await queryInterface.bulkInsert('Users', [
      // Inserting predefined user records
      {
        studentID: 'e3e4c79c-079f-43b0-8a17-6a7501537e75',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password,
        birthDay: '1999-01-01',
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        studentID: 'ff3507ac-5b9c-4429-bcbb-e677db51ad02',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        password,
        birthDay: '1999-01-01',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        studentID: '897586e8-8f54-45b2-acbc-8a3f9ac2bb74',
        firstName: 'James',
        lastName: 'Doe',
        email: 'james@example.com',
        password,
        birthDay: '1999-01-01',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        studentID: 'aeb75ef4-bd7e-4f35-b9a8-4bf8d7e8d21f',
        firstName: 'Janet',
        lastName: 'Doe',
        email: 'janet@example.com',
        password,
        birthDay: '1999-01-01',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        studentID: 'b8ed6614-895a-4c9d-95b9-cbd22c59bd48',
        firstName: 'Judy',
        lastName: 'Doe',
        email: 'judy@example.com',
        password,
        birthDay: '1999-01-01',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        studentID: '89c32fec-c4a4-4eba-a557-9cd2ce72f529',
        firstName: 'Jill',
        lastName: 'Doe',
        email: 'jill@example.com',
        password,
        birthDay: '1999-01-01',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        studentID: '47b1aa59-d476-4b24-a2e7-96c5a3a1bfad',
        firstName: 'Jack',
        lastName: 'Doe',
        email: 'jack@example.com',
        password,
        birthDay: '1999-01-01',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        studentID: 'aae330b3-d467-401f-b1be-7fc7730cd97b',
        firstName: 'Jenny',
        lastName: 'Doe',
        email: 'jenny@example.com',
        password,
        birthDay: '1999-01-01',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }

    ], {});

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
//npx sequelize-cli seed:generate --name initial-users 
//npx sequelize-cli --config=config/database.js db:seed:all
