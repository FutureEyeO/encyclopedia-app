
import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'

import { Button, makeStyles } from '@material-ui/core'

import { Avatar, Chip } from '@material-ui/core'
import PostCard from './PostCard'

import UnfoldMoreRoundedIcon from '@material-ui/icons/UnfoldMoreRounded';
import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded';
import FavoriteBorderRoundedIcon from '@material-ui/icons/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import MoreHorizRoundedIcon from '@material-ui/icons/MoreHorizRounded';
import FileCopyRoundedIcon from '@material-ui/icons/FileCopyRounded';
import WatchLaterRoundedIcon from '@material-ui/icons/WatchLaterRounded';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import GitHubIcon from '@material-ui/icons/GitHub';
import FacebookIcon from '@material-ui/icons/Facebook';
import EmailRoundedIcon from '@material-ui/icons/EmailRounded';
import YouTubeIcon from '@material-ui/icons/YouTube';

import Api from '../../functions/Api'
import { v4 } from "uuid"

const useStyles = makeStyles({
    socialMediaButton: {
        fontSize: "15px !important",
        padding: "4px 8px !important",
        lineHeight: 1.2,
        textTransform: "unset"
    }
})


export default function SocialMediaCard({ obj }) {
    const classes = useStyles()

    if (obj)
        return (
            <div className="d-flex p-2 flex-wrap">

                {
                    obj.github && obj.github != "" ?
                        <Button className={`grey darken-2 rounded-pill m-2 ${classes.socialMediaButton}`}>
                            <a href={obj.github} target="_blank" style={{ color: "#212121", }}>
                                github <GitHubIcon style={{ fontSize: "18px" }} />
                            </a>
                        </Button>
                        :
                        null
                }


                {
                    obj.instagram && obj.instagram != "" ?
                        <Button className={` pink lighten-3 rounded-pill m-2 ${classes.socialMediaButton}`}>
                            <a href={obj.instagram} target="_blank" style={{ color: "#e91e63 ", }}>
                                instagram <InstagramIcon style={{ fontSize: "18px" }} />
                            </a>
                        </Button>
                        :
                        null
                }


                {
                    obj.twitter && obj.twitter != "" ?
                        <Button className={` blue lighten-3 rounded-pill m-2 ${classes.socialMediaButton}`}>
                            <a href={obj.twitter} target="_blank" style={{ color: "#2196f3  ", }}>
                            twitter <TwitterIcon style={{ fontSize: "18px" }} />
                            </a>
                        </Button>
                        :
                        null
                }

                {
                    obj.youtube && obj.youtube != "" ?
                        <Button className={` red lighten-3 rounded-pill m-2 ${classes.socialMediaButton}`}>
                            <a href={obj.youtube} target="_blank" style={{ color: "#f44336  ", }}>
                            youtube <YouTubeIcon style={{ fontSize: "18px" }} />
                            </a>
                        </Button>
                        :
                        null
                }

{
                    obj.facebook && obj.facebook != "" ?
                        <Button className={`indigo lighten-3 rounded-pill m-2 ${classes.socialMediaButton}`}>
                            <a href={obj.facebook} target="_blank" style={{ color: "#3f51b5   ", }}>
                            facebook <FacebookIcon style={{ fontSize: "18px" }} />
                            </a>
                        </Button>
                        :
                        null
                }


            </div>
        )
    else
        return null
}
