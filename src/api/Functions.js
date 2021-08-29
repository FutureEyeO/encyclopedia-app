import mongoose from "mongoose"

const checkAdmin = async (_id) => {
    try {
        const admin = await axios.get(`${constants.proxy}/admin/${_id}`)
        if (admin.data == null)
            return false

        if (admin.data.userId == _id) {
            return true
        } else {
            return false
        }
    } catch (err) {
        return false
    }
}


const checkAuthor = async (_id) => {
    const author = await axios.get(`${constants.proxy}/author/${_id}`)
    if (author.data == null)
        return false

    if (author.data.userId == _id) {
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
            return {}

    } catch (err) {
        return {}
    }
}

export default{
    checkAdmin,
    checkAuthor,
    checkValidate,
    returnUserData
}