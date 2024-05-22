const path = require('path'); 
const { launchesArray, saveLaunch, isLaunchExist, abortLaunchByID } = require(path.join(__dirname , '..', '..', 'models', 'launchesModel.js'));
const { getPagination } = require(path.join(__dirname, '..', '..', 'services', 'pagination.js'));

async function getAllLaunches(req , res){
    const {skip , limit} = getPagination(req.query);
    return res.status(200).json(await launchesArray(skip , limit));
}

async function setnewLaunch(req, res){
    try{
        if(!req.body.mission || !req.body.rocket || !req.body.launchDate || !req.body.target){
            return res.status(400).json({error: 'Insufficient data'});
        }
        else{
            const launch = {
                mission: req.body.mission,
                rocket: req.body.rocket,
                launchDate: new Date(req.body.launchDate),
                target: req.body.target,
            }
            if(isNaN(launch.launchDate)){
                return res.status(400).json('Wrong Date');
            };
            await saveLaunch(launch);
            return res.status(201).json(launch);
        }
    }
    catch(error){
        return res.status(400).json(`Error loading your request ${error}`);
    }
}

async function abortLaunch(req, res){
    const launchID = Number(req.params.id);
    const findlaunch = await isLaunchExist(launchID);
    if(!findlaunch){
        return res.status(404).json({error: 'Launch not found'});
    }
    else{
        return res.status(200).json(abortLaunchByID(launchID));
    }
}

module.exports={ getAllLaunches, setnewLaunch, abortLaunch };