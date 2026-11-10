import express from 'express'
import cors from 'cors'
import errorHandler from './middleware/errorHandler.js'
import logger from './middleware/logger.js'
import notFound from './middleware/notFound.js'
import router from './routes/applications.js'
import authRouter from './routes/auth.js'
import adminRouter from './routes/admin.js'
import helmet from 'helmet'
import aiRoutes from './routes/ai.js'
import chatRouter from './routes/chat.js'

const app = express()
app.set("trust proxy", 1)
app.use(helmet())
// Provide an empty string default if the environment variable is missing
const allowedOrigins = (process.env.CLIENT_URL || '')
    .split(',')
    .map(url => url.trim());

app.use(cors({ origin: allowedOrigins }))
app.use(express.json())
app.use(logger)
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        uptime: process.uptime()
    })
})
app.use("/api/ai", authRouter, aiRoutes)
app.use("/api/chat", authRouter, chatRouter)
app.use("/api/applications", router)
app.use("/api/auth", authRouter)
app.use("/api/admin", adminRouter)
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

