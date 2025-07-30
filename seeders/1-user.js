'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        stu_id: '20251111000',
        name: '爱莉希雅',
        sso_id: 'uuid-1',
        last_signin_time: new Date(),
        is_frozen: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        stu_id: '20251207000',
        name: '琪亚娜',
        sso_id: 'uuid-2',
        last_signin_time: new Date(),
        is_frozen: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        stu_id: '20250413000',
        name: '芽衣',
        sso_id: 'uuid-3',
        last_signin_time: new Date(),
        is_frozen: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        stu_id: '20250818000',
        name: '布洛妮娅',
        sso_id: 'uuid-4',
        last_signin_time: new Date(),
        is_frozen: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        stu_id: '20251018000',
        name: '希儿',
        sso_id: 'uuid-5',
        last_signin_time: new Date(),
        is_frozen: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
