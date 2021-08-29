const mongoose = require("mongoose")

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

module.exports = mongoose.model("Admin", adminSchema)