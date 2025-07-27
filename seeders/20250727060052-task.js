'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tasks = [];
    const counts = 5;
  
    for (let i = 1; i <= counts; i++) {
      const task = {
        title: `任务${i}`,
        text: `任务内容${i}`,
        publisher: `发布者${i}`,
        executor: `执行者${i}`,
        start_time: new Date(),
        ddl: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      tasks.push(task);
    }
  
    await queryInterface.bulkInsert('tasks', tasks, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tasks', null, {});
  }
};
