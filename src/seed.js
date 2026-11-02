import 'dotenv/config'
import mongoose from 'mongoose'
import User from './models/User.js'
import Application from './models/Application.js'
const companies = ["Google", "Zoho", "Swiggy", "Apple", "Zomato", "Uber", "TCL", "Deloite"]
const roles = ["Frontend Intern", "Backend Intern", "Full-stack Intern", "Database Intern", "Part-time Intern", "Like Intern"]
const status = ["Applied", "Interview", "Offer", "Rejected"]
const prioritiy = ["High", "Medium", "Low"]
//pick(arr) it is an function returns one random item
const pick = (arr) => {
    const interger = Math.floor(Math.random() * arr.length)
    return arr[interger]
}

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        await Application.deleteMany({})
        await User.deleteMany({})
        const createuser = await User.create([{
            name: 'Saatvik',
            email: 'mohanasaatvik777@gmail.com'
        }, {
            name: 'Shreeya',
            email: 'shreeya@gmail.com'
        }])
        const apps = []
        for (let item = 0; item < 1000; item++) {
            apps.push({
                owner: pick(createuser)._id,
                company: pick(companies),
                role: pick(roles),
                status: pick(status),
                priority: pick(prioritiy),
                salary: Math.floor(Math.random() * (1500000 - 300000 + 1) + 300000),
                appliedOn: new Date(Date.now() - Math.floor(Math.random() * (365 - 0 + 1) + 0) * 24 * 60 * 60 * 1000)
            })
        }
        await Application.insertMany(apps)
        console.log("Seeded 2 users and 1000 applications")
        await mongoose.disconnect()

    } catch (err) {
        console.log(err)
        process.exit(1)
    }

}
seed()