import React, { useEffect, useState } from 'react'

import { alpha, makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';

import SearchIcon from '@material-ui/icons/Search';


const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%"
    },
    rel: { 
        marginTop: "-20px",
        borderRadius: "0 0 10px 10px",
        backgroundColor: "#eeeeee",
        transition: "all .4s",
    },
    relOpen: {
        padding: "30px",
    },
    search: {
        position: 'relative',
        borderRadius: "10px",
        background: 'linear-gradient(45deg, #82b1ff   30%, #8c9eff    90%)',
        width: '100% !important',
        transition: "all .4s",
        boxShadow: "0 8px 40px 2px rgb(0 0 0 / 34%), 0 3px 14px 2px rgb(0 0 0 / 12%), 0 5px 5px -3px rgb(0 0 0 / 20%)",

        "&:hover": {
            boxShadow: "0 8px 40px 2px rgb(0 0 0 / 34%), 0 3px 14px 2px rgb(0 0 0 / 12%), 0 5px 5px -3px rgb(0 0 0 / 20%)"

        },
    },
    searchIcon: {
        cursor: "pointer",
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        left: 0,
        top: 0,
        fontSize: "30px",
        backgroundColor: "#82b1ff",
        borderRadius: "10px",
        // borderRadius: theme.shape.borderRadius,
    },
    inputRoot: {
        color: 'inherit',
        fontFamily: "inherit",
        fontSize: "30px",
        width: "100%",
    },
    inputInput: {
        padding: theme.spacing(4, 4, 4, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100% !important',
    }
}));

export default function SearchBox({ onSearch }) {
    const classes = useStyles()
    const [value, setValue] = useState("")
    const [relClass, seRelClass] = useState("")

    useEffect(() => {
        console.log(classes.rel)
    }, [])

    const hendleOpen = () => {
        seRelClass(classes.relOpen)
    }
    const hendleClose = () => {
        seRelClass("")
    }


    return (
        <div className={classes.root} onFocus={hendleOpen} onBlur={hendleClose}>
            <div className={classes.search}>
                <InputBase
                    placeholder="ابحث في الموسوعة ..."
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                    inputProps={{ 'aria-label': 'search' }}
                    onChange={(e) => {
                        console.log(e.target.value)
                        setValue(e.target.value)
                    }}
                />
                <div className={classes.searchIcon} onClick={() => onSearch(value)}>
                    <SearchIcon />
                </div>
            </div>
            <div className={classes.rel + " " + relClass}>

            </div>
        </div>
    )
}
