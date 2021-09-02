import React, { Component, useRef, useState, useEffect, useContext } from 'react'
import { Redirect, useParams, useHistory } from 'react-router-dom';

import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import LockOpenRoundedIcon from '@material-ui/icons/LockOpenRounded';

import Api from '../functions/Api';
import Browser from '../functions/Browser';
import constants from "../constant/general"

import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import GitHubIcon from '@material-ui/icons/GitHub';
import FacebookIcon from '@material-ui/icons/Facebook';
import EmailRoundedIcon from '@material-ui/icons/EmailRounded';
import YouTubeIcon from '@material-ui/icons/YouTube';

import { AuthContext } from '../context/AuthContext';
import { loginApiContext, updateLoginApiContext } from '../ApiContext';

import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, LinearProgress } from "@material-ui/core"
import Backdrop from '@material-ui/core/Backdrop';


const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: 1000000000000,
        color: '#fff',
    },
}));

export default function EditProfile() {

    const context = useContext(AuthContext)

    const { userId } = useParams()

    const history = useHistory()


    const classes = useStyles();

    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const [isFetching, setIsFetching] = useState(false)
    const [isFinishing, setIsFinishing] = useState(false)

    const [user, setUser] = useState(false)
    const [display, setDisplay] = useState(false)


    const inputEmail = useRef()
    const inputUsername = useRef()
    const inputName = useRef()
    // const inputCity = useRef()
    // const inputFrom = useRef()
    const inputDescription = useRef()
    // const inputCoverImg = useRef()
    // const inputProfileImg = useRef()
    const inputPublicEmail = useRef()
    const inputGithub = useRef()
    const inputTwitter = useRef()
    const inputInstagram = useRef()
    const inputYoutube = useRef()
    const inputFacebook = useRef()

    const { ALLOWED_IMG, ALLOWED_IMG_SIZE } = constants


    useEffect(async () => {
        if (!context.isFetching) {
            if (user._id) {
                if ((context.user._id == user._id && context.user.isAuthor) || (context.user.isAdmin && context.user.isAuthor)) {
                    return setDisplay(true)
                } else {

                    history.push(`/profile/${user.username}`)
                }
            }
        }
    }, [context, user])


    useEffect(async () => {

        if (!context.isFetching) {
            if (userId) {
                Api.fetchUser(userId).then(res => {
                    setUser(res.data)

                })
            } else {

            }
        }

    }, [userId])

    useEffect(async () => {
        if (user._id && inputEmail.current) {
            inputEmail.current.value = user.email
            inputUsername.current.value = user.username
            inputName.current.value = user.name
            inputDescription.current.value = user.desc
            if (user.publicEmail)
                inputPublicEmail.current.value = user.publicEmail
            console.log(user.socialMedia, user.socialMedia == {})
            if (user.socialMedia != {}) {

                inputGithub.current.value = user.socialMedia.github
                inputTwitter.current.value = user.socialMedia.twitter
                inputInstagram.current.value = user.socialMedia.instagram
                inputYoutube.current.value = user.socialMedia.youtube
                inputFacebook.current.value = user.socialMedia.facebook
            }
        }
    }, [user, inputEmail.current])


    function checkUserValidate(username) {
        let validcharacters = '1234567890-_.abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

        let usernameCheck = username.split("")
        usernameCheck = usernameCheck.map(uchar => validcharacters.includes(uchar))
        console.log(usernameCheck)
        if (usernameCheck.includes(false)) {
            return false
        } else {
            return true
        }

    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setOpenBackdrop(true)
        if (!context.isFetching) {

            // if (inputPassword.current.value != inputPasswordConfirmation.current.value) {
            //     return inputPasswordConfirmation.current.setCustomValidity("Password don't match!")
            // }

            // if (!checkUserValidate(inputUsername.current.value)) {
            //     return inputUsername.current.setCustomValidity("Validate user")
            // }


            // const coverImg = inputCoverImg.current.files[0]
            // const profileImg = inputProfileImg.current.files[0]

            const userData = {
                email: inputEmail.current.value.trim(),
                ip: (await (await fetch("https://api.ipify.org/?format=json")).json()).ip,
                username: inputUsername.current.value.trim(),
                name: inputName.current.value.trim(),
                desc: inputDescription.current.value.trim(),
            }
            const socialMediaData = {

                github: inputGithub.current.value.trim(),
                twitter: inputTwitter.current.value.trim(),
                instagram: inputInstagram.current.value.trim(),
                youtube: inputYoutube.current.value.trim(),
                facebook: inputFacebook.current.value.trim(),

            }

            if (socialMediaData.twitter != ""
                || socialMediaData.instagram != ""
                || socialMediaData.youtube != ""
                || socialMediaData.facebook != ""
                || socialMediaData.github != ""
            ) {

                userData["socialMedia"] = socialMediaData
            }

            if (inputPublicEmail.current.value.trim() != "") {
                userData["publicEmail"] = inputPublicEmail.current.value.trim()
            }


            try {
                setIsFetching(true)
                setIsFinishing(false)


                // const fromData = new FormData()
                // fromData.append("coverImg", coverImg)
                // fromData.append("profileImg", profileImg)

                // console.log(userData)

                // if (coverImg != {}) coverImg.id = "coverImg"
                // if (profileImg != {}) profileImg.id = "profileImg"



                await Api.updateUser(context.user._id, user._id, userData).then(async res => {
                    console.log(res)
                    if (res.status == 200) {
                        // console.log(coverImg, profileImg)
                        // console.log(!coverImg, !profileImg)
                        // if (coverImg && profileImg) {

                        //     const imgData = {
                        //         set: true
                        //     }


                        //     if (coverImg != {}) imgData.coverImg = ""
                        //     if (profileImg != {}) imgData.profileImg = ""

                        //     console.log(imgData)


                        //     await Api.updateUserImg(res.data._id, res.data._id, imgData, fromData)

                        // }


                        updateLoginApiContext(context.dispatch).then(res => {
                            setIsFetching(false)
                            setIsFinishing(true)

                        })
                    }
                })

            } catch (err) {
                setIsFetching(false)
            }
        }
    }


    const handleUpload = async (e) => {

        const [file] = e.target.files

        if (file && ALLOWED_IMG.includes(file.type)) {

            let img = { }
            let quality = 7

            const fileSize = file.size / 1000 / 1000

            if (e.target.attributes.id.value == "inputCoverImg") {

                img = document.getElementById("preview-coverImg")
                // quality = .3
            }
            else if (e.target.attributes.id.value == "inputProfileImg") {

                img = document.getElementById("preview-profileImg")
                // quality = .2
            }

            if (file && fileSize < ALLOWED_IMG_SIZE) {
                img.hidden = false

                const reader = new FileReader();
                reader.onload = (event) => {
                    let imgDataUrl = event.target.result;
                    img.style.backgroundImage = `url(${imgDataUrl})`

                    // Browser.resizeImage(imgDataUrl, file.type, quality).then(res => {
                    //     let newFileSize = res.length / 100000
                    //     console.log(res, newFileSize)
                    //     if (newFileSize < 1) {
                    //         img.style.backgroundImage = `url(${res})`
                    //         console.log(img.style.backgroundImage)
                    //     }
                    // })
                };
                reader.readAsDataURL(file);

            }

        }
    }


    return (
        <React.Fragment>

            {
                isFetching ?
                    <Backdrop className={classes.backdrop} open={openBackdrop}>
                        <CircularProgress color="light" />
                    </Backdrop>
                    :
                    openBackdrop ? setOpenBackdrop(false) : null
            }
            {
                isFinishing ? window.location.pathname = `/profile/${user.username}` : null
            }
            <div className="card text-center m-auto custom-card" style={{ maxWidth: "500px" }}>


                <div className="card-header">
                    EDIT PROFILE
                </div>
                {

                    isFetching ?
                        <LinearProgress />
                        :
                        <div className="bg-light" style={{ padding: ".12rem" }}></div>
                }
                <div className="card-body">
                    <form className="row g-4 " onSubmit={handleSubmit}>
                        <div className="col-md-6">
                            <label for="inputEmail" className="form-label">Email</label>
                            <input type="email" className="form-control" id="inputEmail" placeholder="Email" ref={inputEmail} required />
                        </div>
                        {/* <div className="col-md-6">
                            <label for="inputPassword" className="form-label">Password</label>
                            <input type="password" className="form-control" id="inputPassword" minLength="6" placeholder="Password" ref={inputPassword} required />
                        </div>
                        <div className="col-md-6">
                            <label for="inputPasswordConfirmation" className="form-label">Password Confirmation</label>
                            <input type="password" className="form-control" id="inputPasswordConfirmation" minLength="6" placeholder="Password Confirmation" ref={inputPasswordConfirmation} required />
                        </div> */}
                        <div className="col-12">
                            <label for="inputUsername" className="form-label">Username</label>
                            <input type="text" className="form-control" id="inputUsername" placeholder="Username" required ref={inputUsername} />
                        </div>
                        <div className="col-12">
                            <label for="inputPublicEmail" className="form-label">Public Email <EmailRoundedIcon /></label>
                            <input type="text" className="form-control" id="inputPublicEmail" placeholder="Public Email" ref={inputPublicEmail} />
                        </div>

                        <div className="col-12">
                            <label for="inputName" className="form-label">Your Name</label>
                            <input type="text" className="form-control" id="inputName" placeholder="You Name" ref={inputName} required />
                        </div>

                        <div className="g-4 mb-5 mt-5">
                            <hr />
                            {/* <div className="col-md-12 mb-5">
                                <label for="inputProfileImg" className="form-label">Profile Image</label>
                                <input type="file" className="form-control" id="inputProfileImg" onChange={handleUpload} placeholder="profile image" accept="image/png, image/jpeg" ref={inputProfileImg} required />
                            </div>
                            <div className="col-md-12 mb-5">
                                <label for="inputCoverImg" className="form-label">Cover Image</label>
                                <input type="file" className="form-control" id="inputCoverImg" onChange={handleUpload} placeholder="profile image" accept="image/png, image/jpeg" ref={inputCoverImg} required />
                            </div> */}

                            <div id="preview">
                                <div className={`card-img-top profileDiv-coverImg`} id="preview-coverImg" style={{ backgroundImage: `url(${user.coverImg})` }} >
                                    <div className={`profileDiv-profileImg shadow-lg p-1 bg-body rounded-circle`} id="preview-profileImg" style={{ backgroundImage: `url(${user.profileImg})` }}>
                                    </div>
                                </div>
                            </div>

                            <hr />
                        </div>

                        <div className="col-md-12">
                            <label for="inputDescription" className="form-label">Description</label>
                            <textarea className="form-control" id="inputDescription" rows="3" ref={inputDescription}></textarea>
                        </div>

                        <h2>Social Media</h2>
                        <div className="col-12">
                            <label for="inputGithub" className="form-label">Github <GitHubIcon /></label>
                            <input type="text" className="form-control" id="inputGithub" placeholder="" ref={inputGithub} />
                        </div>
                        <div className="col-12">
                            <label for="inputTwitter" className="form-label">Twitter <TwitterIcon /></label>
                            <input type="text" className="form-control" id="inputTwitter" placeholder="" ref={inputTwitter} />
                        </div>
                        <div className="col-12">
                            <label for="inputInstagram" className="form-label">Instagram <InstagramIcon /></label>
                            <input type="text" className="form-control" id="inputInstagram" placeholder="" ref={inputInstagram} />
                        </div>
                        <div className="col-12">
                            <label for="inputYoutube" className="form-label">Youtube <YouTubeIcon /></label>
                            <input type="text" className="form-control" id="inputYoutube" placeholder="" ref={inputYoutube} />
                        </div>
                        <div className="col-12">
                            <label for="inputFacebook" className="form-label">Facebook <FacebookIcon /></label>
                            <input type="text" className="form-control" id="inputFacebook" placeholder="" ref={inputFacebook} />
                        </div>



                        <div className="col-12">
                            <button type="submit" className="btn btn-primary">
                                <div>

                                    {isFetching ? "Loading" : "Save"}

                                    {
                                        isFetching ?
                                            <CircularProgress disableShrink color="white" size="20px" className="me-1" thickness={5} style={{ marginBottom: "-5px" }} />
                                            :
                                            <ExitToAppRoundedIcon className="me-1" />
                                    }
                                </div>
                            </button>
                        </div>
                    </form>
                </div>
                {/* <div className="card-footer text-muted"> */}
                    {/* I have an account - <a href="/login">login </a> */}
                {/* </div> */}
            </div>
        </React.Fragment>
    )
}

