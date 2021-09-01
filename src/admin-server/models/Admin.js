const mongoose = require("mongoose")
const db = require("../connections/admin.db")

const adminSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    isAdmin: {
        type: Boolean,
        required: true
    },
    controlOptions: {
        type: Object,
        defualt: {}
    },
}, {timestamps: true})

module.exports = db.model("Admin", adminSchema)