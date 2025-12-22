import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { FiSearch, FiMapPin, FiBriefcase, FiDollarSign, FiClock, FiStar, FiFilter, FiShoppingBag, FiFileText, FiTarget } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [applying, setApplying] = useState(null);

  // Search State
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');

  // Filter States
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [salaryRange, setSalaryRange] = useState('');

  // Fetch Profile for Sidebar
  const [profile, setProfile] = useState(null);

  // Applied Jobs State
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());

  useEffect(() => {
    fetchJobs();
    if (user?.role === 'student') {
      fetchProfile();
      fetchAppliedJobs();
    }
  }, [searchParams, user]);

  const fetchAppliedJobs = async () => {
    try {
      const res = await axios.get('/applications/my');
      console.log('Fetched Applications Raw:', res.data);
      // Safely map to IDs, filtering out nulls (deleted jobs)
      const ids = new Set(
        res.data
          .filter(app => {
            if (!app.job) console.warn('Application has no job:', app);
            return app.job;
          }) // Ensure job exists
          .map(app => {
            // Handle both populated object and direct ID
            const jobData = app.job;
            const id = (jobData?._id || jobData)?.toString();
            return id;
          }) // Ensure string
      );
      console.log('Applied Job IDs Set:', Array.from(ids));
      setAppliedJobIds(ids);
    } catch (error) {
      console.error("Failed to fetch applications", error);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/profile/me');
      setProfile(res.data);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
  };

  const getUserHeadline = () => {
    if (!profile) return 'Student';
    if (profile.education && profile.education.length > 0) {
      const latest = profile.education[0];
      return `${latest.degree} student at ${latest.school}`;
    }
    return profile.bio || 'Student seeking opportunities';
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      let query = '?';
      if (keyword) query += `keyword=${keyword}&`;
      if (location) query += `location=${location}&`;
      if (experience) query += `experience=${experience}&`;
      // Backend handling for types array would differ, simplistic for now
      if (selectedTypes.length) query += `type=${selectedTypes[0]}&`;

      const res = await axios.get(`/jobs${query}`);
      setJobs(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleTypeChange = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleApply = async (jobId) => {
    if (!user) {
      toast.error('Please login to apply');
      return;
    }
    if (user.role !== 'student') {
      toast.error('Only students can apply for jobs');
      return;
    }
    setApplying(jobId);
    try {
      await axios.post(`/applications/${jobId}`);
      toast.success('Application submitted successfully!');
      setAppliedJobIds(prev => new Set(prev).add(jobId));
    } catch (error) {
      console.error('Apply Error:', error);
      const status = error.response?.status;
      const msg = error.response?.data?.message || error.message || 'Failed to apply';

      // Self-healing: If backend says already applied, update UI to reflect that
      if (status === 400 && (msg.toLowerCase().includes('already applied') || msg.toLowerCase().includes('duplicate'))) {
        toast.info('You have already applied to this job.');
        setAppliedJobIds(prev => new Set(prev).add(jobId));
      } else {
        // Genuine error
        toast.error(msg);
      }
    } finally {
      setApplying(null);
    }
  };

  return (
    <div className="bg-[#f8f9fa] dark:bg-slate-950 min-h-screen font-sans transition-colors duration-200">
      {/* Modern Search Bar Container (Naukri Style) */}
      <div className="bg-white dark:bg-slate-900 shadow-sm sticky top-16 z-30 py-4 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 md:items-center rounded-full border border-slate-200 dark:border-slate-700 shadow-lg p-2 bg-white dark:bg-slate-800">
            <div className="flex-1 flex items-center px-4 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700">
              <FiSearch className="text-slate-400 mr-3 h-5 w-5" />
              <input
                type="text"
                placeholder="Enter skills / designations / companies"
                className="w-full py-2 outline-none text-slate-700 dark:text-slate-200 bg-transparent placeholder-slate-400 dark:placeholder-slate-500"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center px-4 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700">
              <FiMapPin className="text-slate-400 mr-3 h-5 w-5" />
              <input
                type="text"
                placeholder="e.g. Bangalore, Mumbai, Delhi"
                className="w-full py-2 outline-none text-slate-700 dark:text-slate-200 bg-transparent placeholder-slate-400 dark:placeholder-slate-500"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center px-4">
              <FiBriefcase className="text-slate-400 mr-3 h-5 w-5" />
              <input
                type="text"
                placeholder="Experience (Years)"
                className="w-full py-2 outline-none text-slate-700 dark:text-slate-200 bg-transparent placeholder-slate-400 dark:placeholder-slate-500"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>
            <Button type="submit" size="lg" className="rounded-full px-8 py-2 md:py-2">Search</Button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Sidebar - Profile & Filters */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">

            {/* Profile Card */}
            {user && (
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden relative">
                <div className="h-20 bg-gradient-to-r from-primary-600 to-indigo-600"></div>
                <div className="px-5 pb-5 relative flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-800 shadow-md absolute -top-8 flex items-center justify-center text-xl font-bold text-primary-600">
                    {user.name.charAt(0)}
                  </div>
                  <div className="mt-10 w-full">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">{user.name}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 mb-3">{getUserHeadline()}</p>

                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">Profile Completed</span>
                        <span className="text-primary-600 font-medium">85%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-primary-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm border-t border-slate-100 dark:border-slate-700 pt-3">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Profile Views</span>
                        <span className="text-primary-600 font-medium">128</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Search Appearances</span>
                        <span className="text-primary-600 font-medium">45</span>
                      </div>
                    </div>

                    <Button size="sm" variant="outline" className="w-full mt-4 rounded-full" onClick={() => window.location.href = '/complete-profile'}>
                      Update Profile
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 sticky top-40">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2"><FiFilter /> All Filters</h3>
              </div>

              <hr className="my-4 border-slate-100 dark:border-slate-700" />
              {/* Filters Content... (Keeping existing filters) */}

              {/* Work Mode */}
              <div className="mb-6">
                <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-3 text-sm">Work Mode</h4>
                <div className="space-y-2">
                  {['Work from office', 'Remote', 'Hybrid'].map(mode => (
                    <label key={mode} className="flex items-center cursor-pointer group">
                      <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-primary-400" />
                      <span className="ml-2 text-slate-600 dark:text-slate-400 text-sm group-hover:text-slate-900 dark:group-hover:text-slate-200">{mode}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Job Type */}
              <div className="mb-6">
                <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-3 text-sm">Job Type</h4>
                <div className="space-y-2">
                  {['Full-time', 'Internship', 'Contract'].map(jType => (
                    <label key={jType} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(jType)}
                        onChange={() => handleTypeChange(jType)}
                        className="rounded text-primary-600 focus:ring-primary-500 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-primary-400"
                      />
                      <span className="ml-2 text-slate-600 dark:text-slate-400 text-sm group-hover:text-slate-900 dark:group-hover:text-slate-200">{jType}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Salary */}
              <div>
                <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-3 text-sm">Salary</h4>
                <div className="space-y-2">
                  {['0-3 LPA', '3-6 LPA', '6-10 LPA', '10-15 LPA', '15+ LPA'].map(sal => (
                    <label key={sal} className="flex items-center cursor-pointer group">
                      <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-primary-400" />
                      <span className="ml-2 text-slate-600 dark:text-slate-400 text-sm group-hover:text-slate-900 dark:group-hover:text-slate-200">{sal}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Job Feed */}
          <div className="lg:col-span-9 space-y-4">
            {/* Header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  {loading ? 'Searching...' : `Found ${jobs.length} Jobs`}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Based on your preferences</p>
              </div>

              <Button variant="outline" size="sm" onClick={fetchJobs} className="gap-2">
                <FiTarget className={loading ? "animate-spin" : ""} /> Check for new jobs
              </Button>
            </div>

            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 animate-pulse h-48"></div>
              ))
            ) : jobs.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 p-12 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <img src="https://cdni.iconscout.com/illustration/premium/thumb/job-search-3431034-2863777.png" alt="No jobs" className="w-48 h-48 mx-auto opacity-50 mb-4" />
                <h3 className="text-lg font-bold text-slate-700 dark:text-white">No jobs found</h3>
                <p className="text-slate-500 dark:text-slate-400">Try adjusting your search criteria</p>
              </div>
            ) : (
              <AnimatePresence>
                {jobs.map((job) => {
                  const isNew = (new Date() - new Date(job.createdAt)) < (48 * 60 * 60 * 1000);
                  return (
                    <motion.div
                      key={job._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all group overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start">
                          {/* Header: Title and Company */}
                          <div className="flex justify-between items-start mb-2 w-full">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors cursor-pointer">{job.title}</h3>
                                {isNew && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">New</span>}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-slate-700 dark:text-slate-300 font-medium text-sm">{job.company}</span>
                              </div>
                            </div>
                            <div className="hidden sm:block">
                              {/* Dummy Logo */}
                              <div className="w-12 h-12 rounded bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-xl font-bold text-slate-400">
                                {job.company.charAt(0)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Key Details Row */}
                        <div className="flex flex-wrap gap-4 md:gap-6 my-3 text-sm text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <FiBriefcase className="text-slate-400" />
                            <span>{job.experienceLevel || '0-2 Yrs'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 border-l pl-4 border-slate-200 dark:border-slate-700">
                            <FiDollarSign className="text-slate-400" />
                            <span>{job.salary || 'Not disclosed'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 border-l pl-4 border-slate-200 dark:border-slate-700">
                            <FiMapPin className="text-slate-400" />
                            <span>{job.location}</span>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="flex items-start gap-2 mb-4">
                          <FiFileText className="text-slate-400 shrink-0 mt-0.5" />
                          <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2">
                            {job.description}
                          </p>
                        </div>

                        {/* Skills / Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.skills?.slice(0, 4).map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded-full border border-slate-100 dark:border-slate-700 relative">
                              <span className="mr-1 opacity-50">•</span> {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="bg-slate-50 dark:bg-slate-950/50 px-6 py-3 flex justify-between items-center border-t border-slate-100 dark:border-slate-800">
                        <div className="flex gap-4">
                          <span className="text-slate-400 text-xs flex items-center gap-1">
                            <FiClock className="w-3 h-3" /> Posted {Math.floor((new Date() - new Date(job.createdAt)) / (1000 * 60 * 60 * 24))} days ago
                          </span>
                        </div>
                        <div className="flex gap-3">
                          <Button variant="ghost" size="sm" className="text-primary-600 hover:bg-primary-50">Save</Button>
                          <Button
                            size="sm"
                            onClick={() => handleApply(job._id)}
                            disabled={applying === job._id || appliedJobIds.has(job._id)}
                            variant={appliedJobIds.has(job._id) ? "outline" : "primary"}
                            className={appliedJobIds.has(job._id) ? "rounded-full px-6 text-green-600 border-green-600 bg-green-50" : "rounded-full px-6"}
                          >
                            {applying === job._id ? 'Applying...' : appliedJobIds.has(job._id) ? 'Applied' : 'Apply Now'}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
