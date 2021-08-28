import React, { Component, useContext, useState, useEffect } from 'react'

import { Link } from "react-router-dom"

import { v4 } from 'uuid';

import Button from '@material-ui/core/Button';
import PostCard from '../components/elements/PostCard';

import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded';
import FavoriteBorderRoundedIcon from '@material-ui/icons/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import MoreHorizRoundedIcon from '@material-ui/icons/MoreHorizRounded';
import FileCopyRoundedIcon from '@material-ui/icons/FileCopyRounded';
import WatchLaterRoundedIcon from '@material-ui/icons/WatchLaterRounded';

import Flame from "../components/icons/Flame"
import SearchBox from "../components/elements/SearchBox"
import ListItemCollapse from '../components/elements/ListItemCollapse';

import Api from '../functions/Api';
import LoginModle from '../components/elements/LoginModle';

const styles = {
    header: {

    },
    flameDiv: {
        marginTop: "-100px"
    },
    headerText: {
        color: "#424242"
    },

    viewersCard: {
        background: 'linear-gradient(45deg, #e1bee7   30%, #f8bbd0   90%)',
        borderRadius: "15px",
        textAling: "center",
        color: "#424242",
    },

}

export default function Home() {

    const [limit, setLimit] = useState(5)
    const [visitCount, setVisitCount] = useState(0)
    const [postsCount, setPostsCount] = useState(0)
    const [lastPosts, setLastPosts] = useState([])
    const [mostLikePosts, setMostLikePosts] = useState([])

    useEffect(() => {
        Api.getVisitCountStatistic(window.location.pathname).then(res => {
            setVisitCount(res.data)
        })
        Api.fetchAllPosts().then(res => {
            setPostsCount(res.data.length)
        })


        Api.fetchLastPosts(limit).then(posts => {
            setLastPosts(posts.data)
        })
        Api.fetchMostLikePosts(limit).then(posts => {
            setMostLikePosts(posts.data)
        })
    }, [])

    const handleSerch = (value) => {
        console.log("serach", value)
    }

    return (
        <React.Fragment>
            <header className="d-flex flex-column flex-md-row position-relative" style={styles.header}>

                <div className="w-100">
                    <div className="mb-5" style={styles.headerText}>
                        <h1><i class="fas fa-fire"></i> موسوعة شعلة</h1>
                        <h5 style={{ lineHeight: "2.2rem" }}>
                            موسوعة مهتمة لنشر الثقافة و طرح المواضيع المهمة و المفيدة في مختلف المجالات .
                            الاضافة للهتمام برائ المستخد وتطوير المنصة بما يناسب مختلف الاستخدامات
                        </h5>
                    </div>

                    <div className="p-4 mt-2" style={styles.viewersCard}>
                        <div className="d-flex">

                            <h2 className="p-2">
                                <VisibilityRoundedIcon /> {visitCount}
                            </h2>
                            <h2 className="me-auto rounded-pill p-2 red lighten-2"><i class="fas fa-angle-double-up"></i></h2>
                        </div>

                        <div className="d-flex">
                            <h2 className="p-2">
                                <FileCopyRoundedIcon /> {postsCount}
                            </h2>
                            <h2 className="me-auto rounded-pill p-2 red lighten-2"><i class="fas fa-angle-double-up"></i></h2>
                        </div>
                    </div>

                </div>

            </header>
            <div className="mt-5 mb-5">

                <SearchBox onSearch={handleSerch} />
            </div>
            <div className="" style={{ marginTop: "8rem" }}>
                <div className="w-100">

                    <div className="" style={{ width: "100%", border: "2px solid #d500f945  ", borderRadius: "10px" }}>
                        <div className="p-2">
                            <h4>الاكثر اعجابا</h4>
                        </div>
                        <div className="d-flex flex-wrap justify-content-center" style={{ transition: "all 1s ease", }}>


                            {
                                mostLikePosts.map(post => {
                                    return <PostCard id={v4()} postId={post._id} />
                                })
                            }


                        </div>
                    </div>

                    <div className="mt-5" style={{ width: "100%", border: "2px solid #651fff45  ", borderRadius: "10px" }}>
                        <div className="p-2">
                            <h4>أحدث المنشورات</h4>
                        </div>
                        <div className="d-flex flex-wrap justify-content-center">


                            {
                                lastPosts.map(post => {
                                    return <PostCard id={v4()} postId={post._id} />
                                })
                            }

                        </div>
                    </div>

                </div>
            </div>


            <LoginModle/>
            
        </React.Fragment >
    )
}


<div className="d-flex flex-column flex-md-row position-relative mt-5 p-5">
    <div className="w-100 d-flex flex-wrap justify-content-between">

        <div className="d-flex flex-column" style={{ width: "45%" }}>
            <div>
                <h4>الاكثر اعجابا</h4>
            </div>
            <div className={`p-4 mt-2 d-flex grey lighten-3 d-block`} style={styles.infoCard}>
                <ListItemCollapse
                    collapse={
                        <div>
                            this the firt topic
                            <span><FavoriteBorderRoundedIcon /></span>
                        </div>
                    }>
                    <span>virous crona</span>
                    <span class="badge text-dark float-start"
                        style={{ boxShadow: "rgb(0 0 0 / 14%) 0px 8px 17px 2px, rgb(0 0 0 / 12%) 0px 3px 14px 2px, rgb(0 0 0 / 20%) 0px 5px 5px -3px" }}
                    >100</span>
                </ListItemCollapse>
            </div>
        </div>

        <div className="d-flex flex-column" style={{ width: "45%" }}>
            <div>
                <h4>الاكثر بحثا</h4>
            </div>
            <div className={`p-4 mt-2 d-flex grey lighten-3 d-block`} style={styles.infoCard}>
                <ListItemCollapse
                    collapse={
                        <div>
                            this the firt topic
                            <div className="text-start">

                                <span>26<FavoriteBorderRoundedIcon /></span>
                            </div>
                        </div>
                    }>
                    <span>virous crona</span>
                    <span class="badge text-dark float-start"
                        style={{ boxShadow: "rgb(0 0 0 / 14%) 0px 8px 17px 2px, rgb(0 0 0 / 12%) 0px 3px 14px 2px, rgb(0 0 0 / 20%) 0px 5px 5px -3px" }}
                    >100</span>
                </ListItemCollapse>
            </div>
        </div>

    </div>
</div>