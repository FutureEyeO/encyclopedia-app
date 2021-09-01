import mongoose from "mongoose"

const connection = mongoose.createConnection(process.env.REACT_APP_MONGO_ADMIN_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) console.log("[!] - haven't connected to MongoDB")
    else console.log("[+] - have conncted successfully ")
})

export default connection