import React from 'react'
import { Link } from 'react-router-dom'

import { makeStyles } from '@material-ui/core'

import { Avatar, Chip } from '@material-ui/core'
import PostCard from '../components/elements/PostCard'

import Button from '@material-ui/core/Button';

import UnfoldMoreRoundedIcon from '@material-ui/icons/UnfoldMoreRounded';
import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded';
import FavoriteBorderRoundedIcon from '@material-ui/icons/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import MoreHorizRoundedIcon from '@material-ui/icons/MoreHorizRounded';
import FileCopyRoundedIcon from '@material-ui/icons/FileCopyRounded';
import WatchLaterRoundedIcon from '@material-ui/icons/WatchLaterRounded';

const useStyles = makeStyles({
    categorieCard: {
        borderRadius: "10px",

    },
    categorieCardCoverImg: {
        width: "100%",
        borderRadius: "10px 10px 0 0",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        height: "250px",
    },
    categorieCardCoverButtom: {
        background: "linear-gradient(45deg, #f48fb1  30%, #ce93d8  90%)",
        color: "#000",
        padding: "2rem 3rem !important",
        fontFamily: "inherit",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "20px",
        boxShadow: "rgb(70 83 93) 2px 4px 0px 0px, rgb(0 0 0 / 12%) 0px 3px 14px 2px, rgb(0 0 0 / 20%) 0px 5px 5px -3px !important",
    },
    postCardBorder: {
        border: "1px solid #bdbdbd",
        margin: "0 10px"

    },
    postCardBInfo: {
        fontSize: "14px",
        padding: "4px 8px"
    },
    postBar: {
        overflowX: "auto",
        padding: "10px"
    },
    chip: {
        fontFamily: "inherit",
        padding: "1rem",
        background: "linear-gradient(45deg, #9575cd 30%, #ba68c8 90%)",
        boxShadow: "0 8px 17px 2px rgb(0 0 0 / 14%), 0 3px 14px 2px rgb(0 0 0 / 12%), 0 5px 5px -3px rgb(0 0 0 / 20%)"
    },
})

// function PostBar({ title, likeCount, viewsCount, createdAt, _id, cid }) {
//     const classes = useStyles()

//     return (
//         <div className="grey lighten-2 d-flex justify-content-between flex-wrap">
//             <Link to={`/${cid}/${_id}`} className={`w-100 grey lighten-2 text-center`}>
//                 <Button color="primary" className="w-100 h-100 p-3" style={{ borderRadius: "12px 12px 0 0" }}>{title}</Button>
//             </Link>
//             <div>
//                 <p>
//                     {/* {desc} */}ggdg dg ;djkgk edfgio dfjklghj dfhgjkh dlfhgjl 
//                     {/* {desc} */}ggdg dg ;djkgk edfgio dfjklghj dfhgjkh dlfhgjl 
//                     {/* {desc} */}ggdg dg ;djkgk edfgio dfjklghj dfhgjkh dlfhgjl 
//                     {/* {desc} */}ggdg dg ;djkgk edfgio dfjklghj dfhgjkh dlfhgjl 
//                     {/* {desc} */}ggdg dg ;djkgk edfgio dfjklghj dfhgjkh dlfhgjl 
//                     {/* {desc} */}ggdg dg ;djkgk edfgio dfjklghj dfhgjkh dlfhgjl 
//                     {/* {desc} */}ggdg dg ;djkgk edfgio dfjklghj dfhgjkh dlfhgjl 
//                     {/* {desc} */}ggdg dg ;djkgk edfgio dfjklghj dfhgjkh dlfhgjl 
//                     {/* {desc} */}ggdg dg ;djkgk edfgio dfjklghj dfhgjkh dlfhgjl 
//                     {/* {desc} */}ggdg dg ;djkgk edfgio dfjklghj dfhgjkh dlfhgjl 
//                     {/* {desc} */}ggdg dg ;djkgk edfgio dfjklghj dfhgjkh dlfhgjl 
//                     {/* {desc} */}ggdg dg ;djkgk edfgio dfjklghj dfhgjkh dlfhgjl 
//                     </p>
//             </div>
//             <div className="d-flex flex-wrap">

//                 <div className={`blue-grey lighten-4 rounded-pill m-2 ${classes.postCardBInfo}`} style={{ color: "#78909c", }}>
//                     {viewsCount} <VisibilityRoundedIcon style={{ fontSize: "1.2rem" }} />
//                 </div>

//                 <div className={`red lighten-4 rounded-pill m-2 ${classes.postCardBInfo}`} style={{ color: "#ef5350", }}>
//                     {likeCount} <FavoriteRoundedIcon style={{ fontSize: "1.2rem" }} />
//                 </div>

//                 <div className={`amber lighten-3 rounded-pill m-2 ${classes.postCardBInfo}`} style={{ color: "#ff8f00  ", }}>
//                     {createdAt} <WatchLaterRoundedIcon style={{ fontSize: "1.2rem" }} />
//                 </div>

//             </div>
//         </div>
//     )
// }
// assets/categories/technology.jpg
function CategoryCard({ coverImg, title, desc, postsCount }) {
    const classes = useStyles()

    return (
        <div className={`grey lighten-3 ${classes.categorieCard} mt-5`}>
            <div className={`d-flex justify-content-center align-items-center ${classes.categorieCardCoverImg}`} style={{ backgroundImage: `linear-gradient(#e1bee7a3  , #eeeeee ), url(${coverImg})` }}>
                <Link to="toc">
                    <Chip
                        className={`${classes.categorieCardCoverButtom}`}
                        size="small"
                        icon={``}
                        label={title}
                        clickable
                        color="primary"
                    />
                </Link>
            </div>
            <div className={`mt-2 p-2`}>
                <p className="p-2">
                    {desc}
                </p>

                <div className="">
                    <div className={`d-flex justify-content-between w-100 ${classes.postBar}`}>

                        <div>

                            <PostCard className={`${classes.postCardBorder}`} title="iphone 11" desc="the new iphone !" coverImg="1.png" />
                        </div>

                        <div>

                            <PostCard className={`${classes.postCardBorder}`} title="iphone 11" desc="the new iphone !" coverImg="1.png" />
                        </div>


                        <div>

                            <PostCard className={`${classes.postCardBorder}`} title="iphone 11" desc="the new iphone !" coverImg="1.png" />
                        </div>


                        <div>

                            <PostCard className={`${classes.postCardBorder}`} title="iphone 11" desc="the new iphone !" coverImg="1.png" />
                        </div>


                        <div>

                            <PostCard className={`${classes.postCardBorder}`} title="iphone 11" desc="the new iphone !" coverImg="1.png" />
                        </div>



                    </div>

                </div>
                <div className="d-flex justify-content-between mt-2 p-3">
                    <Chip
                        className={`btn-shadow ${classes.chip}`}
                        size="small"
                        icon={<UnfoldMoreRoundedIcon />}
                        label="عرض المزيد"
                        clickable
                        color="primary"
                    />
                    <div className={`blue-grey lighten-4 rounded-pill m-2 ${classes.postCardBInfo}`} style={{ color: "#78909c", }}>
                        {postsCount} <FileCopyRoundedIcon style={{ fontSize: "1.2rem" }} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function Categories() {
    return (
        <div className="w-100">

            <CategoryCard coverImg={"assets/categories/technology.jpg"} />
            <CategoryCard />
            <CategoryCard />

        </div>
    )
}
