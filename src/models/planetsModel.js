const path = require('path');
const fs = require('fs');
const { parse } = require('csv-parse');

const planets = require(path.join(__dirname , "mongo_planets.js"));

const parser = parse({
    comment: "#" , 
    columns: true
});

const habitable = [];
const isHabitable = (planet) =>{
    if( planet['koi_disposition'] == 'CONFIRMED'
            && planet['koi_insol'] > 0.36 
            && planet['koi_insol'] < 1.11
            && planet['koi_prad'] < 1.6 ){
                return true;
            }
    else
    return false;
}

function loadPlanetsData(){
    return new Promise((resolve, reject)=>{
        fs.createReadStream(path.join(__dirname , 'kepler-data.csv'))
            .pipe(parser)
            .on('data',async (data)=>{
                if(isHabitable(data) == true){
                    // habitable.push(data);
                    try{
                        await planets.updateOne(
                            {kepler_name : data.kepler_name} ,
                            {kepler_name : data.kepler_name} ,
                            {upsert: true}
                        );
                    }
                    catch (err){
                        console.error(`Could not save Planet : ${err}`);
                    }
                }
            })
            .on('error',(err)=>{
                console.log(err);
                reject(err);
            })
            .on('end',async()=>{
                // console.log(habitable.map((planet)=>{
                //     return(planet);
                // }));
                console.log(`Total ${(await getAllPlanetsfromDB()).length} habitable planets were found by KEPLER.`);
                resolve();
            })
    })
}

async function getAllPlanetsfromDB(){
    return await planets.find({},{
        '_id':0 , '__v':0
    });
}

module.exports = { 
    loadPlanetsData, 
    planets:habitable, 
    getAllPlanetsfromDB 
}