import React, { useContext, useRef, useState, useEffect } from 'react'
import { Redirect, useHistory, useParams, Link } from 'react-router-dom';

import url_join from "url-join"
import uuid from "uuid"
import Api from '../functions/Api';
import { AuthContext } from '../context/AuthContext';
import { updateLoginApiContext } from "../ApiContext"


import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, LinearProgress } from "@material-ui/core"
import KeyboardBackspaceRoundedIcon from '@material-ui/icons/KeyboardBackspaceRounded';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import Backdrop from '@material-ui/core/Backdrop';

import Browser from '../functions/Browser';
import constants from "../constant/general"

const useStyles = makeStyles(() => ({
    backdrop: {
        zIndex: 1000000000000,
        color: '#fff',
    },
}));


export default function EditPost() {

    const context = useContext(AuthContext)

    const { postId } = useParams()

    const history = useHistory()

    const inputCategory = useRef()
    const inputText = useRef()
    const inputRelatedHash = useRef()
    // const inputMedia = useRef()
    const inputTitle = useRef()
    const inputDescription = useRef()

    const [post, setPost] = useState({ })
    const [display, setDisplay] = useState(false)
    const [isFetching, setIsFetching] = useState(false)
    const [isFinishing, setIsFinishing] = useState(false)

    const classes = useStyles();
    const [openBackdrop, setOpenBackdrop] = React.useState(false);

    const { ALLOWED_IMG, ALLOWED_IMG_SIZE } = constants


    // const ALLOWED_IMG = ["image/png", "image/jpeg"]
    // const ALLOWED_IMG_SIZE = 5



    useEffect(async () => {
        if (!context.isFetching) {
            if (post._id) {
                if ((context.user._id == post.userId && context.user.isAuthor) || (context.user.isAdmin && context.user.isAuthor)) {
                    return setDisplay(true)
                } else {

                    history.push(`/p/${post._id}`)
                }
            }
        }
    }, [context, post])



    useEffect(async () => {

        if (!context.isFetching) {
            if (postId) {
                Api.fetchPost(postId).then(res => {
                    setPost(res.data)

                })
            } else {

            }
        }

    }, [postId])

    useEffect(async () => {
        if (post._id && inputTitle.current) {
            inputTitle.current.value = post.title
            inputCategory.current.value = post.category
            inputText.current.value = post.text
            let relatedHash = ""
            relatedHash += post.relatedHash.map(i => ` ${i} `)
            inputRelatedHash.current.value = relatedHash
            inputDescription.current.value = post.desc
        }
    }, [post, inputTitle.current])

    useEffect(() => {

        updateLoginApiContext(context.dispatch)

    }, [isFinishing])


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!isFetching) {

            setIsFinishing(false)
            setOpenBackdrop(true)
            setIsFetching(true)


            // const [file] = inputMedia.current.files

            let relatedHash = inputRelatedHash.current.value.split(" ")
            relatedHash = relatedHash.map(i => {
                i = i.trim()
                if (i != "")
                    return i
            })
            console.log(relatedHash)

            const postData = {
                userId: context.user._id,
                ip: (await (await fetch("https://api.ipify.org/?format=json")).json()).ip,
                title: inputTitle.current.value,
                category: inputCategory.current.value,
                text: inputText.current.value,
                relatedHash: relatedHash,
                desc: inputDescription.current.value,
                coverImd: ""
            }

            console.log(postData)

            try {
                // const fromData = new FormData()
                // fromData.append("file", file)


                await Api.updatePost(post._id, context.user._id, postData).then(async res => {
                    console.log(res)

                    setIsFetching(false)
                    setIsFinishing(true)
                })

            } catch (err) {
                console.error(err)
            }

        }
    }


    const handleUpload = async (e) => {

        const [file] = e.target.files

        if (file && ALLOWED_IMG.includes(file.type)) {

            const fileSize = file.size / 1000 / 1000

            const img = document.getElementById("preview-img");

            if (file && fileSize < ALLOWED_IMG_SIZE) {
                img.hidden = false

                const reader = new FileReader();
                reader.onload = (event) => {
                    let imgDataurl = event.target.result;
                    img.style.backgroundImage = `url(${imgDataurl})`
                };
                reader.readAsDataURL(file);

            }

        }
    }



    return (
        display ?

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
                    isFinishing ? <Redirect exact to={`/p/${post._id}`} /> : null
                }
                <div className="card text-center m-auto custom-card" style={{ maxWidth: "500px" }}>

                    <div className="card-header">
                        <h2 style={{ textAlign: "end" }}>
                            <Link to={`/p/${post._id}`}>
                                {post.title} <KeyboardBackspaceRoundedIcon />
                            </Link>
                        </h2>
                        EDIT POST
                    </div>
                    {
                        isFetching ?
                            <LinearProgress />
                            :
                            <div className="bg-light" style={{ padding: ".12rem" }}></div>
                    }
                    <div className="card-body">

                        <form className="row g-4" onSubmit={handleSubmit}>

                            <div className="col-md-6">
                                <label for="inputCategory" className="form-label">Category</label>
                                <input type="text" className="form-control" id="inputCategory" placeholder="Category" ref={inputCategory} maxlength="40" />
                            </div>
                            <div className="col-md-6">
                                <label for="inputTitle" className="form-label">Title</label>
                                <input type="text" className="form-control" id="inputTitle" placeholder="Title" ref={inputTitle} maxlength="40" />
                            </div>
                            <div className="col-md-12">
                                <label for="inputText" className="form-label">Text</label>
                                <textarea className="form-control" id="inputText" rows="3" ref={inputText} maxlength="50000"></textarea>
                            </div>
                            <div className="g-4 mb-5 mt-5">
                                <hr />
                                {/* <div className="col-md-12 mb-5">
                                    <label for="inputMedia" className="form-label">Media File</label>
                                    <input type="file" className="form-control" id="inputMedia" placeholder="Media File" onChange={handleUpload} accept="image/png, image/jpeg" ref={inputMedia} />
                                </div> */}
                                <div id="preview" style={{ height: "200px" }}>
                                    <div sizes="614px" className={`card-img-bottom previewPostCoverImg  w-100 h-100`} id="preview-img" style={{ backgroundImage: `url(${post.coverImg})` }}>
                                    </div>
                                </div>
                                <hr />
                            </div>

                            <div className="col-md-12">
                                <label for="inputDescription" className="form-label">Description</label>
                                <textarea className="form-control" id="inputDescription" rows="3" ref={inputDescription} maxlength="150"></textarea>
                            </div>

                            <div className="col-md-12">
                                <label for="inputRelatedHash" className="form-label">RelatedHash</label>
                                <input type="text" className="form-control" id="inputRelatedHash" placeholder="RelatedHash" ref={inputRelatedHash} maxlength="100" />
                            </div>

                            <div className="col-12">
                                <button type="submit" className="btn btn-primary">

                                    <div>

                                        {isFetching ? "Loading" : "Save"}

                                        {
                                            isFetching ?
                                                <CircularProgress disableShrink color="white" size="20px" className="me-1" thickness={5} style={{ marginBottom: "-5px" }} />
                                                :
                                                <SendRoundedIcon className="me-1" />
                                        }
                                    </div>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </React.Fragment>

            :

            <React.Fragment>
                <Backdrop className={classes.backdrop} open={true}>
                    <CircularProgress color="light" />
                </Backdrop>
            </React.Fragment>
    )
}
