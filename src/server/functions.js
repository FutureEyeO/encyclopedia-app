const mongoose = require("mongoose")
const ApdServer = require("../admin-server/Apd")

const Adp = new ApdServer()

const checkAdmin = async ({ userId }) => {
    try {
        const admin = await Adp.Admin().fetch_admin(userId)

        if (!admin.data)
            return false

        if (admin.data.userId == userId) {
            return true
        } else {
            return false
        }
    } catch (err) {
        return false
    }
}


const checkAuthor = async (userId) => {
    const author = await Adp.Admin().fetch_author(userId) 
    if (!author.data)
        return false

    if (author.data.userId == userId) {
        return true
    } else {
        return false
    }
}

const checkValidate = async (_id) => {
    return {
        isAdmin: await checkAdmin(_id),
        isAuthor: await checkAuthor(_id)
    }
}

const returnUserData = async (data) => {
    try {
        if (data) {
            const { password, login_password, updatedAt, __v, ...userData } = data
            return { ...userData, ...await checkValidate(userData._id) }
        } else
            return { }

    } catch (err) {
        return { }
    }
}

const resData = (data, message = null, status = 200, error = false) => {
    data = JSON.parse(data)
    return { data, message, status, error }
}

module.exports = {
    checkAdmin,
    checkAuthor,
    checkValidate,
    returnUserData,
    resData
}