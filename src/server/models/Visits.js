
const mongoose = require("mongoose")
const db = require("../connections/statistics.db")

const visitSchema = mongoose.Schema({
    ip: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        defualt: ""
    },
    url: {
        type: String,
        defualt: "",
        required: true,
    },
    timeTaken: {
        type: Number,
        defualt: 0,
        required: true,
    },
    ipInfo: {
        type: Object,
        defualt: {}
    },
    visitCount: {
        type: Number,
        defualt: 0
    }
}, { timestamps: true })



const visitsLogSchema = mongoose.Schema({
    url: {
        type: String,
        defualt: "",
        require: true,
        unique: true
    },
    date: {
        type: String,
        required: true
    },
    visitors: {
        type: Object,
        require: true,
        ip: {
            type: Object,
            require: true,
            userId: {
                type: String,
                defualt: ""
            },
            timeTaken: {
                type: Number,
                defualt: 0,
            }, 
        }
    }
}, { timestamps: true })

const VisitsCollection = db.model("Visits", visitSchema)
const VisitsLogCollection = db.model("VisitsLog", visitsLogSchema)

module.exports = {
    VisitsCollection,
    VisitsLogCollection
}


