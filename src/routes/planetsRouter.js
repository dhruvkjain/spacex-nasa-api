const express = require('express');
const path = require('path');
const { getAllPlanets } = require(path.join(__dirname , 'controllers', 'planetsController.js'));

const planetsRouter = express.Router();
// planetsRouter.use((req,res,next)=>{
//     console.log('ip address : ' , req.ip);
//     next();
// })
planetsRouter.get('/',getAllPlanets);


module.exports = { planetsRouter };