import React, { Component, useContext, useState, useEffect, useRef } from 'react'

import { Link, useParams, useHistory } from "react-router-dom"

import { makeStyles, TextField } from '@material-ui/core';

import Button from '@material-ui/core/Button';
import { List, ListItem, ListItemIcon, ListItemText, Divider } from '@material-ui/core';
import { Zoom, Slide } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { v4 } from 'uuid';

import LabelImportantRoundedIcon from '@material-ui/icons/LabelImportantRounded';
import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@material-ui/icons/FavoriteBorderRounded';
import MoreHorizRoundedIcon from '@material-ui/icons/MoreHorizRounded';
import FileCopyRoundedIcon from '@material-ui/icons/FileCopyRounded';
import WatchLaterRoundedIcon from '@material-ui/icons/WatchLaterRounded';
import VpnKeyRoundedIcon from '@material-ui/icons/VpnKeyRounded';
import LockOpenRoundedIcon from '@material-ui/icons/LockOpenRounded';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';

import { AuthContext } from '../context/AuthContext';
import Api from '../functions/Api';

import LoginModle from '../components/elements/LoginModle';

import { format } from "timeago.js"

const useStyles = makeStyles({
    postCard: {
        borderRadius: "15px",
        textAling: "center",
        transition: "all 1s ease",
    },
    postCardHeader: {
        backgroundSize: "cover",
        backgroundPosition: "center center",
        height: "360px",
        borderRadius: "15px",
    },
    postCardLink: {
        borderRadius: "15px 15px 0 0",
        fontSize: "18px",
        left: "0",
        top: "0"
    },
    postCardBInfo: {
        fontSize: "14px",
        padding: "4px 8px"
    },
    commentInput: {
        fontFamily: "inherit",
        "*": {
            fontFamily: "inherit"
        }
    },
    commentBox: {
        padding: "10px",
        border: "2px solid #dadada",
        borderRadius: "10px"
    },
    commentMenu: {
        position: "absolute",
        left: "10px",
        borderRadius: "10px",
        boxShadow: "0 0 70px 0 #6e6e6e",
        backgroundColor: "rgba(240, 240, 240, 0.95) !important",
    }

})


function RelatedHash({ text }) {
    return (
        <div className={`m-2`}>

            <Button className="p-0 rounded-pill" style={{ minWidth: "auto", fontFamily: "inherit" }} >
                <Link to={`/search/?labels=${text}`} className={`blue lighten-4 rounded-pill`} style={{ fontSize: "14px", padding: "4px 10px", }} >
                    {text} <LabelImportantRoundedIcon style={{ fontSize: "1.2rem" }} />
                </Link>
            </Button>
        </div>
    )
}



function Comment({ comment, postId }) {
    const [user, setUser] = useState({ })
    const [open, setOpen] = useState(false)
    const [menuId, setMenuId] = useState(v4())
    const [_comment, setComment] = useState([])
    const context = useContext(AuthContext)
    const classes = useStyles()

    useEffect(() => {
        setComment(comment)
        Api.fetchUser(comment.userId).then(res => {
            setUser(res.data)
        })
    }, [comment])

    const handleOpen = () => {
        setOpen(!open)
    }

    const handleDeleteComment = async () => {
        if ((context.user?._id == comment.userId) || (context.user?.isAuthor && user.isAdmin)) {
            await Api.deleteCommentPost(postId, context.user._id, comment.id).then(res => {
                window.location.reload()
            })
        }
    }

    return (
        <React.Fragment>
            <div className={`m-2 ${classes.commentBox}`}>
                <div className="d-flex justify-content-between mb-1">

                    <div>
                        <Link to={`/profile/${user.username}`} style={{ color: "inherit" }}>
                            <Button className={``} style={{ textTransform: "unset" }} color="defualt">
                                <div className="profileImg-sm" style={{ backgroundImage: `url(${user.profileImg})` }}></div>
                                <small className="me-1">{user.username}</small>
                            </Button>
                        </Link>
                    </div>
                    <div>
                        <small>
                            {
                                format(new Date(comment.time))
                            }
                        </small>
                        <Button aria-controls={`commentMenu${menuId}`} className="indigo lighten-4 rounded-circle p-1 m-2" style={{ color: "#5c6bc0", fontSize: "14px", minWidth: "auto", }} data-bs-toggle="modal" data-bs-target={`#commentMenu${menuId}`}>
                            <MoreHorizRoundedIcon />
                        </Button>

                        <div className={`modal fade`} id={`commentMenu${menuId}`} data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby={`commentMenuLabel${menuId}`} aria-hidden="false">
                            <div className={`modal-dialog modal-dialog-centered `}>
                                <div className={`modal-content`}>
                                    <div class="modal-header">
                                        <h5 class="modal-title" id={`commentMenuLabel${menuId}`}>

                                        </h5>
                                        <button type="button" class="btn-close ms-0 me-auto" data-bs-dismiss="modal" aria-label="Close" id={`closeCommentMenu${menuId}`}></button>
                                    </div>
                                    <div class="modal-body">
                                        <p>
                                        </p>
                                        {
                                            comment.id ?
                                                <React.Fragment>
                                                    <Button className="d-block w-100 rounded-pill m-2" style={{ fontFamily: "inherit" }} >
                                                        اضافة بلاغ
                                                    </Button>
                                                    {
                                                        (context.user?._id == comment.userId) || (context.user?.isAuthor && user.isAdmin) ?
                                                            <React.Fragment>

                                                                <Button className="d-block w-100 rounded-pill m-2" style={{ fontFamily: "inherit" }} color="secondary" onClick={handleDeleteComment}>
                                                                    حذف التعليق
                                                                </Button>

                                                            </React.Fragment>
                                                            :
                                                            null
                                                    }

                                                </React.Fragment>
                                                :
                                                null
                                        }
                                    </div>
                                    <div class="modal-footer">
                                        {/* <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button> */}
                                        {/* <button type="button" class="btn btn-primary">Understood</button> */}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>


                </div>
                {comment.text}
            </div>

        </React.Fragment>

    )
}

export default function Post({ }) {

    const context = useContext(AuthContext)
    const history = useHistory()

    const { postId } = useParams()

    const classes = useStyles()

    const [isLike, setIsLike] = useState(false)
    const [post, setPost] = useState({ })

    const [modleId, setModleId] = useState(v4())

    const likeButton = useRef()
    const commentButton = useRef()
    const commentForm = useRef()
    const commentText = useRef()
    const closeOptionsModel = useRef()

    const fetchPost = () => {
        Api.fetchPost(postId).then(res => {
            setPost(res.data)
        })
    }



    useEffect(() => {
        fetchPost()
        Api.addViewsCountPost(postId)
    }, [postId])

    useEffect(() => {
        if (context.user?._id)
            setIsLike(post.likes?.includes(context.user?._id))
    }, [post, context])

    const handleLike = (e) => {

        if (!context.user?._id) {
            const i = likeButton.current.getAttribute("data-bs-target")
            likeButton.current.setAttribute("data-bs-toggle", "modal")
            likeButton.current.setAttribute("data-bs-target", "#loginBackdrop")
            !i && likeButton.current.click()
            return;
        }

        if (context.user?._id && post._id) {
            Api.likePost(post._id, context.user?._id).then(res => {
                fetchPost()
            })
        }
    }

    const handleRedirect = (path) => {
        history.push(path)
    }

    const handleCpoyPostUrl = () => {
        window.document.querySelector(`#closeOptionsModel${modleId}`).click()
        navigator.permissions.query({ name: "clipboard-write" }).then(result => {
            if (result.state == "granted" || result.state == "prompt") {
                window.navigator.clipboard.writeText(`${window.location.host}/p/${post._id}`).then(function () {
                    /* clipboard successfully set */

                }, function () {
                    /* clipboard write failed */
                });
            }
        });

    }

    const handleDeletePost = async () => {
        if (post._id && (context.user?._id == post.userId && context.user?.isAuthor) || (context.user?.isAdmin && context.user?.isAuthor)) {
            const answer = window.confirm("هل انت متاكد من انك تريد حذف المنشورة ؟ فلا يمكن استعادتها")
            if (answer) {
                await Api.deletePost(post._id, context.user._id).then(res => {
                    // console.log(res.data)
                    // window.document.querySelector(`#closeOptionsModel${modleId}`).click()
                    // history.push(`/profile/${context.user.username}`)
                    window.location.pathname = `/profile/${context.user.username}`
                })
            }
        }
    }

    const handlePostComment = async (e) => {
        e.preventDefault();

        if (!context.user?._id) {
            const i = likeButton.current.getAttribute("data-bs-target")
            likeButton.current.setAttribute("data-bs-toggle", "modal")
            likeButton.current.setAttribute("data-bs-target", "#loginBackdrop")
            !i && likeButton.current.click()
            return;
        }

        if (context.user._id && post._id) {

            let comment = commentText.current.value
            Api.commentPost(post._id, context.user._id, comment).then(res => {
                console.log(res.data)
                fetchPost()
            })
        }
    }


    return (
        <React.Fragment>

            <div className={`grey lighten-3 d-block m-3 ${classes.postCard}`}>
                <div className={`p-3 d-block position-relative`} style={{ height: "100%" }}>
                    <Button className="p-0 rounded-pill float-start" style={{ minWidth: "auto", fontFamily: "inherit" }}>
                        <Link to={`/search/?category=${post.category}`} className={`blue lighten-4 rounded-pill`} style={{ padding: "5px 10px", fontFamily: "inherit" }} >
                            {post.category}
                        </Link>
                    </Button>

                    <h2>{post.title}</h2>

                    <div className="line"></div>

                    <div className="mb-3">
                        {post.desc}
                    </div>

                    <div className={`w-100 ${classes.postCardHeader}`} style={{ backgroundImage: `url(${post.coverImg})` }}></div>

                    <div className="mt-2 d-flex flex-column justify-content-between">
                        <p>
                            {post.text}
                        </p>
                        <div className="d-flex flex-wrap justify-content-between mt-5 mb-5">

                            <div className="d-flex flex-wrap">

                                <Button className={`blue-grey lighten-4 rounded-pill m-2 ${classes.postCardBInfo}`} style={{ color: "#78909c", }}>
                                    {post.viewsCount} <VisibilityRoundedIcon style={{ fontSize: "1.2rem" }} />
                                </Button>

                                <Button className={`red lighten-4 rounded-pill m-2 ${classes.postCardBInfo}`} style={{ color: "#ef5350", }} onClick={handleLike} ref={likeButton}>
                                    {post.likes?.length}
                                    {
                                        isLike ?
                                            <FavoriteRoundedIcon style={{ fontSize: "1.2rem" }} />
                                            :
                                            <FavoriteBorderRoundedIcon style={{ fontSize: "1.2rem" }} />
                                    }
                                </Button>

                                <Button className={`amber lighten-3 rounded-pill m-2 ${classes.postCardBInfo}`} style={{ color: "#ff8f00  ", }}>
                                    {format(post.createdAt)} <WatchLaterRoundedIcon style={{ fontSize: "1.2rem" }} />
                                </Button>

                            </div>
                            <div className="float-end d-flex">

                                <Button className="indigo lighten-4 rounded-circle p-1 m-2" style={{ color: "#5c6bc0 ", fontSize: "14px", minWidth: "auto", }} data-bs-toggle="modal" data-bs-target={`#optionsBackdrop${modleId}`}>
                                    <MoreHorizRoundedIcon />
                                </Button>


                            </div>
                        </div>

                        <h4 className="mt-2 mb-4">العناوين المرتبطة</h4>
                        {/* <div className="line"></div> */}

                        <div className={`d-flex flex-wrap mb-5`}>
                            {
                                post.relatedHash?.map(hash => {
                                    return <RelatedHash id={v4()} text={hash} />
                                })
                            }
                        </div>
                        <form className="p-2 mb-4 d-flex" onSubmit={handlePostComment}>

                            <Button type="submit" style={{ fontFamily: "inherit", }} variant="contained" color="primary">نشر</Button>
                            <TextField type="text" className={`flex-grow-1 me-2 ${classes.commentInput}`} id="comment-basic" inputRef={commentText} label="اضف تعليقك" variant="filled" />

                        </form>
                        <div>
                            {
                                post.comments?.map(c => {

                                    return <Comment id={v4()} comment={c} postId={post._id} />
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>


            <div className={`modal fade`} id={`optionsBackdrop${modleId}`} data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby={`optionsBackdropLabel${modleId}`} aria-hidden="false">
                <div className={`modal-dialog modal-dialog-centered `}>
                    <div className={`modal-content`}>
                        <div class="modal-header">
                            <h5 class="modal-title" id={`optionsBackdropLabel${modleId}`}>
                                {post.title}
                            </h5>
                            <button type="button" class="btn-close ms-0 me-auto" data-bs-dismiss="modal" aria-label="Close" id={`closeOptionsModel${modleId}`}></button>
                        </div>
                        <div class="modal-body">
                            <p>
                            </p>
                            {
                                post._id ?
                                    <React.Fragment>

                                        <Button className="d-block w-100 rounded-pill m-2" style={{ fontFamily: "inherit" }} onClick={handleCpoyPostUrl}>
                                            نسخ الرابط
                                        </Button>
                                        <Button className="d-block w-100 rounded-pill m-2" style={{ fontFamily: "inherit" }} >
                                            اضافة بلاغ
                                        </Button>
                                        <Button className="d-block w-100 rounded-pill m-2" style={{ fontFamily: "inherit" }} >
                                            اضافة اقتراح
                                        </Button>
                                        {
                                            (context.user?._id == post.userId && context.user?.isAuthor) || (context.user?.isAdmin && context.user?.isAuthor) ?
                                                <React.Fragment>
                                                    <Button className="d-block w-100 rounded-pill m-2" style={{ fontFamily: "inherit" }} onClick={() => handleRedirect(`/edit/post/${post._id}`)} data-bs-dismiss="modal" aria-label="Close">
                                                        تعديل المنشورة
                                                    </Button>
                                                    <Button className="d-block w-100 rounded-pill m-2" style={{ fontFamily: "inherit" }} color="secondary" onClick={handleDeletePost}>
                                                        حذف المنشورة
                                                    </Button>
                                                    <Button className="d-block w-100 rounded-pill m-2" style={{ fontFamily: "inherit" }}>
                                                        التقارير و الاحصائيات
                                                    </Button>
                                                </React.Fragment>
                                                :
                                                null
                                        }

                                    </React.Fragment>
                                    :
                                    null
                            }
                        </div>
                        <div class="modal-footer">
                            {/* <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button> */}
                            {/* <button type="button" class="btn btn-primary">Understood</button> */}
                        </div>
                    </div>
                </div>
            </div>

            <LoginModle />


        </React.Fragment>

    )
}
