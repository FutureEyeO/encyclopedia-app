import React from 'react'
import { Link } from 'react-router-dom'

import Button from "@material-ui/core/Button"
import HelpRoundedIcon from '@material-ui/icons/HelpRounded';
import GroupRoundedIcon from '@material-ui/icons/GroupRounded';
import ChatRoundedIcon from '@material-ui/icons/ChatRounded';
import LockRoundedIcon from '@material-ui/icons/LockRounded';

export default function Footer() {
    return (
        <footer className="grey darken-4 p-2 mt-5" style={{color: "#9e9e9e"  }}>

            <div className="d-flex flex-wrap justify-content-around">

                <Button className={` grey  darken-1 rounded-pill m-2 ps-3 pe-3 ${``}`}>
                    <Link to={`/help`} style={{ color: "#212121 ", }}>
                        الدعم
                        <HelpRoundedIcon className="me-2" />
                    </Link>
                </Button>

                
                <Button className={` grey  darken-1 rounded-pill m-2 ps-3 pe-3 ${``}`}>
                    <Link to={`/contact`} style={{ color: "#212121 ", }}>
                        تواصل معنا
                        <ChatRoundedIcon className="me-2" />
                    </Link>
                </Button>
                
                <Button className={` grey  darken-1 rounded-pill m-2 ps-3 pe-3 ${``}`}>
                    <Link to={`/policy_privacy`} style={{ color: "#212121 ", }}>
                        السياسة و الخصوصية
                        <LockRoundedIcon className="me-2" />
                    </Link>
                </Button>

                <Button className={` grey  darken-1 rounded-pill m-2 ps-3 pe-3 ${``}`}>
                    <Link to={`/wahtis`} style={{ color: "#212121 ", }}>
                        من نحن
                        <GroupRoundedIcon className="me-2" />
                    </Link>
                </Button>


            </div>
            <div className="mt-3">

                <p>
                    جميع الحقوق محفوظة في @شعلة - 2021
                </p>
                <p>
                   تم تصميمه و بنائه بواسطة فريق FE.O لتطوير البرمجيات , و مرحبين دائما بجميع زوارنا ونتمنا لكم كل التوفيق و النجاح , ونسعا دائما لتطوير لتطوير كل ما هو مفيد ✨
                </p>
                <p>
                صنع ❤️ بواسطة فريق FE.O
                </p>
            </div>
        </footer>
    )
}
