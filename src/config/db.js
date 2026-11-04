import mongoose from 'mongoose'
mongoose.set('sanitizeFilter', true)
export default async function connectDB() {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log(`MongoDB connected: ${mongoose.connection.host}`)

}