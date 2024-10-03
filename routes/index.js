const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const userRouter = require('./users');
const eventRouter = require('./events');

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/events', eventRouter);

module.exports = router;
