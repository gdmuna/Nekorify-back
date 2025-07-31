const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController.js');


/**
 * @description 文章相关路由
 * @module routes/article
 */

// 获取所有文章列表
router.get('/', articleController.getAllArticles);

// 获取指定ID的文章详情
router.get('/:id', articleController.getArticleDetail);

// 更新指定ID的文章
router.put('/:id', articleController.updateArticle);

// 删除指定ID的文章
router.delete('/:id', articleController.deleteArticle);

// 新增文章
router.post('/', articleController.addArticle);

module.exports = router;