// import 'dotenv/config'
// import app from './app.js'
// const PORT = process.env.PORT || 5000
// app.listen(PORT, () => {
//     console.log("APi running in the http://localhost")
// })

import dotenv from 'dotenv'
import app from './app.js'
import connectDB from './config/db.js'
dotenv.config()
const PORT = process.env.PORT || 5000
try {
    await connectDB()
    app.listen(PORT, () => {
        console.log(`API running in the http://localhost:${PORT}`)
    })
} catch (err) {
    console.log(err.message)
    process.exit(1)
}