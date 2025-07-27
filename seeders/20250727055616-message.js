'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const messages = [];
    const counts = 5;
  
    for (let i = 1; i <= counts; i++) {
      const message = {
        id: i,
        text: `消息${i}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      messages.push(message);
    }
  
    await queryInterface.bulkInsert('messages', messages, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('messages', null, {});
  }
};
