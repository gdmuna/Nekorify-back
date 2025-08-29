const express = require('express');
const router = express.Router();
const usersRouter = require('./users');
const authRouter = require('./auth');
const articleRouter = require('./article');
const announcementRouter = require('./announcement');
const taskRouter = require('./task');
const replayRouter = require('./replay');
const scheduleRouter = require('./schedule');
const messageRouter = require('./message');
const uploadRouter = require('./upload');

router.use('/users', usersRouter);
router.use('/auth', authRouter);3333
router.use('/article', articleRouter);
router.use('/announcement', announcementRouter);
router.use('/task', taskRouter);
router.use('/replay', replayRouter);
router.use('/schedule', scheduleRouter);
router.use('/message', messageRouter);
router.use('/upload', uploadRouter);


module.exports = router;
