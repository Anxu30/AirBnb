const express = require('express');
const errorRouter = express.Router();
const { errorHome } = require('../controller/errorController');

errorRouter.use('/', errorHome);

module.exports = errorRouter;