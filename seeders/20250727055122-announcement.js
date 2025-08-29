'use strict';

const { text } = require('express');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const announcements = [];
    const counts = 5;
  
    for (let i = 1; i <= counts; i++) {
      const announcement = {
        title: `公告标题${i}`,
        cover_url: `https://cover_url${i}`,
        author_id: i,
        author: `作者${i}`,
        department: `部门${i}`,
        text_md_url: `https://text_md_url${i}`,
        views: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      announcements.push(announcement);
    }
  
    await queryInterface.bulkInsert('announcements', announcements, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('announcements', null, {});
  }
};
