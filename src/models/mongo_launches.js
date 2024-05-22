const mongoose = require('mongoose');

const launcheSchema = new mongoose.Schema({
    flightNumber: { 
        type: Number, 
        required:true
    },
    mission: { 
        type: String, 
        required:true
    },
    rocket: { 
        type: String, 
        required:true
    },
    launchDate: { 
        type: Date, 
        required:true
    },
    target: { 
        type: String,
    },
    upcoming: { 
        type: Boolean,
        required:true
    },
    success: { 
        type: Boolean,
        default: true,
        required:true
    },
    customers: [String]
})

module.exports = mongoose.model('Launch', launcheSchema) ;
// so here instead of Launch name as collection launches
// will be added to mongodb