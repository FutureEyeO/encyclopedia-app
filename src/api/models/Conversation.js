import mongoose from "mongoose"

import db from "../connections/api.db"

const conversationSchema = new mongoose.Schema({
    members: {
        type: Array,
        required: true,
    }
}, { timestamps: true })

module.exports = db.model("Conversation", conversationSchema)