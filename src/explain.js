import 'dotenv/config'
import mongoose from 'mongoose'
import User from './models/User.js'
import Application from './models/Application.js'
try {
    await mongoose.connect(process.env.MONGODB_URI)
    const user = await User.findOne()
    const result = await Application.find({ owner: user._id, status: "Interview" }).explain("executionStats")
    console.log(result)
    console.log(result.queryPlanner.winningPlan.stage)
    console.log(result.executionStats.nReturned)
    console.log(result.executionStats.totalDocsExamined)
    await mongoose.disconnect()
} catch (err) {
    console.log(err)
    process.exit(1)
}