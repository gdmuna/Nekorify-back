'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const replays = [];
    const counts = 5;
  
    for (let i = 1; i <= counts; i++) {
      const replay = {
        title: `回放标题${i}`,
        department: `部门${i}`,
        author: `作者${i}`,
        author_id: i,
        video_url: `https://video_url${i}`,
        cover_url: `https://cover_url${i}`,
        views: 0,
        status: 'published',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      replays.push(replay);
    }
  
    await queryInterface.bulkInsert('replays', replays, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('replays', null, {});
  }
};
