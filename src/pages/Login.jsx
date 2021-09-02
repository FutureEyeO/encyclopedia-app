import React, { Component, useEffect, useState, useContext, useRef } from 'react'

import {
    Redirect,
    Route,
    Link,
    useHistory

} from 'react-router-dom';

import Api from '../functions/Api';

// context 
import { AuthContext } from '../context/AuthContext';
import { loginApiContext, autoLoginApiContext } from '../ApiContext';

// material 
import { makeStyles, withStyles } from '@material-ui/core/styles';
import LockOpenRoundedIcon from '@material-ui/icons/LockOpenRounded';
import { CircularProgress, LinearProgress } from "@material-ui/core"
import Backdrop from '@material-ui/core/Backdrop';
import Browser from '../functions/Browser';

const useStyles = makeStyles((theme) => ({

    backdrop: {
        zIndex: 1000000000000,
        color: '#fff',
    },
}));



export default function Login() {
    const context = useContext(AuthContext)
    const history = useHistory()

    const inputEmail = useRef()
    const inputPassword = useRef()

    const classes = useStyles();
    const [openBackdrop, setOpenBackdrop] = React.useState(false);



    useEffect(async () => {

    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault();

        setOpenBackdrop(true);

        let userCredentials = {
            userEmail: inputEmail.current.value,
            userPassword: inputPassword.current.value
        }

        await loginApiContext(userCredentials, context.dispatch).then(res => {
           
                window.location.pathname = "/"

        })

    }



    return (
        <React.Fragment>


            {
                context.isFetching ?
                    <Backdrop className={classes.backdrop} open={openBackdrop}>
                        <CircularProgress color="light" />
                    </Backdrop>
                    :
                    openBackdrop ? setOpenBackdrop(false) : null
                // setOpen(false)
            }
            {
                // context.user && context.user._id && !context.isFetching ? window.location.pathname = "/" : null
            }
            <div className="card text-center m-auto custom-card" style={{ maxWidth: "500px", fontSize: "inh" }}>
                <div className="card-header">
                    LOGIN
                </div>
                {context.isFetching ? <LinearProgress /> : <div className="bg-light" style={{ padding: ".12rem" }}></div>}
                <div className="card-body">
                    <form className="row g-4" onSubmit={handleSubmit}>
                        <div className="col-md-6">
                            <label htmlFor="inputEmail" className="form-label">Email</label>
                            <input type="email" className="form-control" id="inputEmail" placeholder="Email" required ref={inputEmail} />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="inputPassword" className="form-label">Password</label>
                            <input type="password" className="form-control" id="inputPassword" minLength="6" placeholder="Password" required ref={inputPassword} />
                        </div>
                        <div className="col-12">
                            <button type="submit" className="btn btn-primary text-center position-relative">
                                <div>

                                    {context.isFetching ? "Loading" : "Login"}

                                    {
                                        context.isFetching ?
                                            <CircularProgress disableShrink color="white" size="20px" className="me-1" thickness={5} style={{ marginBottom: "-5px" }} />
                                            :
                                            <LockOpenRoundedIcon className="me-1" />
                                    }
                                </div>
                            </button>
                        </div>
                    </form>
                </div>
                <div className="card-footer text-muted">

                    I don't have an account - <Link to="/register">register </Link>

                </div>
            </div>

        </React.Fragment>
    )
}