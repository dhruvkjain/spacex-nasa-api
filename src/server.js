const http = require('http');
const path = require('path');

const { loadPlanetsData } = require(path.join(__dirname, 'models', 'planetsModel.js' ));
const { loadSpaceXData } = require(path.join(__dirname, 'models', 'launchesModel.js' ));
const { app } = require(path.join(__dirname , 'app'));
const { connectToMongo } = require(path.join(__dirname, 'services', 'mongo.js'));

const server = http.createServer(app);

async function loadData(){
    
    await connectToMongo();
    
    await loadPlanetsData();
    await loadSpaceXData();

    const PORT = process.env.PORT || 3000;
    server.listen(PORT , ()=>{
        console.log(`Listening on port ${PORT}`);
    })
}
loadData();