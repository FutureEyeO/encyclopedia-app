
import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'

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
import Api from '../functions/Api'

import data from "../constant/data"

import CategoryCard from '../components/elements/CategoryCard'
import { v4 } from 'uuid'

const fs = require("fs")

// const useStyles = makeStyles({
//     categorieCard: {
//         borderRadius: "10px",

//     },
//     categorieCardCoverImg: {
//         width: "100%",
//         borderRadius: "10px 10px 0 0",
//         backgroundSize: "cover",
//         backgroundPosition: "center center",
//         height: "250px",
//     },
//     categorieCardCoverButtom: {
//         background: "linear-gradient(45deg, #f48fb1  30%, #ce93d8  90%)",
//         color: "#000",
//         padding: "2rem 3rem !important",
//         fontFamily: "inherit",
//         borderRadius: "10px",
//         cursor: "pointer",
//         fontSize: "20px",
//         boxShadow: "rgb(70 83 93) 2px 4px 0px 0px, rgb(0 0 0 / 12%) 0px 3px 14px 2px, rgb(0 0 0 / 20%) 0px 5px 5px -3px !important",
//     },
//     postCardBorder: {
//         borderLeft: "1px solid #bdbdbd",
//         margin: "0 10px"

//     },
//     postCardBInfo: {
//         fontSize: "14px",
//         padding: "4px 8px"
//     },
//     postBar: {
//         overflowX: "auto",
//         padding: "10px"
//     },
    // chip: {
    //     fontFamily: "inherit",
    //     padding: "1rem",
    //     background: "linear-gradient(45deg, #9575cd 30%, #ba68c8 90%)",
    //     boxShadow: "0 8px 17px 2px rgb(0 0 0 / 14%), 0 3px 14px 2px rgb(0 0 0 / 12%), 0 5px 5px -3px rgb(0 0 0 / 20%)"
    // },
// })


// function CategoryCard({ category }) {
//     const classes = useStyles()
//     const [posts, setPosts] = useState([])
//     const history = useHistory()

//     useEffect(() => {
//         Api.searchPosts(null, category.id, 5).then(res => {
//             console.log(res.data)
//             setPosts(res.data)
//         })
//     }, [])

//     return (
//         <React.Fragment>
//             {category.id ?
//                 <div className={`grey lighten-3 ${classes.categorieCard} mt-5`}>
//                     <div className={`d-flex justify-content-center align-items-center ${classes.categorieCardCoverImg}`}
//                         style={{ backgroundImage: `linear-gradient(#e1bee7a3  , #eeeeee ), url(${category.coverImg})` }}
//                     >
//                         <Link to={`/search/?category=${category.id}`}>
//                             <Chip
//                                 className={`${classes.categorieCardCoverButtom}`}
//                                 size="small"
//                                 icon={``}
//                                 label={category.id}
//                                 clickable
//                                 color="primary"
//                             />
//                         </Link>
//                     </div>
//                     <div className={`mt-2 p-2`}>
//                         <p className="p-2">
//                             {category.desc}
//                         </p>

//                         <div className="">
//                             <div className={`d-flex justify-content-between w-100 ${classes.postBar}`}>

//                                 {
//                                     Array.from(Object.keys(posts)).map(postId => {
//                                         return (
//                                             <div className={`${classes.postCardBorder}`}>
//                                                 <PostCard postId={postId}  />
//                                             </div>
//                                         )
//                                     })
//                                 }
//                                 


//                             </div>
//                         </div>
//                         <div className="d-flex justify-content-between mt-2 p-3">
//                             <Chip
//                                 className={`btn-shadow ${classes.chip}`}
//                                 size="small"
//                                 icon={<UnfoldMoreRoundedIcon />}
//                                 label="عرض المزيد"
//                                 clickable
//                                 color="primary"
//                                 onClick={() => history.push(`/search/?category=${category.id}`)}
//                             />
//                             <div className={`blue-grey lighten-4 rounded-pill m-2 ${classes.postCardBInfo}`} style={{ color: "#78909c", }}>
//                                 {posts?.length} <FileCopyRoundedIcon style={{ fontSize: "1.2rem" }} />
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 :
//                 null
//             }
//         </React.Fragment>
//     )
// }

export default function Categories() {
    return (
        <div className="w-100">

            {
                data.categories.map(c => {
                    return <CategoryCard id={v4()} category={c} />
                })
            }

        </div>
    )
}
