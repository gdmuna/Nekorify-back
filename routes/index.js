const express = require('express');
const router = express.Router();
const usersRouter = require('./users');
const authRouter = require('./auth');
const articleRouter = require('./article');

router.use('/users', usersRouter);
router.use('/auth', authRouter);
router.use('/article', articleRouter);


module.exports = router;
