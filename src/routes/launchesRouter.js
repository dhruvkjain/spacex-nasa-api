const express = require('express');
const path = require('path');
const { getAllLaunches, setnewLaunch, abortLaunch } = require(path.join(__dirname , 'controllers', 'launchesController.js'));

const launchesRouter = express.Router();

launchesRouter.get('/',getAllLaunches);
launchesRouter.post('/', setnewLaunch);
launchesRouter.delete('/:id', abortLaunch);

module.exports = { launchesRouter };