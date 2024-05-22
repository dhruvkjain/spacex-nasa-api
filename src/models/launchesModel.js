const path = require('path');
const launches = require(path.join(__dirname , "mongo_launches.js"));
const planets = require(path.join(__dirname , "mongo_planets.js"));

const DEFAULT_FLIGHT_NUMBER = 1000;

async function getLatestFlightNumber(){
    const latestLaunch = await launches
    .findOne()
    .sort('-flightNumber');

    if(!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}

async function saveLaunch(launch){
    const planet = await planets.findOne({
        kepler_name: launch.target 
    });

    if(!planet){
        throw new Error('No matching planets found');
    }

    let latestFlightNumber = Number(await getLatestFlightNumber())+1 ;

    Object.assign(launch , {
        flightNumber: latestFlightNumber,
        upcoming: true,
        success: true,
        customers: ["A", "B", "C"],
    });

    await launches.findOneAndUpdate(
        {flightNumber: launch.flightNumber}, 
        launch,
        {upsert: true}
    )
}

// let launches = new Map();

// let latestFlightNumber = 100;
// let launchesarray ;
// let example = {
//     flightNumber: 100,
//     mission: 'Kepler Mission Exploration X',
//     rocket: 'Explorer IS1',
//     launchDate: new Date('December 27, 2030'),
//     target: 'Kepler-442 b',
//     upcoming: true,
//     success: true,
//     customers: ["A", "B", "C"]
// };

// launches.set(example.flightNumber, example);

// function addNewLaunch(launch){
//     latestFlightNumber ++;
//     Object.assign(launch , {
//         flightNumber: latestFlightNumber,
//         upcoming: true,
//         success: true,
//         customers: ["A", "B", "C"],
//     });
//     launches.set(latestFlightNumber , launch);
//     launchesarray = [...launches.values()];
// };

async function isLaunchExist(id){
    return await launches.findOne({flightNumber: id});
    // return launches.has(id);
};

async function abortLaunchByID(id){
    // const abort = launches.get(id);
    // abort.upcoming = false;
    // abort.success = false;
    // return id;

    const aborted = await launches.updateOne(
        {flightNumber: id},
        {upcoming: false , success: false}
    )
    if(aborted.ok === 1 && aborted.nModified === 1)
        return id;
    else
        return `aborted.ok = ${aborted.ok} and aborted.nModified = ${aborted.nModified}` ;
};

async function launchesArray(skip , limit){
    // launchesarray = [...launches.values()];
    // return launchesarray;
    return await launches
    .find({} , {'_id':0 , '__v':0})
    .sort({flightNumber: 1})
    .skip(skip)
    .limit(limit);
}




const SPACEX_API = 'https://api.spacexdata.com/v5/launches/query';

async function loadSpaceXData(){

    const check = await launches.findOne({
        flightNumber: 1,
        mission: 'FalconSat',
        rocket: 'Falcon 1',
    })

    if(check){
        console.log('SpaceX Data already loaded')
        return;
    }

    console.log('Downloading  Data .....')
    const request = await fetch(SPACEX_API , {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
                query: {},
                options: {
                    pagination: false ,
                    populate: [
                        {
                            path: 'rocket',
                            select: {
                                name: 1
                            }
                        },
                        {
                            path: 'payloads',
                            select: {
                                customers: 1
                            }
                        }
                    ]
                }
            })
    })
    if(response.status !== 200){
        throw new Error('SpaceX API launches data cant be uploaded');
    }
    const response = await request.json();
    for (const ele of response.docs){

        const payload = ele.payloads;
        const customers = payload.flatMap((cust)=>{
            return cust.customers
        });
        
        const launch = {
            flightNumber: ele.flight_number,
            mission: ele.name,
            rocket: ele.rocket.name,
            launchDate: ele.date_local,
            upcoming: ele.upcoming,
            success: ele.success,
            customers: customers
        }
        // console.log(launch);
        await launches.findOneAndUpdate(
            {flightNumber: launch.flightNumber}, 
            launch,
            {upsert: true}
        )
    }
}

module.exports = { 
    launchesArray, 
    saveLaunch, 
    isLaunchExist, 
    abortLaunchByID , 
    loadSpaceXData 
}
