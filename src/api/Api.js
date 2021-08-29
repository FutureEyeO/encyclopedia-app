import bcrypt from "bcrypt"
import { v4 } from "uuid"
import User from "../models/User"
import Login from "../models/Login"
import Functions from "./Functions"
import constants from "../constant/general"
import url from "url"
import rimraf from "rimraf"

export class Auth {
    async register(data) {
        try {
            // generate a hash password :
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(data.password, salt)

            data["password"] = hashedPassword
            // create new user : 
            const { ip } = data

            if (ip) {
                const newUser = new User(data)

                // save user and return response :
                const user = await newUser.save()
                let userData = await Functions.returnUserData(user._doc)
                return JSON.parse(userData)
            } else {
                return "vaild input"
            }
        } catch (err) {
            // return JSON.parse(err)
            console.error(err)
        }
    }

    async login(data) {
        try {
            const user = await User.findOne({ email: data.email })
            if (!user && !user._id) return "user not found"

            const validPassword = await bcrypt.compare(data.password, user.password)
            if (!validPassword) return "worng password"

            let userData = await returnUserData(user._doc)
            return JSON.parse(userData)
        } catch (err) {
            // return JSON.parse(err)
            console.error(err)
        }
    }

    async save_login(data) {
        try {
            const { email, password } = data

            const user = await User.findOne({ email: email })
            if (!user && !user._id) return res.status(404).send("user not found")

            const validPassword = await bcrypt.compare(password, user.password)
            if (!validPassword) return res.status(400).send("worng password")


            const createLogin = async () => {

                const salt = await bcrypt.genSalt(10)

                const userData = await returnUserData(user._doc)

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
                const newLogin = new Login(loginData)

                // save user and return response :
                const login = await newLogin.save()

                const loginData = await returnUserData(login._doc)

                return JSON.parse(loginData)
            }



            const loginCheck = await Login.findOne({ user_id: user._id })

            if (loginCheck && loginCheck._id) {

                let loginPassword = user._id + user.createdAt

                const validPassword = await bcrypt.compare(loginPassword, loginCheck.login_password)
                console.log(validPassword)
                if (!validPassword) res.status(400).send("worng password")

                let loginTimeHours = (Date.now() - loginCheck.login_time) / 3600000

                if (loginTimeHours > 44) {

                    await loginCheck.deleteOne()
                    await createLogin()

                } else {


                    const userData = await returnUserData(user._doc)

                    let loginData = {
                        user_agent: window.navigator.userAgent,
                        login_time: new Date().getTime(),
                        login_id: v4(),
                    }

                    loginData = { ...loginData, ...userData }

                    await loginCheck.updateOne(loginData)

                    const loginUpdate = await Login.findOne({ _id: loginCheck._id })

                    const loginData = await returnUserData(loginUpdate._doc)


                    return JSON.parse(loginData)

                }


            } else {

                await createLogin()

            }
        } catch (err) {
            console.error(err)
        }
    }

    async update_login(data) {
        try {
            const { loginId, userId } = data
            const user_agent = window.navigator.userAgent

            const user = await User.findOne({ _id: userId })
            if (!user && !user._id) return "user not found"

            const login = await Login.findOne({ login_id: loginId })

            if (login && login._id && user_agent == login.user_agent) {

                let loginPassword = user._id + user.createdAt

                const validPassword = await bcrypt.compare(loginPassword, login.login_password)
                console.log(validPassword)
                if (!validPassword) return "worng password"

                const userData = await returnUserData(login._doc)

                await login.updateOne(userData)

                const loginUpdate = await Login.findOne({ _id: login._id })

                const loginData = await returnUserData(loginUpdate._doc)


                return JSON.parse(loginData)
            }

        } catch (err) {
            console.error(err)
        }

    }

    async delete_login(data) {
        try {
            const { loginId, userId } = data

            const user = await User.findOne({ _id: userId }, { _id: 1, createdAt: 1 })
            if (!user && !user._id) return "user not found"

            const user_agent = window.navigator.userAgent

            if (user && user._id) {

                const login = await Login.findOne({ login_id: loginId })
                if (!login && !login._id) return "login not found"

                if (user_agent == login.user_agent) {

                    let loginPassword = user._id + user.createdAt

                    const validPassword = await bcrypt.compare(loginPassword, login.login_password)
                    if (!validPassword) return "worng password"

                    await login.deleteOne()
                    return "Login has deleted successfully"

                } else {
                    return "The login data is invalid"
                }
            }
        } catch (err) {
            console.error(err)
        }
    }

    async auto_login(data) {
        try {
            const { loginId, userId } = data

            const user = await User.findOne({ _id: userId }, { _id: 1, createdAt: 1 })
            if (!user && !user._id) return "user not found"

            const user_agent = window.navigator.userAgent

            if (user && user._id) {

                const login = await Login.findOne({ login_id: loginId })
                if (!login) return "login not found"


                if (user_agent == login.user_agent) {

                    let loginPassword = user._id + user.createdAt

                    const validPassword = await bcrypt.compare(loginPassword, login.login_password)
                    if (!validPassword) return res.status(400).send("worng password")

                    let loginTimeHours = (Date.now() - login.login_time) / 3600000

                    if (loginTimeHours > 44) {

                        login.deleteOne()
                        return "The login data is invalid"

                    } else {

                        const loginData = await returnUserData(login._doc)

                        return JSON.parse(loginData)

                    }
                } else {
                    return "The login data is invalid"
                }
            }
        } catch (err) {
            console.error(err)
        }
    }
}

export class User {
    async update_user({ currentId, userId, ...data }) {
        try {
            const { _id, __v, isAdmin, isAuthor, createdAt, ...updateData } = data

            const user = await User.findOne({ _id: userId })
            let currentUser = await User.findOne({ _id: currentId })
            currentUser = await returnUserData(currentUser._doc)

            if ((user && currentUser && userId === currentId) || (user && currentUser && currentUser.isAdmin)) {
                if (data.password) {
                    try {
                        const salt = await bcrypt.genSalt(10)
                        data.password = await bcrypt.hash(data.password, salt)

                    } catch (err) {
                        return { error: err, status: 500 }
                    }
                }


                await user.updateOne({ $set: updateData })

                let userUpdated = await User.findOne({ _id: userId })

                userUpdated = await returnUserData(userUpdated._doc)
                return JSON.parse({ data: userUpdated, status: 200 })

            } else {
                return { error: "None user with this id", status: 400 }
            }
        } catch (err) {
            return { error: err, status: 500 }
        }
    }

    async update_user_imges({ currentId, userId, ...data }) {
        try {
            const { currentId, userId } = data
            const user = await User.findOne({ _id: userId })
            let currentUser = await User.findOne({ _id: currentId })
            currentUser = await returnUserData(currentUser._doc)

            !data.coverImg ? data.coverImg = "" : null
            !data.profileImg ? data.profileImg = "" : null

            const { profileImg, coverImg, set } = data
            console.log(profileImg, coverImg)
            if ((user && currentUser && userId === currentId) || (user && currentUser && currentUser.isAdmin)) {
                if (set) {
                    await user.updateOne({ $set: { profileImg: profileImg, coverImg: coverImg } })
                } else {
                    await user.updateOne({ $set: { profileImg: user.profileImg + profileImg, coverImg: user.coverImg + coverImg } })
                }

                let userUpdated = await User.findOne({ userId })

                userUpdated = await returnUserData(userUpdated._doc)

                return JSON.parse({ data: userUpdated, status: 200 })

            } else {
                return { error: "None user with this id", status: 400 }
            }
        } catch (err) {
            return { error: err, status: 500 }
        }
    }

    async delete_user({ currentId, userId }) {
        try {
            const user = await User.findOne({ _id: userId }, { coverImg: 1, profileImg: 1, posts: 1, _id: 1 })

            let currentId = await User.findOne({ _id: currentId }, { _id })
            currentUser = await returnUserData(currentUser._doc)

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
                return "Account has been deleted"
            } else {
                return "None user with this id"
            }
        } catch (err) {
            return { error: err, status: 500 }
        }
    }

    async fetch_user({ userId, type }) {

        if (userId) {
            try {

                console.log(userId, type)
                let user = { }
                if (type == "username" || type == "user")
                    user = await User.findOne({ username: userId })
                else if (type == "userId" || type == "id")
                    user = await User.findOne({ _id: userId })

                console.log(user)

                let userData = await returnUserData(user._doc)

                return JSON.parse(userData)
            } catch (err) {
                return { error: err, status: 500 }
            }
        } else {
            return "None user with this id"
        }
    }

    async follow_user({ currentId, userId }) {
        if (userId !== currentId) {
            try {
                const currentUser = await User.findOne({ _id: currentId })
                const user = await User.findOne({ _id: userId })

                if (!currentUser.followings.includes(userId)) {

                    await currentUser.updateOne({ $push: { followings: userId } })
                    await user.updateOne({ $push: { followers: currentId } })
                    return { error: "User has been following", status: 400 }
                } else {
                    return { error: "You are already follow this user", status: 400 }
                }
            } catch (err) {
                return { error: err, status: 500 }
            }
        } else {
            return { error: "You can't follow yourself", status: 400 }
        }
    }

    async unfollow_user({ currentId, userId }) {
        if (currentId !== userId) {
            try {
                const currentUser = await User.findOne({ _id: currentId })
                const user = await User.findOne({ _id: userId })

                if (currentUser.followings.includes(userId)) {
                    await currentUser.updateOne({ $pull: { followings: userId } })
                    await user.updateOne({ $pull: { followers: currentId } })

                    return { error: "User has been unfollowing", status: 400 }
                } else {
                    return { error: "You havn't followed this user", status: 400 }
                }
            } catch (err) {
                return { error: err, status: 500 }
            }
        } else {
            return { error: "you cant follow yourself", status: 400 }
        }
    }

    async fetch_all_users() {
        try {
            const users = await User.find({ })
            let usersInfo = []
            users.forEach(async user => {
                let userData = await returnUserData(user._doc)
                usersInfo.push(userData)
            })
            return JSON.parse(usersInfo)

        } catch (err) {
            return { error: err, status: 500 }
        }
    }
}

export class Post {
    async create_post(data) {
        try {
            const { userId } = data
            if (userId) {
                const user = await User.findOne({ _id: userId })
                if (user && user._id) {
                    const newPost = new Post(data)
                    const post = await newPost.save()

                    await user.updateOne({ $push: { posts: post._id } })

                    return JSON.parse({ data: post, status: 200 })
                } else {
                    return { error: "bad request", status: 400 }
                }
            }
        } catch (err) {
            return { error: err, status: 500 }
        }
    }

    async update_post({ currentId, userId, postId, ...data }) {
        try {
            const post = await Post.findOne({ _id: postId }, { userId: 1 })
            const { userId, currentId, ...updateData } = data

            const currentUser = await User.findOne({ _id: currentId }, { posts: 1 })
            const user = await User.findOne({ _id: userId }, { posts: 1 })
            if ((post._id && user._id && user.posts.includes(userId) && userId === post.userId) && (post._id && user._id && currentUser._id && currentUser.isAdmin && currentUser.isAuthor)) {
                await post.updateOne({ $set: updateData })
                const postUpdated = await Post.findOne({ _id: postId })
                return JSON.parse({ data: postUpdated, status: 200 })
            } else {
                return { error: "None user or post with this id", status: 400 }
            }
        } catch (err) {
            return { error: err, status: 500 }
        }
    }

    async update_post_imges() {
        try {
            const post = await Post.findOne({ _id: req.params.id }, { userId: 1, coverImg: 1 })
    
            !req.body.coverImg ? req.body.coverImg = "" : null
    
            const { userId, coverImg, set } = req.body
            const user = await User.findOne({ _id: userId }, { posts: 1 })
            if (post && user && user.posts.includes(req.params.id) && userId === post.userId) {
                if (set) {
                    await post.updateOne({ $set: { coverImg: coverImg } })
                } else {
                    await post.updateOne({ $set: { coverImg: post.coverImg + coverImg } })
                }
                const postUpdated = await Post.findOne({ _id: req.params.id })
                res.status(200).json(postUpdated)
            } else {
                return res.status(404).send("None user or post with this id")
            }
        } catch (err) {
            return res.status(500).json(err)
        }
    }
}