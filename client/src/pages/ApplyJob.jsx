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

const ApplyJob = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  const [jobData, setJobData] = useState(null)
  const {jobs, backendUrl, userData, userApplications} = useContext(AppContext)
  const applyRef = useRef(null)
  const topRef = useRef(null)
  

  const fetchJob = async()=>{
  try {
    const {data} = await axios.get(backendUrl+`/api/jobs/${id}`)
    if(data.success){
      setJobData(data.job)
    } else {
      toast.error(data.message)
    }
  } catch (error) {
    toast.error(error.message)
  }
   
  }

  const applyHandler = async()=>{
    try {
      if(!userData){
        return toast.error('Login to apply for jobs')
      }
      if(!userData.resume){
        navigate('/applications')
        return toast.error('Upload resume to apply')
      }
    } catch (error) {
       toast.error(error.message)
    }
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

  useEffect(()=>{
    
      fetchJob()
    
  },[id,jobs])

  return jobData ? (
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
                src={jobData.companyId.image} 
                alt={jobData.companyId.name}
              />
              
              <div className='text-center sm:text-left text-neutral-700 flex-1'>
                <h1 className='text-2xl sm:text-3xl lg:text-4xl font-medium mb-3'>
                  {jobData.title}
                </h1>
                
                <div className='flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2 items-center text-gray-600 text-sm'>
                  <span className='flex items-center gap-1.5'>
                    <img className='w-4 h-4' src={assets.suitcase_icon} alt="" />
                    <span>{jobData.companyId.name}</span>
                  </span>
                  
                  <span className='flex items-center gap-1.5'>
                    <img className='w-4 h-4' src={assets.location_icon} alt="" />
                    <span>{jobData.location}</span>
                  </span>
                  
                  <span className='flex items-center gap-1.5'>
                    <img className='w-4 h-4' src={assets.person_icon} alt="" />
                    <span>{jobData.level}</span>
                  </span>
                  
                  <span className='flex items-center gap-1.5'>
                    <img className='w-4 h-4' src={assets.money_icon} alt="" />
                    <span>CTC: {kconvert.convertTo(jobData.salary)}</span>
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
                Apply Now
              </button>
              <p className='text-sm text-gray-600'>
                Posted {moment(jobData.date).fromNow()}
              </p>
            </div>

          </div>

          {/* Job Description Section */}
          <div className='px-6 md:px-14 py-10'>
            <h2 className='text-3xl font-bold mb-4 text-black'>Job Description</h2>
            <div 
              className='text-gray-600 leading-7 mb-8 job-description-content'
              dangerouslySetInnerHTML={{__html: jobData.description}}
            />
            
            {/* More jobs section */}
            <div className='mt-12 mb-8'>
              <h2 className='text-2xl font-bold mb-6 text-black'>More jobs from {jobData.companyId.name}</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {jobs
                  .filter(job => job._id !== jobData._id && job.companyId._id === jobData.companyId._id)
                  .slice(0, 4)
                  .map((job, index) => (
                    <JobCard key={index} job={job} />
                  ))
                }
              </div>
            </div>
            
            {/* Apply Button at Bottom with ref */}
            <div ref={applyRef} className='scroll-mt-24 mt-8'>
              <button 
                onClick={scrollToTop}
                onClick={applyHandler}
                className='bg-blue-600 hover:bg-blue-700 transition-colors py-3 px-12 text-white rounded-lg font-medium text-lg'
              >
                Apply Now
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