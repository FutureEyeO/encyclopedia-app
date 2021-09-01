const bcrypt = require("bcrypt")
const { v4 } = require("uuid")
const fn = require("./functions")
const constants = require("../constant/general")
const url = require("url")
const fs = require("fs")
const path = require("path")
const rimraf = require("rimraf")

const UserCollection = require("./models/User")
const LoginCollection = require("./models/Login")
const PostCollection = require("./models/Post")
const { VisitsCollection, VisitsLogCollection } = require("./models/Visits")
// const fs = require("fs")


class Auth {
    async register(data) {
        try {
            // generate a hash password :
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(data.password, salt)

            data["password"] = hashedPassword
            // create new user : 
            const { ip } = data

            if (ip) {
                const newUser = new UserCollection(data)

                // save user and return response :
                const user = await newUser.save()
                let userData = await fn.returnUserData(user._doc)
                return fn.resData(userData)
            } else {
                return fn.resData(null, "Vaild input", 400, true)
            }
        } catch (err) {
            return fn.resData(null, "There is an unknown error, try again", 500, true)
        }
    }

    async login(data) {
        try {
            const user = await UserCollection.findOne({ email: data.email })
            if (!user && !user._id) return "User not found"

            const validPassword = await bcrypt.compare(data.password, user.password)
            if (!validPassword) return "Worng password"

            let userData = await fn.returnUserData(user._doc)
            return fn.resData(userData)
        } catch (err) {
            return fn.resData(null, "There is an unknown error, try again", 500, true)
        }
    }

    async save_login(data) {
        try {
            const { email, password } = data

            const user = await UserCollection.findOne({ email: email })
            if (!user && !user._id) return fn.resData(null, "User not found", 404, true)

            const validPassword = await bcrypt.compare(password, user.password)
            if (!validPassword) return fn.resData(null, "Worng password", 400, true)


            const createLogin = async () => {

                const salt = await bcrypt.genSalt(10)

                const userData = await fn.returnUserData(user._doc)

                let loginPassword = await bcrypt.hash(user._id + user.createdAt, salt)

                let loginData = {
                    user_agent: window.navigator.userAgent,
                    user_id: user._id,
                    login_time: new Date().getTime(),
                    login_id: v4(),
                    login_password: loginPassword
                }

                loginData = { ...loginData, ...userData }
                console.log(loginData)
                const newLogin = new LoginCollection(loginData)

                // save user and return response :
                const login = await newLogin.save()

                const _loginData = await fn.returnUserData(login._doc)

                return fn.resData(_loginData)
            }



            const loginCheck = await LoginCollection.findOne({ user_id: user._id })

            if (loginCheck && loginCheck._id) {

                let loginPassword = user._id + user.createdAt

                const validPassword = await bcrypt.compare(loginPassword, loginCheck.login_password)
                console.log(validPassword)
                if (!validPassword) return fn.resData(null, "Worng password", 400, true)

                let loginTimeHours = (Date.now() - loginCheck.login_time) / 3600000

                if (loginTimeHours > 44) {

                    await loginCheck.deleteOne()
                    await createLogin()

                } else {

                    const userData = await fn.returnUserData(user._doc)

                    let loginData = {
                        user_agent: window.navigator.userAgent,
                        login_time: new Date().getTime(),
                        login_id: v4(),
                    }

                    loginData = { ...loginData, ...userData }

                    await loginCheck.updateOne(loginData)

                    const loginUpdate = await LoginCollection.findOne({ _id: loginCheck._id })

                    const _loginData = await fn.returnUserData(loginUpdate._doc)


                    return fn.resData(_loginData)

                }


            } else {

                await createLogin()

            }
        } catch (err) {
            return fn.resData(null, "There is an unknown error, try again", 500, true)
        }
    }

    async update_login(data) {
        try {
            const { loginId, userId } = data
            const user_agent = window.navigator.userAgent

            const user = await UserCollection.findOne({ _id: userId })
            if (!user && !user._id) return fn.resData(null, "User not found", 404, true) 

            const login = await LoginCollection.findOne({ login_id: loginId })

            if (login && login._id && user_agent == login.user_agent) {

                let loginPassword = user._id + user.createdAt

                const validPassword = await bcrypt.compare(loginPassword, login.login_password)
                console.log(validPassword)
                if (!validPassword) return fn.resData(null, "Worng password", 400, true) 

                const userData = await fn.returnUserData(login._doc)

                await login.updateOne(userData)

                const loginUpdate = await LoginCollection.findOne({ _id: login._id })

                const loginData = await fn.returnUserData(loginUpdate._doc)


                return fn.resData(loginData)
            }

        } catch (err) {
            return fn.resData(null, "There is an unknown error, try again", 500, true)
        }

    }

    async delete_login(data) {
        try {
            const { loginId, userId } = data

            const user = await UserCollection.findOne({ _id: userId }, { _id: 1, createdAt: 1 })
            if (!user && !user._id) return fn.resData(null, "User not found", 404, true)

            const user_agent = window.navigator.userAgent

            if (user && user._id) {

                const login = await LoginCollection.findOne({ login_id: loginId })
                if (!login && !login._id) return fn.resData(null, "Login not found", 404, true) 

                if (user_agent == login.user_agent) {

                    let loginPassword = user._id + user.createdAt

                    const validPassword = await bcrypt.compare(loginPassword, login.login_password)
                    if (!validPassword) return fn.resData(null, "Worng password", 404, true)

                    await login.deleteOne()
                    return fn.resData(null, "Login has deleted successfully", 200, false)
                } else {
                    return fn.resData(null, "The login data is invalid", 400, true)
                }
            }
        } catch (err) {
            return fn.resData(null, "There is an unknown error, try again", 500, true)
        }
    }

    async auto_login(data) {
        try {
            const { loginId, userId } = data

            const user = await UserCollection.findOne({ _id: userId }, { _id: 1, createdAt: 1 })
            if (!user && !user._id) return fn.resData(null, "User not found", 404, true)

            const user_agent = window.navigator.userAgent

            if (user && user._id) {

                const login = await LoginCollection.findOne({ login_id: loginId })
                if (!login) return fn.resData(null, "Login not found", 404, true)


                if (user_agent == login.user_agent) {

                    let loginPassword = user._id + user.createdAt

                    const validPassword = await bcrypt.compare(loginPassword, login.login_password)
                    if (!validPassword) return fn.resData(null, "Worng password", 400, true)

                    let loginTimeHours = (Date.now() - login.login_time) / 3600000

                    if (loginTimeHours > 44) {

                        login.deleteOne()
                        return fn.resData(null, "The login data is invalid", 400, true)

                    } else {

                        const loginData = await fn.returnUserData(login._doc)

                        return fn.resData(loginData)

                    }
                } else {
                    return fn.resData(null, "The login data is invalid", 400, true)
                }
            }
        } catch (err) {
            return fn.resData(null, "There is an unknown error, try again", 500, true)
        }
    }
}

class User {
    async update_user({ currentId, userId, ...data }) {
        try {
            const { _id, __v, isAdmin, isAuthor, createdAt, ...updateData } = data

            const user = await UserCollection.findOne({ _id: userId })
            let currentUser = await UserCollection.findOne({ _id: currentId })
            currentUser = await fn.returnUserData(currentUser._doc)

            if ((user && currentUser && userId === currentId) || (user && currentUser && currentUser.isAdmin)) {
                if (data.password) {
                    try {
                        const salt = await bcrypt.genSalt(10)
                        data.password = await bcrypt.hash(data.password, salt)

                    } catch (err) {
                        return fn.resData(null, "Invalid password", 400, true)
                    }
                }


                await user.updateOne({ $set: updateData })

                let userUpdated = await UserCollection.findOne({ _id: userId })

                userUpdated = await fn.returnUserData(userUpdated._doc)
                return fn.resData(userUpdated)

            } else {
                return fn.resData(null, "User not found", 400, true)

            }
        } catch (err) {
            return fn.resData(null, "There is an unknown error, try again", 500, true)
        }
    }

    async update_user_imges({ currentId, userId, ...data }) {
        try {
            const user = await UserCollection.findOne({ _id: userId })
            let currentUser = await UserCollection.findOne({ _id: currentId })
            currentUser = await fn.returnUserData(currentUser._doc)

            if (!data.coverImg) data.coverImg = "" 
            if (!data.profileImg) data.profileImg = ""

            const { profileImg, coverImg, set } = data
            console.log(profileImg, coverImg)
            if ((user && currentUser && userId === currentId) || (user && currentUser && currentUser.isAdmin)) {
                if (set) {
                    await user.updateOne({ $set: { profileImg: profileImg, coverImg: coverImg } })
                } else {
                    await user.updateOne({ $set: { profileImg: user.profileImg + profileImg, coverImg: user.coverImg + coverImg } })
                }

                let userUpdated = await UserCollection.findOne({ userId })

                userUpdated = await fn.returnUserData(userUpdated._doc)

                return   fn.resData(userUpdated)


            } else {
                return fn.resData(null, "User not found", 400, true)
            }
        } catch (err) {
            return fn.resData(null, "There is an unknown error, try again", 500, true)
        }
    }

    async delete_user({ currentId, userId }) {
        try {
            const user = await UserCollection.findOne({ _id: userId }, { coverImg: 1, profileImg: 1, posts: 1, _id: 1 })

            let currentUser = await UserCollection.findOne({ _id: currentId }, { _id: 1 })
            currentUser = await fn.returnUserData(currentUser._doc)

            if ((user && currentUser && userId === currentId) || (user && currentUser && currentUser.isAdmin)) {

                let userImgs = [user.coverImg, user.profileImg]

                userImgs.forEach(img => {
                    console.log(img)
                    if (img && img != "") {
                        let pathStoreUserImg = url.parse(img).pathname

                        if (pathStoreUserImg.startsWith("/"))
                            pathStoreUserImg = pathStoreUserImg.slice(1, pathStoreUserImg.length)

                        let pathStoreUser = constants.UPLOAD_USER_PATH + "/" + pathStoreUserImg.split("/")[pathStoreUserImg.split("/").length - 2]
                        console.log(pathStoreUser)

                        if (fs.existsSync(pathStoreUser))
                            rimraf(pathStoreUser, () => console.log("folder has been deleted successfully"))

                    }
                })

                console.log(user.posts)

                user.posts.forEach(async p => {
                    let pathUserPost = url.parse(p.img).pathname

                    if (pathUserPost.startsWith("/"))
                        pathUserPost = pathUserPost.slice(1, pathUserPost.length)

                    pathUserPost = constants.UPLOAD_POST_PATH + "/" + pathUserPost.split("/")[pathUserPost.split("/").length - 2]

                    if (fs.existsSync(pathUserPost))
                        rimraf(pathUserPost, () => console.log("folder has been deleted successfully"))

                    // await axios.delete(`${API}/posts/${p._id}`, { params: { userId: userId } })
                    // ! delete post 
                    // !
                    // !
                    // !
                    // !
                    // !
                    // ! delete post 

                })

                await user.deleteOne()
                return fn.resData(null, "Account has been deleted")
            } else {
                return fn.resData(null, "User not found", 404, true)
            }
        } catch (err) {
            return fn.resData(null, "There is an unknown error, try again", 500, true)
        }
    }

    async fetch_user({ userId, type }) {

        if (userId) {
            try {

                console.log(userId, type)
                let user = { }
                if (type == "username" || type == "user")
                    user = await UserCollection.findOne({ username: userId })
                else if (type == "userId" || type == "id")
                    user = await UserCollection.findOne({ _id: userId })

                console.log(user)

                let userData = await fn.returnUserData(user._doc)

                return fn.resData(userData)
            } catch (err) {
                return fn.resData(null, "There is an unknown error, try again", 500, true)
            }
        } else {
            return fn.resData(null, "User not found", 404, true)
        }
    }

    async follow_user({ currentId, userId }) {
        if (userId !== currentId) {
            try {
                const currentUser = await UserCollection.findOne({ _id: currentId })
                const user = await UserCollection.findOne({ _id: userId })

                if (!currentUser.followings.includes(userId)) {

                    await currentUser.updateOne({ $push: { followings: userId } })
                    await user.updateOne({ $push: { followers: currentId } })
                    return fn.resData(null, "User has been following", 400, true)
                } else {
                    return fn.resData(null, "You are already follow this user", 400, true)
                }
            } catch (err) {
                return fn.resData(null, "There is an unknown error, try again", 500, true)
            }
        } else {
            return fn.resData(null, "You can't follow yourself", 400, true)
        }
    }

    async unfollow_user({ currentId, userId }) {
        if (currentId !== userId) {
            try {
                const currentUser = await UserCollection.findOne({ _id: currentId })
                const user = await UserCollection.findOne({ _id: userId })

                if (currentUser.followings.includes(userId)) {
                    await currentUser.updateOne({ $pull: { followings: userId } })
                    await user.updateOne({ $pull: { followers: currentId } })
                    return fn.resData(null, "User has been unfollowing", 400, true)

                } else {
                    return fn.resData(null, "You havn't followed this user", 400, true)
                }
            } catch (err) {
                return fn.resData(null, "There is an unknown error, try again", 500, true)
            }
        } else {
            return fn.resData(null, "you cant follow yourself", 400, true)
        }
    }

    async fetch_all_users() {
        try {
            const users = await UserCollection.find({ })
            let usersInfo = []
            users.forEach(async user => {
                let userData = await fn.returnUserData(user._doc)
                usersInfo.push(userData)
            })
            return fn.resData(usersInfo)

        } catch (err) {
            return fn.resData(null, "There is an unknown error, try again", 500, true)
        }
    }
}

class Post {
    async create_post(data) {
        try {
            const { userId } = data
            if (userId) {
                const user = await UserCollection.findOne({ _id: userId })
                if (user && user._id) {
                    const newPost = new PostCollection(data)
                    const post = await newPost.save()

                    await user.updateOne({ $push: { posts: post._id } })

                    return fn.resData(post)
                } else {
                    return fn.resData(null, "User not found", 404, true)
                }
            }
        } catch (err) {
            return fn.resData(null, "There is an unknown error, try again", 500, true)
        }
    }

    async update_post({ currentId, userId, postId, ...data }) {
        try {
            const post = await PostCollection.findOne({ _id: postId }, { userId: 1 })
            // const { userId, currentId, ...updateData } = data

            let currentUser = await UserCollection.findOne({ _id: currentId }, { posts: 1 })
            currentUser = await fn.returnUserData(currentUser._doc)

            const user = await UserCollection.findOne({ _id: userId }, { posts: 1 })
            if ((post._id && user._id && user.posts.includes(userId) && userId === post.userId) && (post._id && user._id && currentUser._id && currentUser.isAdmin && currentUser.isAuthor)) {
                await post.updateOne({ $set: data })
                const postUpdated = await PostCollection.findOne({ _id: post._id })

                return fn.resData(postUpdated)
            } else {
                return fn.resData(null, "There is something wrong with the permissions", 406, true)
            }
        } catch (err) {
            return fn.resData(null, "There is an unknown error, try again", 500, true)
        }
    }

    async update_post_imges({ currentId, userId, postId, ...data }) {
        try {
            const { coverImg, set } = data

            const post = await PostCollection.findOne({ _id: postId }, { userId: 1, coverImg: 1 })

            if (!coverImg) coverImg = ""

            // const { userId, currentId, ...updateData } = data

            let currentUser = await UserCollection.findOne({ _id: currentId }, { posts: 1 })
            currentUser = await fn.returnUserData(currentUser._doc)

            const user = await UserCollection.findOne({ _id: userId }, { posts: 1 })
            if ((post._id && user._id && user.posts.includes(userId) && userId === post.userId) && (post._id && user._id && currentUser._id && currentUser.isAdmin && currentUser.isAuthor)) {
                if (set) {
                    await post.updateOne({ $set: { coverImg: coverImg } })
                } else {
                    await post.updateOne({ $set: { coverImg: post.coverImg + coverImg } })
                }
                const postUpdated = await PostCollection.findOne({ _id: post._id })
                return fn.resData(postUpdated)
            } else {
                return fn.resData(null, "There is something wrong with the permissions", 406, true)
            }
        } catch (err) {
            return fn.resData(null, "There is an unknown error, try again", 500, true)
        }
    }

    async delete_post({ currentId, userId, postId }) {
        try {
            const post = await PostCollection.findOne({ _id: postId }, { userId: 1, coverImg: 1 })
            let currentUser = await UserCollection.findOne({ _id: currentId }, { posts: 1 })
            currentUser = await fn.returnUserData(currentUser._doc)

            const user = await UserCollection.findOne({ _id: userId }, { posts: 1 })
            if ((post._id && user._id && user.posts.includes(userId) && userId === post.userId) && (post._id && user._id && currentUser._id && currentUser.isAdmin && currentUser.isAuthor)) {

                if (post.coverImg && post.coverImg != "") {

                    let pathStorePost = url.parse(post.coverImg).pathname

                    if (pathStorePost.startsWith("/"))
                        pathStorePost = pathStorePost.slice(1, pathStorePost.length)

                    if (fs.existsSync(pathStorePost))
                        fs.unlinkSync(pathStorePost)

                }

                await user.updateOne({ $unset: { posts: post._id } })
                await post.deleteOne()

                return fn.resData(null, "Post has been deleted succssfully", 200)
            } else {
                return fn.resData(null, "There is something wrong with the permissions", 406, true)
            }
        } catch (err) {
            return fn.resData(null, "There is an unknown error, try again", 500, true)
        }
    }

    async like_post({ currentId, postId }) {
        try {
            const post = await PostCollection.findOne({ _id: postId }, { likes: 1 })
            const user = await UserCollection.findOne({ _id: currentId }, { posts_likes: 1 })

            if (post._id && user._id) {
                if (!post.likes.includes(currentId)) {
                    await post.updateOne({ $push: { likes: currentId } })
                    await user.updateOne({ $push: { posts_likes: postId } })
                    return fn.resData(null, "Like added", 200)
                } else {
                    await post.updateOne({ $pull: { likes: currentId } })
                    await user.updateOne({ $pull: { posts_likes: postId } })
                    return fn.resData(null, "Like removed", 200)
                }
            } else {
                return fn.resData(null, "User or post not found", 404, true)
            }
        } catch (err) {
            return fn.resData(null, "There is an unknown error, try again", 500, true)
        }
    }

    async comment_post({ userId, postId, text }) {
        try {
            const post = await PostCollection.findOne({ _id: postId }, { comments: 1 })
            const user = await UserCollection.findOne({ _id: userId }, { _id: 1 })

            if (post._id && user._id) {

                let commentCount = 0
                post.comments.forEach(c => {
                    if (c.userId == userId) {
                        commentCount++
                    }
                })

                if (commentCount >= constants.limitPostCommentsUser || post.comments.length >= constants.limitPostComments) {
                    return fn.resData(null, "Comment limit reached", 406, true)
                }

                if (text.length > 3) {
                    return fn.resData(null, "Text is very small you cant post comment less than 3 characters !", 406, true)
                }

                await post.updateOne({
                    $push: {
                        comments: {
                            id: v4(),
                            userId,
                            text,
                            time: Date.now()
                        }
                    }
                })

                const updatedPost = await PostCollection.findOne({ _id: postId }, { comments: 1 })

                return fn.resData(updatedPost)
            } else {
                return fn.resData(null, "User or post not found", 404, true)
            }
        } catch (err) {
            return fn.resData(null, "There is an unknown error, try again", 500, true)
        }
    }

    async delete_comment({ currentId, userId, postId, commentId }) {
        try {
            const post = await PostCollection.findOne({ _id: postId }, { comments: 1 })
            let currentUser = await UserCollection.findOne({ _id: currentId }, { _id: 1 })
            currentUser = await fn.returnUserData(currentUser._doc)

            const user = await UserCollection.findOne({ _id: userId }, { _id: 1 })

            if (post._id && user._id && commentId) {

                await post.updateOne({
                    $pull: {
                        comments: {
                            id: commentId,
                            userId: user._id,
                        }
                    }
                })

                const updatedPost = await PostCollection.findOne({ _id: postId }, { comments: 1 })

                return fn.resData(updatedPost)
            } else {
                return fn.resData(null, "User or post not found", 404, true)
            }
        } catch (err) {
            return fn.resData(null, "There is an unknown error, try again", 500, true)
        }
    }

    // async add_viewer({postId}) {
    //     try {
    //         const post = await PostCollection.findOne({ _id: postId }, { viewsCount: 1 })

    //         if (post) {
    //             await post.updateOne({ $inc: { viewsCount: 1 } })
    //             res.status(200).send("PostCollection has been adding viewsCount")

    //         } else {
    //             return res.status(404).send("None user or post with this id")
    //         }
    //     } catch (err) {
    //         return res.status(500).json(err)
    //     }
    // }

    async fetch_post({ postId }) {
        try {
            const post = await PostCollection.findOne({ _id: postId })
            return fn.resData(post)
        } catch (err) {
            return fn.resData(null, "There is an unknown error, try again", 500, true)
        }
    }

    async global_search({ labels, category }) {
        try {
            let searchPosts = { }

            if (labels && category) {
                let posts = await PostCollection.find({ relatedHash: { $in: labels }, category }, { _id: 1, category: 1, relatedHash: 1 })
                posts = posts.reverse()
                posts.forEach(p => {
                    searchPosts[p._id] = p
                })
            }
            if (category) {
                let posts = await PostCollection.find({ category }, { _id: 1, category: 1, relatedHash: 1 })
                posts = posts.reverse()
                posts.forEach(p => {
                    searchPosts[p._id] = p
                })
            }
            if (labels) {
                let posts = await PostCollection.find({ relatedHash: { $in: labels } }, { _id: 1, category: 1, relatedHash: 1 })
                posts = posts.reverse()
                console.log(posts)
                posts.forEach(p => {
                    searchPosts[p._id] = p
                })
            }
            return fn.resData(searchPosts) 

        } catch (err) {
            return fn.resData(null, "There is an unknown error, try again", 500, true)
        }
    }

    async fetch_most_viwes({ limit }) {
        try {
            limit = Number(limit)
            const posts = await PostCollection.find({ }, { _id: 1, viewsCount: 1, createdAt: 1 }).limit(limit).sort({ viewsCount: 1, createdAt: 1 })
            return fn.resData(posts.reverse())
        } catch (err) {
            return fn.resData(null, "There is an unknown error, try again", 500, true)
        }
    }

    async fetch_most_like({ limit }) {
        try {
            limit = Number(limit)
            const posts = await PostCollection.find({ }, { _id: 1, likes: 1, createdAt: 1 }).limit(limit).sort({ likes: 1, createdAt: 1, })
            return fn.resData(posts.reverse())
        } catch (err) {
            return fn.resData(null, "There is an unknown error, try again", 500, true)
        }

    }

    async fetch_last_posts({ limit }) {
        try {
            limit = Number(limit)
            const posts = await PostCollection.find({ }, { _id: 1, createdAt: 1 }).limit(limit).sort({ createdAt: 1 })
            return fn.resData(posts.reverse())
        } catch (err) {
            return fn.resData(null, "There is an unknown error, try again", 500, true)
        }
    }
}

class Visits {
    async post_visit(data) {
        try {
            const { ip, userId, url, userAgent } = data
            let findVisitByIp = await VisitsCollection.findOne({ ip, url })
            let findVisitById = await VisitsCollection.findOne({ userId, url })


            if (!findVisitByIp)
                findVisitByIp = { }

            if (!findVisitById)
                findVisitById = { }

            if (findVisitByIp._id || findVisitById._id) {
                let findVisit = Object()

                if (findVisitByIp._id)
                    findVisit = findVisitByIp
                if (findVisitById._id)
                    findVisit = findVisitById

                data.visitCount = findVisit.visitCount + 1

                if  (findVisit.timeTaken > data.timeTaken) data.timeTaken = findVisit.timeTaken 

                const updatedVisit = await findVisit.updateOne(data)
                return fn.resData(updatedVisit)
            } else {
                const newVisit = new VisitsCollection(data)
                const visit = await newVisit.save()
                return fn.resData(visit)
            }
        } catch (err) {
            return fn.resData(null, "There is an unknown error, try again", 500, true)
        }
    }

    async post_visit_log({ data }) {
        try {
            const { visitors, url, date } = data

            let findVisitsLog = await VisitsLogCollection.findOne({ url, date })

            if (!findVisitsLog)
                findVisitsLog = { }

            if (findVisitsLog._id) {
                data.visitors = { ...findVisitsLog.visitors, ...visitors }

                const updatedVisitsLog = await findVisitsLog.updateOne(data)
                return fn.resData(updatedVisitsLog)
            } else {
                const newVisitsLog = new VisitsLogCollection(data)
                const visitsLog = await newVisitsLog.save()

                return fn.resData(visitsLog)

            }
        } catch (err) {
            return fn.resData(null, "There is an unknown error, try again", 500, true)
        }
    }

    async fetch_visit_count_url({ url }) {
        try {
            let visitsLog = await VisitsLogCollection.find({ url })
            let visit_count = 0
            visitsLog.forEach(v => {
                visit_count += v.visitors.length
            })
            return fn.resData(visit_count)
        } catch (err) {
            return fn.resData(null, "There is an unknown error, try again", 500, true)
        }

    }
}

class Upload {
    constructor() {
        this.path = "../../public/assets/data/upload"
        this.dirs = ["posts", "users"]
    }
    async upload_image({ imgData, dirname }) {
        try {
            const filename = v4()
            const newDirname = path.join(this.path, dirname)

            if (!fs.existsSync(newDirname)) {
                fs.mkdir(newDirname, (err) => {
                    if (err)
                        return fn.resData(null, "There is an unknown error, try again", 500, true)
                })
            }

            fs.writeFile(path.join(this.path, dirname, filename), imgData, (err) => {
                if (err)
                    return fn.resData(null, "There is an unknown error, try again", 500, true)
            })
           
            return fn.resData({ filename })
        } catch (err) {
            return fn.resData(null, "There is an unknown error, try again", 500, true)
        }
    }
    async delete_image(filedir) {
        try {
            fs.rm(path.join(this.path, filedir), (err) => {
                if (err)
                    return fn.resData(null, "There is an unknown error, try again", 500, true)
            })
            return fn.resData(null, "file has been daleted succssfully", 200)
        } catch (err) {
            return fn.resData(null, "There is an unknown error, try again", 500, true)
        }
    }

    async delete_user(userDir) {
        try {
            this.dirs.forEach(d => {
                rimraf(path.join(this.path, d, userDir), (err) => {
                    if (err)
                        return fn.resData(null, "There is an unknown error, try again", 500, true)
                })
            })
            return fn.resData(null, "user files has been daleted succssfully", 200)
        } catch (err) {
            return fn.resData(null, "There is an unknown error, try again", 500, true)
        }
    }
}

module.exports = {
    Auth,
    User,
    Post,
    Visits,
    Upload,
}

