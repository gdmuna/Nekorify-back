const express = require('express');
const router = express.Router();
const permissionGuard = require('../middlewares/permissionGuard');
const articleController = require('../controllers/articleController');

// 查询接口（无需权限）
router.get('/', articleController.getAllArticles);

// 获取当前用户发布的所有文章
router.get('/self', articleController.getCurrentUserArticles);

// 查询详情接口（无需权限）
router.get('/:id', articleController.getArticleDetail);

// 新增文章（需要权限）
router.post('/', permissionGuard({ type: 'article', action: 'add', minLevel: 3 }), articleController.addArticle);

// 更新文章（需要权限）
router.put('/:id', permissionGuard({ type: 'article', action: 'update', minLevel: 3 }), articleController.updateArticle);

// 删除文章（需要权限）
router.delete('/:id', permissionGuard({ type: 'article', action: 'delete', minLevel: 3 }), articleController.deleteArticle);

module.exports = router;