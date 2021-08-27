import React, { useState, useEffect } from 'react'

import { alpha, makeStyles } from '@material-ui/core/styles';
import { v4 } from "uuid"

const useStyles = makeStyles(() => {
    return {
        root: {
            position: 'relative',
            borderRadius: "10px",
            backgroundColor: "#bdbdbd",
            width: '100% !important',
            padding: "10px",
            transition: "all .4s",
            cursor: "pointer",

        },
        collapse: {
            marginTop: "-20px",
            borderRadius: "10px",
            border: "unset",
            padding: "15px",
            backgroundColor: "#bdbdbd"
        }
    }
});

export default function ListItemCollapse({ children, className, style, collapse }) {
    const classes = useStyles()
    const [id, setId] = useState()

    useEffect(() => {
        setId(`collapse${v4()}`)
    }, [])

    return (
        <div className="w-100">
            <div className={`${classes.root} ${className}`} style={style} data-bs-toggle="collapse" data-bs-target={`#${id}`} aria-expanded="false" aria-controls={id}>
                {children}
            </div>
            <div className={`collapse`} id={id}>
                <div className={classes.collapse}>
                    {collapse}
                </div>
            </div>
        </div>
    )
}
