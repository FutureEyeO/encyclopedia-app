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
import AlternateEmailRoundedIcon from '@material-ui/icons/AlternateEmailRounded';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import InstagramIcon from '@material-ui/icons/Instagram';
import LinkRoundedIcon from '@material-ui/icons/LinkRounded';
import TwitterIcon from '@material-ui/icons/Twitter';
import GitHubIcon from '@material-ui/icons/GitHub';
import FacebookIcon from '@material-ui/icons/Facebook';
import EmailRoundedIcon from '@material-ui/icons/EmailRounded';

import { AuthContext } from '../../context/AuthContext';
import Api from '../../functions/Api';

import { format } from "timeago.js"
import SocialMediaCard from '../../components/elements/SocialMediaCard';


const useStyles = makeStyles({
    card: {
        borderRadius: "15px",
        textAling: "center",
        width: "800px",
        transition: "all 1s ease",
    },
    profileImg: {
        margin: "3rem 0"
    },
    cardHeader: {
        backgroundSize: "cover",
        backgroundPosition: "center center",
        height: "180px",
        borderRadius: "20px 20px 0 0",
        width: "100%",
    },
    cardLink: {
        borderRadius: "15px 15px 0 0",
        fontSize: "18px",
        left: "0",
        top: "0"
    },
    cardBInfo: {
        fontSize: "15px !important",
        padding: "4px 8px !important",
        lineHeight: 1.2
    }
})

export default function AuthorCard({ authorId }) {
    const classes = useStyles()
    const [author, setAuthor] = useState({ })

    useEffect(() => {
        console.log(authorId)
        if (authorId)
            Api.fetchUser(authorId).then(res => {
                setAuthor(res.data)

            })
    }, [authorId])

    return (

        <div className={`grey lighten-3 d-block m-3 ${classes.card}`}>
            <div className={`d-block position-relative`} style={{ height: "100%" }}>
                <div className="d-flex justify-content-between align-items-center">

                    <h2 className="p-1">
                        {author.name}
                    </h2>

                    <div className={`blue-grey lighten-4 rounded-pill m-2 ${classes.cardBInfo}`} style={{ color: "#78909c", }}>

                        {author.username} <AlternateEmailRoundedIcon style={{ fontSize: "18px" }} />
                    </div>
                </div>


                <div className={`d-flex justify-content-center flex-wrap align-items-center ${classes.cardHeader}`}
                    style={{ backgroundImage: `linear-gradient(#e1bee7a3  , #eeeeee ), url(${author.coverImg})` }}
                >

                    <div className={`profileDiv-profileImg ${classes.profileImg}`} style={{ backgroundImage: `linear-gradient(#eeeeee50  , #eeeeeec4), url(${author.profileImg})` }}></div>
                </div>
                <div className="d-flex justify-content-around">



                </div>
                <div className="p-2 mt-5 d-flex flex-column justify-content-between" style={{ minHeight: "150px" }}>

                    <div className="d-flex w-100 justify-content-center">

                        <div className={`purple lighten-3 rounded-pill m-2 ${classes.cardBInfo}`} style={{ color: "#9c27b0", }}>

                            <EmailRoundedIcon style={{ fontSize: "18px" }} /> {author.publicEmail}
                        </div>
                    </div>
                    <p className={`rounded m-2 p-2`} style={{ color: "#78909c", fontSize: "17px" }}>
                        {author.desc}
                    </p>
                    <div className="d-flex mb-3">
                        <span>
                            <LinkRoundedIcon style={{ fontSize: "23px" }} />
                            <a href={author.website} target="_blank">{author.website}</a>
                        </span>
                    </div>

                    <div className="d-flex flex-wrap justify-content-between">

                        <div className="d-flex flex-wrap">

                            <div className={`blue-grey lighten-4 rounded-pill m-2 ${classes.cardBInfo}`} style={{ color: "#78909c", }}>
                                <FileCopyRoundedIcon style={{ fontSize: "18px" }} /> {author.posts?.length} post
                            </div>




                            <div className={`amber lighten-3 rounded-pill m-2 ${classes.cardBInfo}`} style={{ color: "#ff8f00  ", }}>
                                <WatchLaterRoundedIcon style={{ fontSize: "18px" }} /> {format(author.createdAt)}
                            </div>

                        </div>

                        <div className="float-end d-flex">


                            <Button className={`red lighten-4 rounded-pill m-2 ${classes.cardBInfo}`} style={{ color: "#ef5350", }}>
                                <Link to={`/profile/${author.username}`} style={{ color: "inherit" }}>
                                    <AccountCircleRoundedIcon style={{ fontSize: "18px" }} /> الصفحة الشخصية
                                </Link>
                            </Button>

                        </div>
                    </div>
                </div>
                <div>
                    <div className={`mt-2`}>

                        <SocialMediaCard obj={author.socialMedia} />
                    </div>
                </div>
            </div>
        </div>
    )

}