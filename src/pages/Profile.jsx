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

import PostCard from '../components/elements/PostCard';

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
    }
})

export default function Profile() {
    const classes = useStyles()

    const context = useContext(AuthContext)

    const { username } = useParams()


    const [isFollowing, setIsFollowing] = useState(false)
    const [user, setUser] = useState({})
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
            <header className={`${classes.header}`} style={{}}>
                <div className={`profileDiv-coverImg ${``}`} style={{ backgroundImage: `url(${user.coverImg})` }}>
                    <div className={`profileDiv-profileImg ${``}`} style={{ backgroundImage: `url(${user.profileImg})` }}>

                    </div>
                </div>
                <div className={`p-2 ${classes.headerInfoBox}`} >

                    <div>

                        <h3>
                            {user.name}
                        </h3>
                        <div style={{ fontSize: "18px" }}>
                            {user.username} <AlternateEmailRoundedIcon style={{ fontSize: "18px" }} />
                        </div>
                    </div>
                    <div>
                        <div className={`mb-2`} style={{ direction: "ltr" }}>
                            <span> <FileCopyRoundedIcon style={{ fontSize: "15px" }} /> {user.posts?.length} post</span>
                            <span> <QueryBuilderRoundedIcon style={{ fontSize: "18px" }} /> {format(user.createdAt)} </span>
                        </div>
                        {/* <div className={`d-flex `} style={{ direction: "ltr" }}>

                            <div>{followings} Following</div>
                            <div className={`ms-5`}>
                                {followers} Followers
                            </div>
                        </div> */}
                        <div className="mb-3">
                            <span>
                                <LinkRoundedIcon style={{ fontSize: "23px" }} />
                                <a href={user.website} target="_blank">{user.website}</a>
                            </span>
                        </div>
                        <div className={`mb-2`} style={{ direction: "ltr" }}>
                            <Button style={{ fontFamily: "inherit", borderRadius: "10px" }} variant="contained" color="secondary"> 
                                <Link to={`/edit/profile/${user._id}`} style={{ color: "inherit" }}>
                                تعديل الملف الشخصي <EditRoundedIcon style={{ fontSize: "18px" }}/>
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
                                return <PostCard id={v4()} postId={postId}/>
                            })
                        }


                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}
