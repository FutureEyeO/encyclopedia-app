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

import { AuthContext } from '../context/AuthContext';
import Api from '../functions/Api';

import { format } from "timeago.js"
import SocialMediaCard from '../components/elements/SocialMediaCard';
import AuthorCard from '../components/elements/AuthorCard';


export default function Authors() {
    const [authors, setAuthors] = useState([])

    useEffect(() => {
        Api.fetchAllAuthors().then(res => {
            if (res.data)
                setAuthors(res.data)
            console.log(res.data)
        })
    }, [])

    return (
        <div className="mt-5">
            <h2>مألفين الموسوعة</h2>
            <div className="line"></div>
            <div className="d-flex flex-wrap justify-content-center">
                {
                    authors.map(a => {

                        return <AuthorCard authorId={a.userId} />

                    })
                }
                  
            </div>
        </div>
    )
}
