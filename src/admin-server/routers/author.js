const router = require("express").Router()

const Author = require("../models/Author")

router.post("/", async (req, res) => {
    try {
        const newAuthor = new Author(req.body)
        const author = await newAuthor.save()
        res.status(200).json(author)
    } catch (err) {
        res.status(500).json(err)
    }
})


router.get("/:_id", async (req, res) => {
    try {
        const author = await Author.findOne({ userId: req.params._id })
        res.status(200).json(author)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router