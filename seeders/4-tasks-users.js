'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tasks_users', [
      {
        task_id: 1,
        executor_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        task_id: 2,
        executor_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
            {
        task_id: 3,
        executor_id: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        task_id: 4,
        executor_id: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        task_id: 5,
        executor_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tasks_users', null, {});
  }
};