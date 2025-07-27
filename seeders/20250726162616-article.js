'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  const articles = [];
  const counts = 5;

  for (let i = 1; i <= counts; i++) {
    const article = {
      author_id: i,
      title: `文章标题${i}`,
      cover_url: `https://cover${i}`,
      author: `作者${i}`,
      department: `部门${i}`,
      text_md_url: `https://article${i}.md`,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    articles.push(article);
  }

  await queryInterface.bulkInsert('articles', articles, {});
},

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('articles', null, {});
  }
};
