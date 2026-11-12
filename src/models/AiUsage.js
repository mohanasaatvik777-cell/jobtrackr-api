import mongoose from 'mongoose'
const aiUsageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    endpoint: {
        type: String,
        required: true,
        enum: ["rewrite", "extract", "chat", "summary"],

    },
    model: {
        type: String,
        required: true
    },
    inputTokens: {
        type: Number,
        default: 0
    },
    outputTokens: {
        type: Number,
        default: 0
    },
    ms: {
        type: Number,
        default: 0
    },
    cost: {
        type: Number,
        default: 0
    }
}, { timestamps: true })
export default mongoose.model("AiUsage", aiUsageSchema)