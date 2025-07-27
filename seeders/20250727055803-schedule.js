'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const schedules = [];
    const counts = 5;
  
    for (let i = 1; i <= counts; i++) {
      const schedule = {
        year: 2025,
        month: `${i}`,
        day: `${i+1}`,
        time: `${i}:00:00`,
        department: `部门${i}`,
        Plan: `计划${i}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      schedules.push(schedule);
    }
  
    await queryInterface.bulkInsert('schedules', schedules, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('schedules', null, {});
  }
};
