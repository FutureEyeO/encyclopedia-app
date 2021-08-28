import React, { Component, useContext, useState, useEffect } from 'react'

import { Link, useHistory } from "react-router-dom"

import { makeStyles } from '@material-ui/core';

import Button from '@material-ui/core/Button';

import { v4 } from 'uuid';

import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded';
import FavoriteBorderRoundedIcon from '@material-ui/icons/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import MoreHorizRoundedIcon from '@material-ui/icons/MoreHorizRounded';
import FileCopyRoundedIcon from '@material-ui/icons/FileCopyRounded';
import WatchLaterRoundedIcon from '@material-ui/icons/WatchLaterRounded';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';

import { AuthContext } from '../../context/AuthContext';
import Api from '../../functions/Api';

import { format } from "timeago.js"

const useStyles = makeStyles({
    postCard: {
        borderRadius: "15px",
        textAling: "center",
        width: "400px",
        transition: "all 1s ease",
    },
    postCardHeader: {
        backgroundSize: "cover",
        backgroundPosition: "center center",
        height: "180px",
        borderRadius: "20px 20px 0 0"
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
    }
})


export default function PostCard({ postId }) {

    const context = useContext(AuthContext)
    const history = useHistory()

    const classes = useStyles()

    const [post, setPost] = useState({ })
    const [modleId, setModleId] = useState(v4())

    const [isLike, setIsLike] = useState(false)
    const [isVisit, setIsVisit] = useState(true)

    const fetchPost = () => {
        Api.fetchPost(postId).then(res => {
            setPost(res.data)
        })
    }
    useEffect(() => {
        fetchPost()
    }, [postId])


    useEffect(() => {
        if (context.user?._id)
            setIsLike(post.likes?.includes(context.user?._id))
    }, [post, context])


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
                    console.log(res.data)
                    window.document.querySelector(`#closeOptionsModel${modleId}`).click()
                    history.push(`/profile/${context.user.username}`)
                })
            }
        }
    }




    return (
        <React.Fragment>
            <div className={`grey lighten-3 d-block m-3 ${classes.postCard}`}>
                <div className={`d-block position-relative`} style={{ height: "100%" }}>
                    <div className={`w-100 ${classes.postCardHeader}`} style={{ backgroundImage: `url(${post.coverImg})` }}>
                        <Link to={`/p/${post._id}`} className={`w-100 grey lighten-2 position-absolute text-center ${classes.postCardLink}`}>
                            <Button color="primary" className="w-100 h-100 p-3" style={{ borderRadius: "12px 12px 0 0", fontFamily: "inherit"}}>{post.title}</Button>
                        </Link>
                    </div>
                    <div className="p-2 mt-2 d-flex flex-column justify-content-between" style={{ minHeight: "150px" }}>
                        <p className="">
                            {post.desc}
                        </p>
                        <div className="d-flex flex-wrap justify-content-between">

                            <div className="d-flex flex-wrap">

                                <div className={`blue-grey lighten-4 rounded-pill m-2 ${classes.postCardBInfo}`} style={{ color: "#78909c", }}>
                                    {post.viewsCount}
                                    {
                                        isVisit ?
                                            <VisibilityRoundedIcon style={{ fontSize: "1.2rem" }} />
                                            :
                                            <VisibilityOutlinedIcon style={{ fontSize: "1.2rem" }} />
                                    }

                                </div>

                                <div className={`red lighten-4 rounded-pill m-2 ${classes.postCardBInfo}`} style={{ color: "#ef5350", }}>
                                    {post.likes?.length}
                                    {
                                        isLike ?
                                            <FavoriteRoundedIcon style={{ fontSize: "1.2rem" }} />
                                            :
                                            <FavoriteBorderRoundedIcon style={{ fontSize: "1.2rem" }} />
                                    }
                                </div>

                                <div className={`amber lighten-3 rounded-pill m-2 ${classes.postCardBInfo}`} style={{ color: "#ff8f00  ", }}>
                                    {format(post.createdAt)} <WatchLaterRoundedIcon style={{ fontSize: "1.2rem" }} />
                                </div>

                            </div>
                            <div className="float-end d-flex">

                                <Button className="indigo lighten-4 rounded-circle p-1 m-2" style={{ color: "#5c6bc0 ", fontSize: "14px", minWidth: "auto", }} data-bs-toggle="modal" data-bs-target={`#optionsBackdrop${modleId}`}>
                                    <MoreHorizRoundedIcon />
                                </Button>


                            </div>
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
        </React.Fragment>

    )
}
