'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface) {
    const [users] = await queryInterface.sequelize.query(
      'SELECT "id", "password" FROM "Users"'
    );

    for (const user of users) {
      if (user.password && !user.password.startsWith('$2')) {
        const password = await bcrypt.hash(user.password, 10);
        await queryInterface.bulkUpdate('Users', { password }, { id: user.id });
      }
    }
  },

  async down() {
    // Password hashes cannot be safely converted back to plaintext.
  }
};
