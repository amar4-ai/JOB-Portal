import express from 'express'
import { applyForJob, getUserData, getuserJobApplications, updateUserResume } from '../controllers/userController.js'
import upload from '../config/multer.js'


const router = express.Router()

//Get user data
router.get('/user', getUserData)


//Apply for a job
router.post('/apply', applyForJob)


//Get applied job data
router.get('/applications', getuserJobApplications)

//Updates user profile
router.post('/update-resume', upload.single('resume'),updateUserResume)

export default router