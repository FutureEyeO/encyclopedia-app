
const AdminCollection = require("./models/Admin")
const AuthorCollection = require("./models/Author")

class Admin {
    async fetch_admin({ userId }) {
        try {
            const admin = await AdminCollection.findOne({ userId })
            return { data: admin, status: 200 }
        } catch (err) {
            return { error: err, status: 500 }
        }
    }
    async fetch_author({ userId }) {
        try {
            const author = await AuthorCollection.findOne({ userId })
            return { data: author, status: 200 }
        } catch (err) {
            return { error: err, status: 500 }
        }
    }
}

module.exports = {
    Admin
}