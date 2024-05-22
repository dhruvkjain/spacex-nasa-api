const path = require('path');
const { planets , getAllPlanetsfromDB } = require(path.join(__dirname , '..', '..', 'models', 'planetsModel.js'));

async function getAllPlanets(req , res){
    // return res.status(200).json(planets);
    return res.status(200).json(await getAllPlanetsfromDB());
}

module.exports = {getAllPlanets};