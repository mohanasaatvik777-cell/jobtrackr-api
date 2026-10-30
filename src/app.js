import express from 'express'
import cors from 'cors'
import errorHandler from './middleware/errorHandler.js'
import logger from './middleware/logger.js'
import notFound from './middleware/notFound.js'
import router from './routes/applications.js'
const app = express()
app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.json())
app.use(logger)
app.use("/api/applications", router)
app.get("/api/slow", (req, res) => {
    setTimeout(() => {
        res.status(200).json({ message: "Slow response after 3 seconds" })
    }, 3000)
})
app.get("/api/block", (req, res) => {
    const start = Date.now()
    while (Date.now() - start < 3000) {

    }
    res.status(200).json({ message: "Blocked for 3 seconds" })
})
app.use(notFound)
app.use(errorHandler)


export default app