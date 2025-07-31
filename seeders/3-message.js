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
        sender_id: i,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      messages.push(message);
    }
    // 加入一条特殊消息
    messages.push({
      id: counts + 1,
      text: 'doro！欧润吉！',
      sender_id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await queryInterface.bulkInsert('messages', messages, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('messages', null, {});
  }
};
