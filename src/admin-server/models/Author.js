const mongoose = require("mongoose")
const db = require("../connections/admin.db")

const authorSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    isAuthor: {
        type: Boolean,
        required: true
    },
    authorOptions: {
        type: Object,
        defualt: {}
    }
}, {timestamps: true})

module.exports = db.model("Author", authorSchema)