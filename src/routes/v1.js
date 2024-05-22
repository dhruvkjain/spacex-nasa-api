const express = require('express');
const path = require('path');

const { planetsRouter } = require(path.join(__dirname , 'planetsRouter.js'));
const { launchesRouter } = require(path.join(__dirname , 'launchesRouter.js'));

const v1 = express.Router();
v1.use('/planets', planetsRouter);
v1.use('/launches', launchesRouter);

module.exports = { v1 }