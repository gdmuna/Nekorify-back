const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController.js');

router.get('/',articleController.getAllArticles);
router.put('/:id',articleController.updateArticle);

module.exports = router;