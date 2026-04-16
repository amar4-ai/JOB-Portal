import React, { useContext, useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import Loading from '../components/Loading'
import Navbar from '../components/Navbar'
import kconvert from 'k-convert'
import moment from 'moment'
import JobCard from '../components/JobCard'
import Footer from '../components/Footer'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from '@clerk/react'

const ApplyJob = () => {
  const { id } = useParams()
  const { getToken } = useAuth()
  const navigate = useNavigate()
  const [JobData, setJobData] = useState(null)
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false)
  const { jobs, backendUrl, userData, userApplications, fetchUserApplications } = useContext(AppContext)
  const applyRef = useRef(null)
  const topRef = useRef(null)


  const fetchJob = async () => {
    try {
      const { data } = await axios.get(backendUrl + `/api/jobs/${id}`)
      if (data.success) {
        setJobData(data.job)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }

  }

  const applyHandler = async () => {
    try {
      if (!userData) {
        console.log("USER DATA:", userData)
        return toast.error('Login to apply for jobs')
      }
      if (!userData?.resume) {
        console.log("RESUME:", userData?.resume)
        navigate('/applications')
        return toast.error('Upload resume to apply')
      }
      const token = await getToken()

      const { data } = await axios.post(backendUrl + '/api/users/apply',
        { jobId: JobData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        toast.success(data.message)
        fetchUserApplications()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const checkAlreadyApplied = () => {
    const hasApplied = userApplications.some(item => item.jobId._id === JobData._id)
    setIsAlreadyApplied(hasApplied)


  }

  const scrollToApply = () => {
    applyRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }

  useEffect(() => {

    fetchJob()

  }, [id, jobs])

  useEffect(() => {
    if (userApplications.length > 0 && JobData) {
      checkAlreadyApplied()
    }

  }, [JobData, userApplications, id])

  return JobData ? (
    <>
      <Navbar />
      <div className='min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto'>
        <div className='bg-white text-black rounded-lg w-full shadow-md' ref={topRef}>
          {/* Job Header Section */}
          <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 px-6 md:px-14 py-8 bg-sky-50 border border-sky-400 rounded-t-xl'>

            {/* Left Section - Company Logo and Job Details */}
            <div className='flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full lg:w-auto'>
              <img
                className='h-20 w-20 sm:h-24 sm:w-24 bg-white rounded-lg p-4 border object-contain flex-shrink-0'
                src={JobData.companyId.image}
                alt={JobData.companyId.name}
              />

              <div className='text-center sm:text-left text-neutral-700 flex-1'>
                <h1 className='text-2xl sm:text-3xl lg:text-4xl font-medium mb-3'>
                  {JobData.title}
                </h1>

                <div className='flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2 items-center text-gray-600 text-sm'>
                  <span className='flex items-center gap-1.5'>
                    <img className='w-4 h-4' src={assets.suitcase_icon} alt="" />
                    <span>{JobData.companyId.name}</span>
                  </span>

                  <span className='flex items-center gap-1.5'>
                    <img className='w-4 h-4' src={assets.location_icon} alt="" />
                    <span>{JobData.location}</span>
                  </span>

                  <span className='flex items-center gap-1.5'>
                    <img className='w-4 h-4' src={assets.person_icon} alt="" />
                    <span>{JobData.level}</span>
                  </span>

                  <span className='flex items-center gap-1.5'>
                    <img className='w-4 h-4' src={assets.money_icon} alt="" />
                    <span>CTC: {kconvert.convertTo(JobData.salary)}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section - Apply Button */}
            <div className='w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5'>
              <button
                onClick={applyHandler}

                className='bg-blue-600 hover:bg-blue-700 transition-colors p-2.5 px-10 text-white rounded font-medium w-full sm:w-auto'
              >
                {isAlreadyApplied ? 'Already Applied' : 'Apply Now'}
              </button>
              <p className='text-sm text-gray-600'>
                Posted {moment(JobData.date).fromNow()}
              </p>
            </div>

          </div>

          {/* Job Description Section */}
          <div className='px-6 md:px-14 py-10'>
            <h2 className='text-3xl font-bold mb-4 text-black'>Job Description</h2>
            <div
              className='text-gray-600 leading-7 mb-8 job-description-content'
              dangerouslySetInnerHTML={{ __html: JobData.description }}
            />

            {/* More jobs section */}
            {/* <div className='mt-12 mb-8'>
              <h2 className='text-2xl font-bold mb-6 text-black'>More jobs from {JobData.companyId.name}</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {jobs
                  .filter(job => job._id !== JobData._id && job.companyId._id === JobData.companyId._id)
                  .filter(job => {
                    // Set of applied jobsIds
                    const appliedJobsIds = new Set(userApplications.map(app => app.jobId && app.jobId._id))
                    // Return true if the user has not already applied fo this job
                    return !appliedJobsIds.has(job._id)
                  })
                  .slice(0, 4)
                  .map((job, index) => (
                    <JobCard key={index} job={job} />
                  ))
                }
              </div>
            </div> */}
            {/* More jobs section */}
            <div className='mt-12 mb-8'>
              <h2 className='text-2xl font-bold mb-6 text-black'>
                More jobs from {JobData.companyId.name}
              </h2>

              {(() => {
                // ✅ Create Set ONCE (important fix)
                const appliedJobsIds = new Set(
                  (userApplications || [])
                    .map(app => app.jobId?._id)
                    .filter(Boolean)
                );

                return (
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {jobs
                      .filter(
                        job =>
                          job._id !== JobData._id &&
                          job.companyId._id === JobData.companyId._id
                      )
                      .filter(job => !appliedJobsIds.has(job._id))
                      .slice(0, 4)
                      .map(job => (
                        <JobCard key={job._id} job={job} />
                      ))}
                  </div>
                );
              })()}
            </div>

            {/* Apply Button at Bottom with ref */}
            <div ref={applyRef} className='scroll-mt-24 mt-8'>
              <button
                onClick={() => {
                  scrollToTop()
                  applyHandler()
                }}
                className='bg-blue-600 hover:bg-blue-700 transition-colors py-3 px-12 text-white rounded-lg font-medium text-lg'
              >
                {isAlreadyApplied ? 'Already Applied' : 'Apply Now'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom styles for job description HTML content */}
      {/* <style jsx>{`
        
      `}</style> */}
      <Footer />
    </>
  ) : (
    <Loading />
  )
}

export default ApplyJob