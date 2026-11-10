import mongoose from 'mongoose'
const messageschema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        enum: ["user", "assistant"]

    },
    content: {
        type: String,
        required: true,

    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { _id: false })

const conversationSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        required: true
    },
    messages: {
        type: [messageschema],
        default: []
    },
    summary: {
        type: String,
        default: ""
    }
}, { timestamps: true })
export default mongoose.model("Conversation", conversationSchema)