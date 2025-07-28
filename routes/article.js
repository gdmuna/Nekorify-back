const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController.js');

/**
 * @description 文章路由
 * @module routes/article
 */

router.get('/',articleController.getAllArticles);
router.put('/:id',articleController.updateArticle);

module.exports = router;