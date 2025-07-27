'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const user_message_statuses = [];
    const counts = 5;
  
    for (let i = 1; i <= counts; i++) {
      const user_message_status = {
        user_id: i,
        message_id: i,
        is_read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      user_message_statuses.push(user_message_status);
    }
  
    await queryInterface.bulkInsert('user_message_statuses', user_message_statuses, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_message_statuses', null, {});
  }
};
