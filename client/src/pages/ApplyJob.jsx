import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import Loading from '../components/Loading';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import JobCard from '../components/JobCard';
import kconvert from 'k-convert';
import moment from 'moment';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '@clerk/react';

const ApplyJob = () => {
  const { id } = useParams();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [JobData, setJobData] = useState(null);
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);

  const {
    jobs,
    backendUrl,
    userData,
    userApplications,
    fetchUserApplications
  } = useContext(AppContext);

  const applyRef = useRef(null);
  const topRef = useRef(null);

  // Fetch single job
  const fetchJob = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`);
      if (data.success) {
        setJobData(data.job);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load job details');
    }
  };

  // Apply for job
  const applyHandler = async () => {
    try {
      if (!userData) {
        return toast.error('Please login to apply for this job');
      }
      if (!userData?.resume) {
        navigate('/applications');
        return toast.error('Please upload your resume first');
      }

      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/users/apply`,
        { jobId: JobData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message || 'Applied successfully!');
        fetchUserApplications();
        setIsAlreadyApplied(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Check if already applied
  const checkAlreadyApplied = () => {
    if (!JobData || !userApplications.length) return;

    const hasApplied = userApplications.some(
      (app) => app.jobId?._id === JobData._id
    );
    setIsAlreadyApplied(hasApplied);
  };

  const scrollToApply = () => {
    applyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Fetch job on mount or id change
  useEffect(() => {
    fetchJob();
  }, [id]);

  // Check application status when data is ready
  useEffect(() => {
    checkAlreadyApplied();
  }, [JobData, userApplications]);

  if (!JobData) return <Loading />;

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden" ref={topRef}>

            {/* ==================== HEADER SECTION ==================== */}
            <div className="bg-gradient-to-r from-sky-100 to-blue-100 border-b border-sky-300 px-8 py-10 flex flex-col lg:flex-row gap-8 items-start">

              {/* Left: Logo + Job Info */}
              <div className="flex gap-6 flex-1">
                <div className="w-20 h-20 bg-white rounded-xl p-4 border border-gray-200 flex-shrink-0 shadow-sm">
                  <img
                    src={JobData.companyId.image}
                    alt={JobData.companyId.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1">
                  <h1 className="text-4xl font-semibold text-gray-900 mb-4 leading-tight">
                    {JobData.title}
                  </h1>

                  <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-600">
                    <span className="flex items-center gap-2">
                      <img src={assets.suitcase_icon} className="w-4 h-4" alt="" />
                      {JobData.companyId.name}
                    </span>
                    <span className="flex items-center gap-2">
                      <img src={assets.location_icon} className="w-4 h-4" alt="" />
                      {JobData.location}
                    </span>
                    <span className="flex items-center gap-2">
                      <img src={assets.person_icon} className="w-4 h-4" alt="" />
                      {JobData.level}
                    </span>
                    <span className="flex items-center gap-2">
                      <img src={assets.money_icon} className="w-4 h-4" alt="" />
                      CTC: {kconvert.convertTo(JobData.salary)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Apply Button + Posted Date */}
              <div className="flex flex-col items-end gap-4 lg:min-w-[220px]">
                <button
                  onClick={applyHandler}
                  disabled={isAlreadyApplied}
                  className={`px-10 py-3.5 rounded-xl font-semibold text-base transition-all w-full lg:w-auto
                    ${isAlreadyApplied
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'}`}
                >
                  {isAlreadyApplied ? 'Already Applied' : 'Apply Now'}
                </button>

                <p className="text-sm text-gray-500">
                  Posted {moment(JobData.date).fromNow()}
                </p>
              </div>
            </div>

            {/* ==================== MAIN CONTENT ==================== */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* Left: Job Description */}
              <div className="lg:col-span-8 px-8 py-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Job Description</h2>

                <div
                  className="job-description-content text-gray-700 leading-relaxed text-[17px]"
                  dangerouslySetInnerHTML={{ __html: JobData.description }}
                />

                {/* Bottom Apply Button */}
                <div ref={applyRef} className="mt-12 flex justify-center">
                  <button
                    onClick={() => {
                      scrollToTop();
                      applyHandler();
                    }}
                    disabled={isAlreadyApplied}
                    className={`px-16 py-4 rounded-2xl text-lg font-semibold transition-all
                      ${isAlreadyApplied
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'}`}
                  >
                    {isAlreadyApplied ? 'Already Applied' : 'Apply Now'}
                  </button>
                </div>
              </div>

              {/* Right Sidebar: More Jobs from same company */}
              <div className="lg:col-span-4 bg-gray-50 border-l border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  More jobs from {JobData.companyId.name}
                </h2>

                <div className="space-y-6">
                  {jobs
                    .filter(job =>
                      job._id !== JobData._id &&
                      job.companyId._id === JobData.companyId._id
                    )
                    .filter(job => {
                      const appliedIds = new Set(
                        userApplications.map(app => app.jobId?._id)
                      );
                      return !appliedIds.has(job._id);
                    })
                    .slice(0, 3)
                    .map(job => (
                      <JobCard key={job._id} job={job} />
                    ))}

                  {jobs.filter(j =>
                    j._id !== JobData._id &&
                    j.companyId._id === JobData.companyId._id
                  ).length === 0 && (
                      <p className="text-gray-500 text-center py-8">
                        No other open positions from this company right now.
                      </p>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ApplyJob;