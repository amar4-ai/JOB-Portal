import Job from "../models/job.js"
import JobApplication from "../models/jobApplication.js"
import User from "../models/User.js"




//GEr User Data
export const getUserData = async (req, res) => {
    const userId = req.auth.userId

    try {
        const user = await User.find(userId)
        if (!user) {
            return res.json({ success: false, message: "User not found" })

        }

        res.json({ success: true, user })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

//Apply for a job
export const applyForJob = async (req, res) => {
const {jobId} = req.body
const userId = req.auth.userId

try {
    const isAlreadyApplied = await JobApplication.find({jobId, userId})
    if (isAlreadyApplied.length > 0) {
        return res.json({success:false, message:"Already Applied"})
        
    }

    const jobData = await Job.find(jobId)

    if (!jobData) {
        return res.json({success:false, message:"Job not found"})
    }
    await JobApplication.create({
        companyId: jobData.companyId,
        userId,
        jobId,
        date: Date.now()
    })
    res.json({success:true, message:'Applied successfully.'})
} catch (error) {
    res.json({ success: false, message: error.message })
}
}

//Get user applied applications
export const getuserJobApplications = async (req, res) => {

}

//update user profile(resume)
export const updateUserResume = async (req, res) => {

}