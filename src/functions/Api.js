import axios from "axios"
import url_join from "url-join"
import { v4 as uuidv4 } from "uuid"

import constants from "../constant/general";

const { proxy, UPLOAD_POST_URL, UPLOAD_USER_URL, ALLOWED_IMG, ALLOWED_IMG_SIZE } = constants
// const proxy = "http:/localhost:8800/api"

// const UPLOAD_USER_URL = process.env.REACT_APP_UPLOAD_USER_URL
// const UPLOAD_POST_URL = process.env.REACT_APP_UPLOAD_POST_URL


// const ALLOWED_IMG = ["image/png", "image/jpeg"]
// const ALLOWED_IMG_SIZE = 8


function addPathToMedia(obj, type) {
    // if (type == "post" && obj._id && obj.img && obj.img != "") {
    //     // obj.img = url_join(public_posts_url, obj.img)
    // } else if (type == "post" && obj._id && obj.img == "") {
    //     obj.img = url_join(public_default_url, "post.jpg")
    // }

    // if (type == "user" && obj._id && obj.profileImg && obj.profileImg != "") {
    //     // obj.profileImg = url_join(public_users_url, obj._id, obj.img)
    // } else if (type == "user" && obj._id && obj.profileImg == "") {
    //     obj.profileImg = url_join(public_default_url, "profile.jpg")
    // }
    // if (type == "user" && obj._id && obj.coverImg && obj.coverImg != "") {
    //     // obj.coverImg = url_join(public_users_url, obj._id, obj.coverImg)

    // } else if (type == "user" && obj._id && obj.coverImg == "") {

    //     obj.coverImg = url_join(public_default_url, "cover.jpg")
    // }


    return obj
}

function reverseResArray(obj) {

    if (Array.isArray(obj)) {
        obj = obj.reverse()
    }

    return obj
}

// ! AUTH API :
const registerUser = async (userData) => {
    return await axios.post(`${proxy}/auth/register`, userData)
}

const loginUser = async ({ userEmail, userPassword }) => {
    const res = await axios.post(`${proxy}/auth/login`, { email: userEmail, password: userPassword })
    res.data = addPathToMedia(res.data, "user")
    return res
}


const saveLoginUser = async ({ userEmail, userPassword }) => {
    const res = await axios.post(`${proxy}/auth/save_login`, { email: userEmail, password: userPassword })
    res.data._id = res.data.user_id
    return res
}



const fetchSaveLoginUser = async (loginId, userId) => {

    const res = await axios.post(`${proxy}/auth/auto_login`, { loginId: loginId, userId: userId })
    // res.data.session_id = res.data._id
    res.data._id = userId
    return res

}



const deleteLoginUser = async (loginId, userId) => {

    const res = await axios.delete(`${proxy}/auth/delete_login`, { params: { loginId: loginId, userId: userId } })
    // res.data.session_id = res.data._id
    return res

}


const updateLoginUser = async (loginId, userId) => {

    const res = await axios.put(`${proxy}/auth/update_login`, { loginId: loginId, userId: userId })
    // res.data.session_id = res.data._id
    res.data._id = userId
    return res

}



// ! USER API : 
const updateUser = async (id, _userId, updateData) => {
    const { userId, createdAt, updatedAt, __v, _id, ..._updateData } = updateData

    return await axios.put(`${proxy}/users/${id}`, { userId: _userId, ..._updateData })

}

const updateUserImg = async (id, _userId, updateData, formData) => {
    console.log(updateData, formData)
    const { userId, createdAt, updatedAt, __v, _id, ..._updateData } = updateData

    // const files = formData.get("file")
    const coverImg = formData.get("coverImg")
    const profileImg = formData.get("profileImg")
    const files = [profileImg, coverImg]
    console.log(files)
    files.forEach(file => {
        const newFormData = new FormData()
        newFormData.append("file", file)

        if (file) {
            console.log(file)
            const fileSize = file.size / 1000 / 1000

            console.log(fileSize < ALLOWED_IMG_SIZE && ALLOWED_IMG.includes(file.type))

            if (fileSize < ALLOWED_IMG_SIZE && ALLOWED_IMG.includes(file.type)) {
                const fileMimeType = file.type.split("/")[1]
                const fileName = `${uuidv4()}.${fileMimeType}`

                console.log(UPLOAD_USER_URL, _userId, fileName)
                const filePath = url_join(UPLOAD_USER_URL, _userId, fileName)
                console.log(filePath)

                // postData.img = filePath
                _updateData[file.id] = filePath

                uploadUserImage(fileName, _userId, newFormData).then(async res => {
                    console.log(res)
                    if (res.status == 200)
                        return await axios.put(`${proxy}/users/${id}/set_img`, { userId: _userId, ..._updateData })
                })
            }
        }
    })


}


const deleteUser = async (id, userId) => {
    return await axios.delete(`${proxy}/users/${id}`, { params: { userId: userId } })
}

const fetchUser = async (id_user, type = "id") => {
    const res = await axios.get(`${proxy}/users/${id_user}/${type}`)
    res.data = addPathToMedia(res.data, "user")
    return res
}


const followUser = async (id, userId) => {
    return await axios.put(`${proxy}/users/${id}/follow`, { userId: userId })
}


const unfollowUser = async (id, userId) => {
    return await axios.put(`${proxy}/users/${id}/unfollow`, { userId: userId })
}

const fetchAllUsers = async () => {
    const res = await axios.get(`${proxy}/users/get_all_users`)
    // res.data = reverseResArray(res.data)
    // res.data.map(resData => {
    //     resData = addPathToMedia(resData, "user")
    // })
    return res
}


// ! POST API :
const createPost = async (postData, formData) => {
    const file = formData.get("file")
    console.log(postData, file)
    if (file) {
        const fileSize = file.size / 1000 / 1000

        if (fileSize < ALLOWED_IMG_SIZE && ALLOWED_IMG.includes(file.type)) {
            const fileMimeType = file.type.split("/")[1]
            const fileName = `${uuidv4()}.${fileMimeType}`

            const filePath = url_join(UPLOAD_POST_URL, postData.userId, "images", fileName)

            postData.coverImg = filePath

            await uploadPostImage(fileName, postData.userId, formData).then(async res => {
                console.log(res)
                if (res.status == 200)
                    return await axios.post(`${proxy}/posts/`, postData)
            })
        }
    }
}


const updatePost = async (id, _userId, updateData) => {
    const { userId, createdAt, updatedAt, __v, _id, ..._updateData } = updateData
    return await axios.put(`${proxy}/posts/${id}`, { userId: _userId, ..._updateData })
}

const updatePostImg = async (id, _userId, updateData) => {
    const { userId, createdAt, updatedAt, __v, _id, ..._updateData } = updateData
    return await axios.put(`${proxy}/posts/${id}/set_img`, { userId: _userId, ..._updateData })
}

const deletePost = async (id, userId) => {
    return await axios.delete(`${proxy}/posts/${id}`, { params: { userId: userId } })
}


const likePost = async (id, userId) => {
    return await axios.put(`${proxy}/posts/${id}/like`, { userId: userId })
}

const addViewsCountPost = async (id) => {
    return await axios.put(`${proxy}/posts/${id}/add_viewsCount`)
}

const fetchPost = async (id) => {
    const res = await axios.get(`${proxy}/posts/${id}`)
    res.data = addPathToMedia(res.data, "post")
    return res
}


const fetchPostByCategory = async (category) => {
    const res = await axios.get(`${proxy}/posts/category/${category}`)
    return res
}

const fetchPostByRelatedHash = async (relatedHash) => {
    const res = await axios.get(`${proxy}/posts/relatedHash/${relatedHash}`)
    return res
}



const fetchLastPosts = async (limit) => {
    const res = await axios.get(`${proxy}/posts/last/${limit}`)
    res.data = addPathToMedia(res.data, "post")
    return res
}


const fetchMostLikePosts = async (limit) => {
    const res = await axios.get(`${proxy}/posts/most_like/${limit}`)
    res.data = addPathToMedia(res.data, "post")
    return res
}


const fetchMostViewPosts = async (limit) => {
    const res = await axios.get(`${proxy}/posts/most_view/${limit}`)
    res.data = addPathToMedia(res.data, "post")
    return res
}




const fetchUserPosts = async (userId) => {
    const res = await axios.get(`${proxy}/posts/timeline/user/${userId}`)
    res.data = reverseResArray(res.data)
    res.data.map(resData => {
        resData = addPathToMedia(resData, "post")
    })
    return res
}


const fetchUserPostsId = async (userId) => {
    const res = await axios.get(`${proxy}/posts/timeline/user_posts_id/${userId}`)
    res.data = reverseResArray(res.data)
    res.data.map(resData => {
        resData = addPathToMedia(resData, "post")
    })
    return res
}

const fetchFuserPosts = async (userId) => {
    const res = await axios.get(`${proxy}/posts/timeline/fuser/${userId}`)
    res.data = reverseResArray(res.data)
    res.data.map(resData => {
        resData = addPathToMedia(resData, "post")
    })
    return res
}

const fetchFuserPostsId = async (userId) => {
    const res = await axios.get(`${proxy}/posts/timeline/fuser_posts_id/${userId}`)
    res.data = reverseResArray(res.data)
    res.data.map(resData => {
        resData = addPathToMedia(resData, "post")
    })
    return res
}


const fetchTimelinePosts = async () => {
    const res = await axios.get(`${proxy}/posts/timeline/all/`)
    res.data = reverseResArray(res.data)
    res.data.map(resData => {
        resData = addPathToMedia(resData, "post")
    })
    return res
}

const fetchTimelinePostsId = async (userId) => {
    const res = await axios.get(`${proxy}/posts/timeline/all_posts_id/${userId}`)
    res.data = reverseResArray(res.data)
    res.data.map(resData => {
        resData = addPathToMedia(resData, "post")
    })
    return res
}

const fetchAllPosts = async () => {
    const res = await axios.get(`${proxy}/posts/p/all`)
    res.data = reverseResArray(res.data)
    res.data.map(resData => {
        resData = addPathToMedia(resData, "post")
    })
    return res
}



// ! UPLOAD :

const uploadPostImage = async (filename, userId, formData) => {
    return await axios.post(`${proxy}/upload/post/${userId}/${filename}`, formData)
}

const uploadUserImage = async (filename, userId, formData) => {
    return await axios.post(`${proxy}/upload/user/${userId}/${filename}`, formData)
}


// ! CONVERSATION :
const createConversation = async (senderId, receiverId) => {
    const res = await axios.post(`${proxy}/conversation`, { senderId: senderId, receiverId: receiverId })
    return res
}

const getConversation = async (currentUser, secondUser) => {
    const res = await axios.get(`${proxy}/conversation/${currentUser}/${secondUser}`)
    return res
}


const getConversationByid = async (conversationId, currentUser) => {
    const res = await axios.post(`${proxy}/conversation/conv/${conversationId}`, { currentUser: currentUser })
    return res
}

const getUserConversations = async (userId) => {
    const res = await axios.get(`${proxy}/conversation/user/${userId}`)
    return res
}

// ! MESSAGE :
const createMessage = async (conversationId, senderId, text) => {
    const res = await axios.post(`${proxy}/message`, { conversationId: conversationId, senderId: senderId, text: text })
    return res
}

const getConversationMessages = async (conversationId, currentUser, secondUser) => {
    const res = await axios.post(`${proxy}/message/${conversationId}`, { currentUser: currentUser, secondUser: secondUser })
    return res
}


// ! STATISTIC :

const postStatistic = async (ip, userId, url, timeTaken, ipInfo) => {
    const res = await axios.post(`${proxy}/statistics/`, { ip, userId, url, timeTaken, ipInfo, visitCount: 1 })
    return res
}


const getVisitCountStatistic = async (url) => {
    const res = await axios.get(`${proxy}/statistics/visit_count`, { params: { url } })
    return res
}

const getIpInfo = async (ip) => {
    const res = await axios.get(`http://ip-api.com/json/${ip}?fields=66846719`)
    return res
}

export default {
    registerUser,
    loginUser,
    saveLoginUser,
    fetchSaveLoginUser,
    deleteLoginUser,
    updateLoginUser,

    updateUser,
    updateUserImg,
    deleteUser,
    followUser,
    unfollowUser,

    fetchUser,
    fetchAllUsers,

    createPost,
    updatePost,
    updatePostImg,
    deletePost,
    likePost,
    addViewsCountPost,
    fetchPostByCategory,
    fetchPostByRelatedHash,

    fetchPost,
    fetchLastPosts,
    fetchMostLikePosts,
    fetchMostViewPosts,
    fetchUserPosts,
    fetchFuserPosts,
    fetchUserPostsId,
    fetchFuserPostsId,
    fetchTimelinePosts,
    fetchTimelinePostsId,
    fetchAllPosts,

    uploadPostImage,
    uploadUserImage,

    createConversation,
    getConversation,
    getConversationByid,
    getUserConversations,

    createMessage,
    getConversationMessages,

    postStatistic,
    getVisitCountStatistic,
    getIpInfo,
}

