import mongoose from 'mongoose'
const noteSchema = new mongoose.SchemaTypes({
    text: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
const applicationschema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Owner is required"]
    },
    company: {
        type: String,
        required: [true, "Company is required"],
        trim: true,
        minlength: 2,
        maxlength: 60
    },
    role: {
        type: String,
        required: [true, "Role is required"],
        trim: true,
        minlength: 2,
        maxlength: 60
    },
    status: {
        type: String,
        enum: { values: ["Applied", "Interviewing", "Offer", "Rejected"], message: "Status must be Applied, Interview, Offer or Rejected" },
        default: "Applied"
    },
    priority: {
        type: String,
        enum: ["High", "Medium", "Low"],
        default: "Medium"
    },
    appliedOn: {
        type: Date,
        default: Date.now,
        validate: {
            validator: function (value) {
                return value <= new Date()
            },
            message: "Date cannot be in the future"
        }
    },
    salary: {
        type: Number,
        min: 0,

    },
    notes: [noteSchema]
}, { timestamps: true })
export default mongoose.model('Application', applicationschema)