
import React, { useState, useContext, useEffect } from 'react'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,

} from "react-router-dom";

// Pages 
import Home from "./pages/Home.jsx"
import Categories from './pages/Categories.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import CreatePost from "./pages/CreatePost.jsx"
import EditPost from "./pages/EditPost.jsx"
import EditProfile from "./pages/EditProfile.jsx"
import Profile from "./pages/Profile.jsx"
import Post from './pages/Post.jsx';
import Search from './pages/Search.jsx';

// Components 
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';

import Browser from "./functions/Browser"
import { AuthContext } from "./context/AuthContext.js"
import { updateLoginApiContext, autoLoginApiContext } from "./ApiContext"


const updateLogin = async (dispatch) => {
    await updateLoginApiContext(dispatch)
    setInterval(async () => {
        await updateLoginApiContext(dispatch)
    }, 20000)
}



function App() {

    const context = useContext(AuthContext)
    const [isLogin, setIsLogin] = useState(true)

    useEffect(async () => {
        await autoLoginApiContext(context.dispatch)
        await updateLogin(context.dispatch)


        const loginId = Browser.getCookie("loginId")
        const userId = Browser.getCookie("userId")

        console.log(loginId, userId)

    }, []);

    const handleRedirect = () => {

        const loginId = Browser.getCookie("loginId")
        const userId = Browser.getCookie("userId")

        if (userId && loginId) {
            return null
        } else {
            return <Redirect to="/login" />
        }
    }


    return (
        <Router>
            <Navbar isUserLogin={true} />
            <Switch>
                <div className="mt-5 container-full p-2 h-100">
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route exact path="/categories">
                        <Categories />
                    </Route>
                    <Route exact path="/login">
                        <Login />
                    </Route>
                    <Route exact path="/register">
                        <Register />
                    </Route>
                    <Route exact path="/profile/:username">
                        <Profile />
                    </Route>
                    <Route exact path="/p/:postId">
                        <Post />
                    </Route>
                    <Route path="/create">
                        {
                            context.user?._id ?
                                <Route exact path="/create/post">
                                    <CreatePost />
                                </Route>
                                : handleRedirect()
                        }
                    </Route>
                    <Route path="/edit">
                        {
                            context.user?._id ?
                            <React.Fragment>

                                <Route exact path="/edit/post/:postId">
                                    <EditPost />
                                </Route>
                                <Route exact path="/edit/profile/:userId">
                                    <EditProfile />
                                </Route>
                            </React.Fragment>
                                : handleRedirect()
                        }
                    </Route>
                    
                    <Route path="/search">
                            <React.Fragment>
                                <Route exact path="/search">
                                    <Search />
                                </Route>
                            </React.Fragment>
            
                    </Route>

                </div>
            </Switch>
            <Footer />
        </Router>
    )

}




export default App;
