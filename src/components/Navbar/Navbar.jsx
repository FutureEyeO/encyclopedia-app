import React, { Component, useState, useEffect, useContext } from 'react'

import { makeStyles } from '@material-ui/core/styles';
import { Paper, Tabs, Tab, Button, Menu, MenuItem, Badge, } from '@material-ui/core';
import { List, ListItem, ListItemIcon, ListItemText, Divider } from '@material-ui/core';
import { Zoom, Slide } from '@material-ui/core';

import { Avatar, Chip } from '@material-ui/core'
import FaceIcon from '@material-ui/icons/Face';
import DoneIcon from '@material-ui/icons/Done';


import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import HelpRoundedIcon from '@material-ui/icons/HelpRounded';
import LibraryBooksRoundedIcon from '@material-ui/icons/LibraryBooksRounded';
import LanguageIcon from '@material-ui/icons/Language';
import ViewAgendaIcon from '@material-ui/icons/ViewAgenda';

import MenuIcon from '@material-ui/icons/Menu';
import AppsRoundedIcon from '@material-ui/icons/AppsRounded';
import ForumRoundedIcon from '@material-ui/icons/ForumRounded';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import GradeRoundedIcon from '@material-ui/icons/GradeRounded';
import ExploreIcon from '@material-ui/icons/Explore';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import MeetingRoomRoundedIcon from '@material-ui/icons/MeetingRoomRounded';
import SettingsRoundedIcon from '@material-ui/icons/SettingsRounded';
import Drawer from '@material-ui/core/Drawer';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

import { v4 } from 'uuid';

import "./Navbar.css"

import LockOpenRoundedIcon from '@material-ui/icons/LockOpenRounded';
import { Link, useParams, useHistory, useLocation } from 'react-router-dom';

import Browser from "../../functions/Browser"
import Api from '../../functions/Api';
import { AuthContext } from '../../context/AuthContext';

let once = true;

let timeTaken = 0

const recordStatistic = async () => {

    return window.setInterval(() => {
        timeTaken++
        // setTimeTaken(timeTaken + 1)

    }, 1000)
}

let interval = recordStatistic(timeTaken)



const useStyles = makeStyles({
    chip: {
        fontFamily: "inherit",
        padding: "1rem",
        background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
        boxShadow: "0 8px 17px 2px rgb(0 0 0 / 14%), 0 3px 14px 2px rgb(0 0 0 / 12%), 0 5px 5px -3px rgb(0 0 0 / 20%)"
    },
    navbar: {
        zIndex: 1021,
        boxShadow: "0 8px 38px 0 rgb(0 0 0 / 14%), 0 3px 46px 0 rgb(0 0 0 / 12%)",
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        flexWrap: "nowrap"

    },
    navbarBrand: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        color: 'white !important',
        padding: "1rem"
    },
    menu: {
        position: "absolute",
        left: "10px",
        borderRadius: "10px",
        boxShadow: "0 0 70px 0 #6e6e6e",
        backgroundColor: "rgba(240, 240, 240, 0.95) !important",
    },

    navbarList: {
        borderRadius: "10px",
        boxShadow: "0 0 70px 0 #6e6e6e",
        backgroundColor: "rgba(240, 240, 240, 0.95) !important",
    },
    list: {
        width: 250,
    },
});


// export default function List() {
//     const classes = useStyles();
//     const [open, setOpen] = React.useState(false);

//    const handleOpen = () => {
//        setOpen(!open)
//    }

//     const list = (anchor) => (
//         <div
//             className={`${classes.list}`}
//             role="presentation"
//             onClick={handleOpen()}
//         >
//             <List>
//                 <ListItem button key={v4()}>
//                     <ListItemIcon></ListItemIcon>
//                     <ListItemText primary="u" />
//                 </ListItem>
//             </List>
//             <Divider />

//         </div>
//     );


//     return (
//         <div>
//                 <React.Fragment key={anchor}>
//                     <Button onClick={handleOpen()}></Button>
//                     <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
//                         {list(anchor)}
//                     </Drawer>
//                 </React.Fragment>

//         </div>
//     );

// }


function Navbar() {

    const classes = useStyles()

    const context = useContext(AuthContext)
    const history = useHistory()
    const [path, setPath] = useState(window.location.pathname)

    const [open, setOpen] = useState(false);

    const [user, setUser] = useState({ })
    // const [timeTaken, setTimeTaken] = useState(0)
    const [isUserLogin, setIsUserLogin] = useState(false)


    const handleSubmit = async (event) => {
        event.preventDefault()
    }

    const handleOpen = () => {
        setOpen(!open)
    }
    const handleClose = () => {
        setOpen(false)
    }


    function NavbarList() {

        return (
            <SwipeableDrawer anchor={`left`} open={open} onClose={handleOpen}>
                <div
                    className={`${classes.list}`}
                    role="presentation"
                    onClick={handleOpen}
                >
                    <List>
                        <Link className="d-block" to={`/`} role="button" button style={{ color: "#424242", fontFamily: "inherit" }}>
                            <ListItem button>
                                <ListItemIcon><HomeRoundedIcon /></ListItemIcon>
                                <ListItemText primary="الصفحة الرئيسية" />
                            </ListItem>
                        </Link>
                        <Link className="d-block" to={`/categories`} role="button" button style={{ color: "#424242", fontFamily: "inherit" }}>
                            <ListItem button>
                                <ListItemIcon><ViewAgendaIcon /></ListItemIcon>
                                <ListItemText primary="التصنيفات" />
                            </ListItem>
                        </Link>
                        <Link className="d-block" to={`/help`} role="button" button style={{ color: "#424242", fontFamily: "inherit" }}>
                            <ListItem button>
                                <ListItemIcon><HelpRoundedIcon /></ListItemIcon>
                                <ListItemText primary="الدعم" />
                            </ListItem>
                        </Link>
                    </List>
                    <Divider />
                </div>
            </SwipeableDrawer>
        );
    }


    useEffect(async () => {
        timeTaken = 0
        let ip = (await (await fetch("https://api.ipify.org/?format=json")).json()).ip
        let ipInfo = await Api.getIpInfo(ip)
        Api.postStatistic(ip, context.user?._id, path, timeTaken, ipInfo.data)
        Api.postVisitsLogStatistic(path, `${new Date().getDay()}-${new Date().getMonth()}-${new Date().getFullYear()}`, ip, context.user?._id, timeTaken)
    }, [context.user?._id])


    useEffect(() => {
        if (context.user) {
            setUser(context.user)

            setIsUserLogin(true)
        }

        return history.listen(async (location) => {
            if (path != location.pathname) {
                once = true
                setPath(location.pathname)

                let ip = (await (await fetch("https://api.ipify.org/?format=json")).json()).ip
                let ipInfo = await Api.getIpInfo(ip)
                console.log(timeTaken)
                Api.postStatistic(ip, context.user?._id, path, timeTaken, ipInfo.data)
                Api.postVisitsLogStatistic(path, `${new Date().getDay()}-${new Date().getMonth()}-${new Date().getFullYear()}`, ip, context.user?._id, timeTaken)
                timeTaken = 0
            }
        })
    }, [context, history])


    return (
        <React.Fragment>

            <nav className={`navbar navbar-expand-md border-bottom sticky-top p-0 ${classes.navbar}`}>
                <div className="container-fluid p-0">
                    <Link to="/" className={`navbar-brand position-relative m-0 ${classes.navbarBrand}`}>شعلة <i class="fas fa-fire"></i></Link>
                    <button
                        className="navbar-toggler" type="button"
                        // data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" 
                        // aria-controls="navbarTogglerDemo02" 
                        aria-expanded="false"
                        // aria-label="Toggle navigation" 
                        onClick={handleOpen}
                        style={{ border: "unset", boxShadow: "unset" }}>
                        <AppsRoundedIcon style={{ color: "#424242" }} />
                    </button>

                    <div className="collapse navbar-collapse"
                    // id="navbarTogglerDemo02"
                    >
                        <div className="navbar-nav me-auto pb-md-0 pb-3 d-flex flex-row flex-wrap justify-content-around w-100">
                            <Link to={`/`} className="m-2 m-md-0">
                                <Chip
                                    className={`btn-shadow tooltip-btn-shadow ${classes.chip}`}
                                    size="small"
                                    icon={<HomeRoundedIcon />}
                                    label="الصفحة الرئيسية"
                                    clickable
                                    color="primary"
                                />
                            </Link>
                            {/* <Link to={`/activity`} class="tooltip-menu m-2 m-md-0">
                                <Chip
                                    className={`btn-shadow tooltip-btn-shadow ${classes.chip}`}
                                    size="small"
                                    icon={<LanguageIcon />}
                                    label="نشاط الموسوعة"
                                    clickable
                                    color="primary"
                                />
                                <div class="tooltip-content">
                                    <div className="tooltip-container">

                                        <div class="header"><a class="p-3" href="explore.html">نشاط الموسوعة</a></div>
                                        <div class="box-content"> تصفح نشاط الموسوعة وتفاعل الناس مع</div>
                                        <div class="box-content mb-3">المواضيع المختلفة التي تتطرحها الموسوعة </div>
                                        <div class="box">
                                            <div class="box-content"><Link class="p-3"><i class="fas fa-angle-right"></i> الطب</Link></div>
                                        </div>
                                    </div>
                                </div>
                            </Link> */}
                            <Link to={`/categories`} class="tooltip-menu m-2 m-md-0">
                                <Chip
                                    className={`btn-shadow tooltip-btn-shadow ${classes.chip}`}
                                    size="small"
                                    icon={<ViewAgendaIcon />}
                                    label="التصنيفات"
                                    clickable
                                    color="primary"
                                />
                                <div class="tooltip-content">
                                    <div className="tooltip-container">

                                        <div class="header"><a class="p-3" href="explore.html">التصنيفات</a></div>
                                        <div class="box">
                                            <div class="box-content"><Link class="p-3"><i class="fas fa-angle-right"></i>الطب</Link></div>
                                            <div class="box-content"><Link class="p-3"><i class="fas fa-angle-right"></i>الفيزياء</Link></div>
                                            <div class="box-content"><Link class="p-3"><i class="fas fa-angle-right"></i>الفضاء </Link></div>
                                            <div class="box-content"><Link to={`/categories`} class="p-3"><i class="fas fa-angle-right"></i>الكل ... </Link></div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <Link to={`/help`} class="tooltip-menu m-2 m-md-0">
                                <Chip
                                    className={`btn-shadow tooltip-btn-shadow ${classes.chip}`}
                                    size="small"
                                    icon={<HelpRoundedIcon />}
                                    label="الدعم"
                                    clickable
                                    color="primary"
                                />
                            </Link>
                        </div>


                    </div>

                </div>
                <div className="w-20">
                    {
                        isUserLogin && user && user._id ?
                            <UserMenu user={user} />
                            :
                            <Link to="/login" className="d-block" style={{ textDecoration: "unset", fontFamily: "inherit" }}>
                                <Button style={{ width: "120px", fontFamily: "inherit" }}>تسجيل دخول <LockOpenRoundedIcon /></Button>
                            </Link>
                    }
                </div>

            </nav>

            <NavbarList />



        </React.Fragment>

    )
}




function UserMenu({ user }) {

    // user = {}
    const classes = useStyles()

    const [checked, setChecked] = useState(false)

    const handleLogout = async () => {

        const loginId = Browser.getCookie("loginId")
        const userId = Browser.getCookie("userId")

        if (loginId == user.login_id && userId == user.user_id) {

            console.log(loginId, userId)
            Api.deleteLoginUser(loginId, userId).then(res => {
                console.log(res.data)

                Browser.setCookie("loginId", "", -1)
                Browser.setCookie("userId", "", -1)

                window.location.pathname = '/'
            })
        }
    }


    const handleClick = (event) => {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
        if (event.relatedTarget)
            if (event.relatedTarget.classList.contains("ListItem1"))
                return;
        console.log(event)
        setChecked((prev) => !prev);
    };

    return (
        <React.Fragment>

            <div className="position-relative">
                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} onBlur={handleClick}>
                    <div className="profileImg-sm" style={{ backgroundImage: `url(${user.profileImg})` }} >
                        <Slide direction="down" className={`custom-menu ${classes.menu}`} in={checked} mountOnEnter unmountOnExit>
                            <div>
                                <List aria-label="main mailbox folders" style={{ width: "250px" }}>
                                    <Link className="d-block" to={`/profile/${user.username}`} role="button" button style={{ fontFamily: "inherit" }}>
                                        <ListItem className="ListItem1" button>
                                            <ListItemIcon>
                                                <AccountCircleRoundedIcon style={{ fontSize: "18px" }} />
                                            </ListItemIcon>
                                            <ListItemText primary="الصفحة الشخصية" />
                                        </ListItem>

                                    </Link>

                                    <Link className="d-block" to={`/settings`} role="button" button style={{ fontFamily: "inherit" }}>
                                        <ListItem className="ListItem1" button>
                                            <ListItemIcon>
                                                <SettingsRoundedIcon style={{ fontSize: "18px" }} />
                                            </ListItemIcon>
                                            <ListItemText primary="الاعدادات" />
                                        </ListItem>
                                    </Link>

                                    <ListItem className="ListItem1" button onClick={handleLogout} style={{ fontFamily: "inherit" }}>
                                        <ListItemIcon>
                                            <MeetingRoomRoundedIcon style={{ fontSize: "18px" }} />
                                        </ListItemIcon>
                                        <ListItemText style={{ fontFamily: "inherit" }} primary="تسجيل الخروج" />
                                    </ListItem>
                                </List>
                                <Divider />

                            </div>
                        </Slide>
                    </div>
                </Button>
            </div>
        </React.Fragment>
    );

}

export default Navbar