const express = require('express');
const hostRouter = express.Router();
const { getHome, postHome, hostHomes,hostEditHome,hosteditHome, hostdelHome} = require('../controller/hostController');


hostRouter.get('/host/editHome', getHome);
hostRouter.post('/host/editHome', postHome);
hostRouter.get('/hosthomes', hostHomes);
hostRouter.get('/editHome/:editId', hosteditHome);
hostRouter.post('/host/editHome/:editId', hostEditHome);
hostRouter.get('/deleteHome/:editId', hostdelHome);


module.exports = hostRouter;   