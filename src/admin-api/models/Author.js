const mongoose = require("mongoose")

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

module.exports = mongoose.model("author", authorSchema)