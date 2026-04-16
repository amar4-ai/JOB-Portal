import Job from "../models/job.js"
import JobApplication from "../models/jobApplication.js"
import User from "../models/User.js"
import { v2 as cloudinary } from 'cloudinary'
import { getAuth } from "@clerk/express";





//GEr User Data
export const getUserData = async (req, res) => {
    const userId = req.auth.userId

    try {
        const user = await User.findOne({ clerkId: userId })
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
    try {
        const auth = getAuth(req);
        const userId = auth?.userId;



        if (!userId) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        const { jobId } = req.body;

        const isAlreadyApplied = await JobApplication.find({ jobId, userId });

        if (isAlreadyApplied.length > 0) {
            return res.json({ success: false, message: "Already Applied" });
        }

        const jobData = await Job.findById(jobId);

        if (!jobData) {
            return res.json({ success: false, message: "Job not found" });
        }

        await JobApplication.create({
            companyId: jobData.companyId,
            userId,
            jobId,
            date: Date.now()
        });

        res.json({ success: true, message: "Applied successfully." });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// export const applyForJob = async (req, res) => {
//   try {
//     const auth = getAuth(req);
//     const userId = auth?.userId;


//     if (!userId) {
//       return res.json({ success: false, message: "Unauthorized - login required" });
//     }

//     const { jobId } = req.body;

//     if (!jobId) {
//       return res.json({ success: false, message: "JobId missing" });
//     }

//     const already = await JobApplication.findOne({ jobId, userId });

//     if (already) {
//       return res.json({ success: false, message: "Already applied" });
//     }

//     const job = await Job.findById(jobId);

//     if (!job) {
//       return res.json({ success: false, message: "Job not found" });
//     }

//     const newApp = await JobApplication.create({
//       jobId,
//       userId,
//       companyId: job.companyId,
//       date: new Date()
//     });

   

//     res.json({ success: true, message: "Applied successfully" });

//   } catch (err) {
//     console.log(" APPLY ERROR:", err);
//     res.json({ success: false, message: err.message });
//   }
// };

//Get user applied applications
export const getuserJobApplications = async (req, res) => {

    try {
        const auth = getAuth(req);

        const userId = auth?.userId

        if (!userId) {
            return res.json({ success: false, message: "Unauthorized" });
        }
        const applications = await JobApplication.find({ userId })
            .populate('companyId', 'name email image')
            .populate('jobId', 'title description location category level salary')
            .exec()

        if (!applications) {
            return res.json({ success: false, message: 'No job applications found for this user' })

        }

        return res.json({ success: true, applications })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

//update user profile(resume)

export const updateUserResume = async (req, res) => {
    try {
        const userId = req.auth.userId
        const resumeFile = req.file

        const userData = await User.findOne({ clerkId: userId })

        if (!userData) {
            return res.json({ success: false, message: 'User not found' })
        }

        // If no file uploaded → return error
        if (!resumeFile) {
            return res.json({ success: false, message: 'Please upload a resume' })
        }

        // Upload only if file exists
        const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
        userData.resume = resumeUpload.secure_url

        await userData.save()

        return res.json({ success: true, message: 'Resume Updated' })

    } catch (error) {
        console.error('Update resume error:', error)
        res.json({ success: false, message: error.message })
    }
}