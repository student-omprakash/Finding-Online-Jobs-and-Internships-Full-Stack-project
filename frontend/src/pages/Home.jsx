import React from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiMapPin, FiBriefcase, FiFilter } from 'react-icons/fi';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';

import CategoryGrid from '../components/home/CategoryGrid';
import TrustedCompanies from '../components/home/TrustedCompanies';

const SearchForm = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/jobs?keyword=${keyword}&location=${location}`);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white dark:bg-slate-800 p-3 rounded-full shadow-2xl shadow-slate-200 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row gap-0 max-w-5xl mx-auto divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-700"
    >
      <div className="flex-grow flex items-center px-6 py-3 relative group">
        <FiSearch className="text-slate-400 mr-3 text-lg group-focus-within:text-primary-500 transition-colors" />
        <div className="w-full">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">What</label>
          <input
            type="text"
            placeholder="Job title, skills, or company"
            className="bg-transparent border-none focus:outline-none w-full text-slate-800 dark:text-slate-200 placeholder-slate-300 dark:placeholder-slate-500 font-medium"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-grow flex items-center px-6 py-3 relative group">
        <FiMapPin className="text-slate-400 mr-3 text-lg group-focus-within:text-primary-500 transition-colors" />
        <div className="w-full">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">Where</label>
          <input
            type="text"
            placeholder="City, state, or remote"
            className="bg-transparent border-none focus:outline-none w-full text-slate-800 dark:text-slate-200 placeholder-slate-300 dark:placeholder-slate-500 font-medium"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-grow flex items-center px-6 py-3 relative group w-48 hidden md:flex">
        <FiFilter className="text-slate-400 mr-3 text-lg group-focus-within:text-primary-500 transition-colors" />
        <div className="w-full">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">Experience</label>
          <select
            className="bg-transparent border-none focus:outline-none w-full text-slate-800 dark:text-slate-200 font-medium appearance-none cursor-pointer"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          >
            <option value="" className="dark:bg-slate-800">Any</option>
            <option value="fresher" className="dark:bg-slate-800">Fresher (0-1y)</option>
            <option value="1-3" className="dark:bg-slate-800">Intermediate (1-3y)</option>
            <option value="3-5" className="dark:bg-slate-800">Mid-Senior (3-5y)</option>
            <option value="5+" className="dark:bg-slate-800">Expert (5y+)</option>
          </select>
        </div>
      </div>

      <div className="p-1">
        <Button type="submit" size="lg" className="rounded-full px-10 h-full w-full md:w-auto text-lg font-semibold">
          Search
        </Button>
      </div>
    </motion.form>
  );
};

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-slate-900 pt-20 pb-20 transition-colors duration-200">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] rounded-full bg-primary-50 blur-[100px] opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] rounded-full bg-indigo-50 blur-[100px] opacity-50 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight"
          >
            Find your dream job now
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-slate-500 dark:text-slate-400 mb-12"
          >
            5 lakh+ jobs for you to explore
          </motion.p>

          {/* Search Bar */}
          <div className="mb-10">
            <SearchForm />
          </div>

          {/* Quick Chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center gap-3 flex-wrap items-center"
          >
            <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider mr-2">Quick Search:</span>
            {[
              { label: 'Remote', icon: '🏠' },
              { label: 'MNC', icon: '🏢' },
              { label: 'Startup', icon: '🚀' },
              { label: 'Fresher', icon: '🎓' },
              { label: 'Data Science', icon: '📊' }
            ].map((tag) => (
              <Link key={tag.label} to={`/jobs?keyword=${tag.label}`} className="flex items-center gap-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-full text-slate-600 dark:text-slate-300 hover:border-primary-400 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 hover:shadow-md transition-all">
                <span>{tag.icon}</span> {tag.label}
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const FeaturedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get('/api/jobs');
        setJobs(res.data.slice(0, 3));
      } catch (error) {
        console.error('Featured Jobs Error:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Featured Opportunities</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Top picks from leading companies</p>
          </div>
          <Link to="/jobs" className="text-primary-600 font-medium hover:text-primary-700">View all jobs &rarr;</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-3 text-center py-10 text-slate-500">Loading opportunities...</div>
          ) : jobs.length === 0 ? (
            <div className="col-span-3 text-center py-10 text-slate-500">No jobs posted yet. Check back soon!</div>
          ) : (
            jobs.map((job) => (
              <Link key={job._id} to={`/jobs?keyword=${encodeURIComponent(job.title)}`}>
                <Card hoverEffect className="cursor-pointer h-full border-t-4 border-t-transparent hover:border-t-primary-500 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-12 w-12 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm rounded-lg flex items-center justify-center text-xl font-bold text-slate-400 dark:text-slate-500">
                      {job.company[0]}
                    </div>
                    <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">{job.type}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">{job.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-1 font-medium">{job.company}</p>

                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6">
                    <div className="flex items-center gap-1"><FiMapPin /> {job.location}</div>
                    <div className="flex items-center gap-1"><FiBriefcase /> {job.salary || 'N/A'}</div>
                  </div>

                  <Button variant="outline" className="w-full text-sm font-medium">View Details</Button>
                </Card>
              </Link>
            )))}
        </div>
      </div>
    </section>
  );
};

const StatsSection = () => {
  return (
    <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100 dark:divide-slate-800">
          {[
            { label: 'Live Jobs', value: '500+' },
            { label: 'Companies', value: '150+' },
            { label: 'Students Hired', value: '2k+' },
            { label: 'New Daily', value: '50+' },
          ].map((stat, idx) => (
            <div key={idx} className="px-4">
              <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">{stat.value}</div>
              <div className="text-slate-500 dark:text-slate-400 font-medium uppercase text-sm tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const Home = () => {
  return (
    <>
      <HeroSection />
      <TrustedCompanies />
      <CategoryGrid />
      <FeaturedJobs />
      <StatsSection />

      {/* Call to Action */}
      <section className="py-24 bg-slate-900 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to kickstart your career?</h2>
          <p className="text-slate-400 mb-10 text-xl">Join thousands of students finding their dream internships and jobs on CareerNest.</p>
          <div className="flex justify-center gap-6">
            <Link to="/register"><Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white shadow-xl shadow-primary-900/50 px-8 text-lg">Create Profile</Button></Link>
            <Link to="/recruiter-register"><Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-800 hover:border-slate-500 px-8 text-lg">Post a Job</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
