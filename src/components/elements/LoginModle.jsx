import React from 'react'
import { Link } from 'react-router-dom'; 

import Button from '@material-ui/core/Button';

import VpnKeyRoundedIcon from '@material-ui/icons/VpnKeyRounded';
import LockOpenRoundedIcon from '@material-ui/icons/LockOpenRounded';

export default function LoginModle({ }) {
    return (

        <div className={`modal fade`} id="loginBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="loginBackdropLabel" aria-hidden="false">
            <div className={`modal-dialog modal-dialog-centered `}>
                <div className={`modal-content`}>
                    <div class="modal-header">
                        <h5 class="modal-title" id="loginBackdropLabel">
                            تسجيل الدخول
                        </h5>
                        <button type="button" class="btn-close ms-0 me-auto" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>
                            لا تستطيع التفاعل مع محتوى هذه الموسوعة , يجب عليك تسجيل الدخول لنظمن سلامة المعلومات و تجنب التفاعل العشوائي
                        </p>

                        <Button className="d-block w-100 rounded-pill m-2" style={{ fontFamily: "inherit" }} variant="contained" color="primary">
                            <Link to={`/login`} target="_blank" className="d-block" style={{ color: "inherit" }}>
                                دخول <LockOpenRoundedIcon />
                            </Link>
                        </Button>
                        <Button className="d-block w-100 rounded-pill m-2" style={{ fontFamily: "inherit" }} variant="contained" color="secondary">
                            <Link to={`/register`} target="_blank" className="d-block" style={{ color: "inherit" }} >
                                تسجيل الدخول <VpnKeyRoundedIcon />
                            </Link>
                        </Button>
                    </div>
                    <div class="modal-footer">
                    </div>
                </div>
            </div>
        </div>
    )
}
