const router = require("express").Router()

const Admin = require("../models/Admin")

router.post("/", async (req, res) => {
    try {
        const newAdmin = new Admin(req.body)
        const admin = await newAdmin.save()
        res.status(200).json(admin)
    } catch (err) {
        res.status(500).json(err)
    }
})


router.get("/:_id", async (req, res) => {
    try {
        const admin = await Admin.findOne({ userId: req.params._id })
        res.status(200).json(admin)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router