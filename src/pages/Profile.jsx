import React, { Component, useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom';


import { v4 } from 'uuid';

import { makeStyles } from '@material-ui/core';
import { Button } from '@material-ui/core';

import AlternateEmailRoundedIcon from '@material-ui/icons/AlternateEmailRounded';
import LinkRoundedIcon from '@material-ui/icons/LinkRounded';
import QueryBuilderRoundedIcon from '@material-ui/icons/QueryBuilderRounded';
import FileCopyRoundedIcon from '@material-ui/icons/FileCopyRounded';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import PostAddRoundedIcon from '@material-ui/icons/PostAddRounded';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import GitHubIcon from '@material-ui/icons/GitHub';
import FacebookIcon from '@material-ui/icons/Facebook';
import WatchLaterRoundedIcon from '@material-ui/icons/WatchLaterRounded';
import EmailRoundedIcon from '@material-ui/icons/EmailRounded';

import PostCard from '../components/elements/PostCard';
import SocialMediaCard from '../components/elements/SocialMediaCard';

import Api from '../functions/Api.js';

import { format } from "timeago.js"

import { useParams } from "react-router-dom";
import { AuthContext } from '../context/AuthContext.js'



const useStyles = makeStyles({
    header: {
        color: "#424242",
        borderRadius: "10px",
        background: 'linear-gradient(45deg, #e1bee7   30%, #f8bbd0   90%)',
    },
    headerInfoBox: {
        // backdropFilter: "blur(10px)",
        // backgroundColor: "rgba(255, 255, 255, 0.8)",
    },
    cardInfo: {
        fontSize: "15px",
        padding: "4px 8px"
    }
})

export default function Profile() {
    const classes = useStyles()

    const context = useContext(AuthContext)

    const { username } = useParams()


    const [isFollowing, setIsFollowing] = useState(false)
    const [user, setUser] = useState({ })
    // const [posts, setPosts] = useState([])

    const [followers, setFollowers] = useState(0)
    const [followings, setFollowings] = useState(0)

    const [isFetching, setIsFetching] = useState(false)


    useEffect(() => {
        console.log(username)
        setIsFetching(true)
        Api.fetchUser(username, "username").then(async res => {
            setUser(res.data)
            // if (res.data._id) {
            //     await Api.fetchUserPosts(res.data._id).then(res => {
            //         setPosts(res.data)
            //         setIsFetching(false)
            //     })
            // } 
        })
    }, [username])

    useEffect(async () => {
        if (user._id) {

            // console.log(props.user, props.user.id, Boolean(props.user.id))
            console.log(user)
            // console.log(posts)
            console.log(followers)
            console.log(followings)
            console.log(isFollowing)
            // if (user._id) {
            //     setIsFetching(false)
            // } else {
            //     setIsFetching(true)
            // }

            setFollowers(user?.followers?.length)
            setFollowings(user?.followings?.length)

            // setIsFollowing(user?.followers?.includes(context.user?._id))
        }

    }, [user])



    return (
        <React.Fragment>
            <header className={`${classes.header}`} style={{ }}>
                <div className={`profileDiv-coverImg ${``}`} style={{ backgroundImage: `url(${user.coverImg})` }}>
                    <div className={`profileDiv-profileImg ${``}`} style={{ backgroundImage: `url(${user.profileImg})` }}>

                    </div>
                </div>
                <div className={`p-2 ${classes.headerInfoBox}`} >

                    <div>

                        <h3>
                            {user.name}
                        </h3>
                        <div className="mt-2" style={{ fontSize: "18px" }}>
                            <div className="d-flex">
                                <div className={`blue-grey lighten-4 rounded-pill ${classes.cardInfo}`} style={{ color: "#78909c", }}>
                                    {user.username} <AlternateEmailRoundedIcon style={{ fontSize: "18px" }} />
                                </div>

                            </div>

                            {function () {
                                console.log(user.publicEmail, user.publicEmail != "")
                                if (user.publicEmail && user.publicEmail != "") {
                                    return (
                                        <div className="d-flex mt-2">

                                            <div className={`purple lighten-3 rounded-pill ${classes.cardInfo}`} style={{ color: "#9c27b0", }}>
                                                <EmailRoundedIcon style={{ fontSize: "18px" }} /> {user.publicEmail}
                                            </div>

                                        </div>
                                    )
                                }
                            }()}

                        </div>
                    </div>
                    <div className="mt-4">
                        <div className={`d-flex mb-2`} style={{ direction: "ltr" }}>
                            <div className={`blue-grey lighten-4 rounded-pill ${classes.cardInfo}`} style={{ color: "#78909c", }}>
                                <FileCopyRoundedIcon style={{ fontSize: "18px" }} /> {user.posts?.length} post
                            </div>




                            <div className={`amber lighten-3 rounded-pill ms-2 ${classes.cardInfo}`} style={{ color: "#ff8f00  ", }}>
                                <WatchLaterRoundedIcon style={{ fontSize: "18px" }} /> {format(user.createdAt)}
                            </div>

                        </div>
                        {/* <div className={`d-flex `} style={{ direction: "ltr" }}>

                            <div>{followings} Following</div>
                            <div className={`ms-5`}>
                                {followers} Followers
                            </div>
                        </div> */}
                        <div style={{ fontSize: "18px" }}> 

                            {user.desc}
                        </div>
                        <div className="d-flex mb-3">
                            <span>
                                <LinkRoundedIcon style={{ fontSize: "23px" }} />
                                <a href={user.website} target="_blank">{user.website}</a>
                            </span>
                        </div>
                        <div>
                            <SocialMediaCard obj={user.socialMedia} />
                        </div>
                        <div className={`mb-3`}>
                            <Button style={{ fontFamily: "inherit", borderRadius: "10px" }} variant="contained" color="primary">
                                <Link to={`/create/post`} style={{ color: "inherit" }}>
                                    اضف منشورة  <PostAddRoundedIcon style={{ fontSize: "18px" }} />
                                </Link>
                            </Button>
                        </div>
                        <div className={`mb-3`} style={{ direction: "ltr" }}>
                            <Button style={{ fontFamily: "inherit", borderRadius: "10px" }} variant="contained" color="secondary">
                                <Link to={`/edit/profile/${user._id}`} style={{ color: "inherit" }}>
                                    تعديل الملف الشخصي <EditRoundedIcon style={{ fontSize: "18px" }} />
                                </Link>
                            </Button>

                        </div>
                    </div>
                </div>
            </header>
            <div className={`mt-5`}>
                <div className="" style={{ width: "100%", borderRadius: "10px" }}>

                    <div className="d-flex flex-wrap justify-content-center" style={{ transition: "all 1s ease", }}>

                        {
                            user.posts?.map(postId => {
                                return <PostCard id={v4()} postId={postId} />
                            })
                        }


                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}
