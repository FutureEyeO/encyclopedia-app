import React, { Component, useRef, useState, useEffect, useContext } from 'react'
import { v4 } from 'uuid'
import PostCard from '../components/elements/PostCard'
import Api from '../functions/Api'

export default function Search() {

    const [query, setQuery] = useState(new URLSearchParams(window.location.search))
    const [posts, setPosts] = useState({})
    const [searchObj, setSearchObj] = useState({
        labels: undefined,
        category: undefined,
    })

    useEffect(() => {
        setQuery(new URLSearchParams(window.location.search))
        console.log(query.get("labels"))
    }, [window.location.search])

    useEffect(() => {
        console.log(query.get("labels"))
        let labels = query.get("labels")

        if (labels)
            labels = labels.split(",").map(s => {
                s = s.trim()
                if (s != "")
                    return s
            })

        let category = query.get("category")
        if (category)
            category = category.trim()

        labels = labels != [] ? labels : undefined
        category = category != "" ? category : undefined

        setSearchObj({
            labels,
            category,
        })
        if (labels || category) {
            Api.searchPosts(labels, category).then(res => {
                console.log(res.data)
                setPosts(res.data)
            })
        }
    }, [query])

    return (
        <React.Fragment>
            <div className="d-flex justify-content-center flex-wrap">
            {
                Array.from(Object.keys(posts)).map(postId => {
                    return <PostCard id={v4()} postId={postId} />
                })
            }
            </div>
        </React.Fragment>
    )
}
