const mongoose = require('mongoose');

mongoose.connection.on('error', err => {
    console.error(err);
});

async function connectToMongo(){
    await mongoose.connect(process.env.MONGO_URL,{})
    .catch(err => console.log(err))
    .then(()=>console.log("Connected to MongoDB"));
}

async function disconnectToMongo(){
    await mongoose.disconnect()
    .catch(err => console.log(err))
}

module.exports = {connectToMongo , disconnectToMongo}