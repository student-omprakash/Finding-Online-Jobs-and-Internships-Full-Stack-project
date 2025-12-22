import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { FiPlus, FiUsers, FiBriefcase, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Spinner from '../components/ui/Spinner';
import Autocomplete from '../components/ui/Autocomplete';
import { jobTitlesList } from '../data/jobTitles';
import { companiesList } from '../data/companies';
import { locationsList } from '../data/locations';

const RecruiterDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview'); // overview, post-job, my-jobs
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // ATS State
    const [selectedJob, setSelectedJob] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [loadingApplicants, setLoadingApplicants] = useState(false);

    // Job Form State
    const [isEditing, setIsEditing] = useState(false);
    const [editJobId, setEditJobId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        type: 'Full-time',
        salary: '',
        experienceLevel: '',
        description: '',
        requirements: '',
    });

    useEffect(() => {
        fetchMyJobs();
    }, []);

    const fetchMyJobs = async () => {
        setLoading(true);
        try {
            // In a real app, this should be a specific endpoint for recruiter's jobs
            // For now, fetching all and filtering (efficient enough for MVP)
            // Ideally: GET /api/jobs/my or similar
            const res = await axios.get('/jobs');
            // Assuming the backend returns recruiter ID in the job object
            const myJobs = res.data.filter(job => job.recruiter._id === user._id || job.recruiter === user._id);
            setJobs(myJobs);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            // toast.error('Failed to load your jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateJob = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`/jobs/${editJobId}`, formData);
                toast.success('Job updated successfully!');
            } else {
                await axios.post('/jobs', formData);
                toast.success('Job posted successfully!');
            }

            resetForm();
            setActiveTab('my-jobs');
            fetchMyJobs();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || (isEditing ? 'Failed to update job' : 'Failed to post job'));
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            company: '',
            location: '',
            type: 'Full-time',
            salary: '',
            experienceLevel: '',
            description: '',
            requirements: '',
        });
        setIsEditing(false);
        setEditJobId(null);
    };

    const handleEditClick = (job) => {
        setFormData({
            title: job.title,
            company: job.company,
            location: job.location,
            type: job.type,
            salary: job.salary,
            experienceLevel: job.experienceLevel,
            description: job.description,
            requirements: Array.isArray(job.requirements) ? job.requirements.join(', ') : job.requirements,
        });
        setIsEditing(true);
        setEditJobId(job._id);
        setActiveTab('post-job');
    };

    const handleDeleteJob = async (id) => {
        if (!window.confirm('Are you sure you want to delete this job?')) return;
        try {
            await axios.delete(`/jobs/${id}`);
            toast.success('Job deleted successfully');
            fetchMyJobs();
        } catch (error) {
            toast.error('Failed to delete job');
        }
    };

    const handleViewApplicants = async (job) => {
        setSelectedJob(job);
        setLoadingApplicants(true);
        try {
            const res = await axios.get(`/applications/job/${job._id}`);
            setApplicants(res.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch applicants');
        } finally {
            setLoadingApplicants(false);
        }
    };

    const handleStatusUpdate = async (appId, newStatus) => {
        try {
            const res = await axios.put(`/applications/${appId}`, { status: newStatus });
            // Update local state
            setApplicants(prev => prev.map(app => app._id === appId ? { ...app, status: newStatus } : app));
            toast.success(`Applicant ${newStatus}`);
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Recruiter Dashboard</h1>
                <p className="text-slate-500 dark:text-slate-400">Welcome back, <span className="font-semibold text-primary-600 dark:text-primary-400">{user.name}</span></p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <Card className="p-4 space-y-2 sticky top-24">
                        <button
                            onClick={() => { setActiveTab('overview'); resetForm(); }}
                            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'overview' ? 'bg-primary-50 dark:bg-slate-800 text-primary-700 dark:text-primary-400 font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        >
                            <FiUsers /> Overview
                        </button>
                        <button
                            onClick={() => { setActiveTab('post-job'); resetForm(); }}
                            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'post-job' ? 'bg-primary-50 dark:bg-slate-800 text-primary-700 dark:text-primary-400 font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        >
                            <FiPlus /> {isEditing ? 'Edit Job' : 'Post a Job'}
                        </button>
                        <button
                            onClick={() => { setActiveTab('my-jobs'); resetForm(); }}
                            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'my-jobs' ? 'bg-primary-50 dark:bg-slate-800 text-primary-700 dark:text-primary-400 font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        >
                            <FiBriefcase /> My Jobs
                        </button>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="flex-grow">
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="p-6 border-l-4 border-l-primary-500">
                                <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{jobs.length}</div>
                                <div className="text-slate-500 dark:text-slate-400 font-medium">Active Jobs Posted</div>
                            </Card>
                            <Card className="p-6 border-l-4 border-l-emerald-500">
                                <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">0</div>
                                <div className="text-slate-500 dark:text-slate-400 font-medium">Total Applicants (Mock)</div>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'post-job' && (
                        <Card className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{isEditing ? 'Edit Job Opportunity' : 'Post a New Opportunity'}</h2>
                                {isEditing && (
                                    <Button variant="ghost" size="sm" onClick={resetForm}>Cancel Edit</Button>
                                )}
                            </div>
                            <form onSubmit={handleCreateJob} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Autocomplete
                                            label="Job Title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            options={jobTitlesList}
                                            placeholder="e.g. Senior Frontend Dev"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Autocomplete
                                            label="Company Name"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleInputChange}
                                            options={companiesList}
                                            placeholder="e.g. Acme Corp"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Autocomplete
                                            label="Location"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            options={locationsList}
                                            placeholder="e.g. Remote, Bangalore"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Job Type</label>
                                        <select
                                            name="type"
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                            value={formData.type}
                                            onChange={handleInputChange}
                                        >
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Internship">Internship</option>
                                            <option value="Contract">Contract</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        name="salary"
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                        value={formData.salary}
                                        onChange={handleInputChange}
                                        placeholder="e.g. ₹50k - ₹80k or Market Rate"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Experience Level</label>
                                    <input
                                        type="text"
                                        name="experienceLevel"
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                        value={formData.experienceLevel}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 0-2 years, 3-5 years"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Job Description</label>
                                    <textarea
                                        name="description"
                                        required
                                        rows="5"
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Detailed job responsibilities..."
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Requirements</label>
                                    <textarea
                                        name="requirements"
                                        rows="3"
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                        value={formData.requirements}
                                        onChange={handleInputChange}
                                        placeholder="Skills, Experience, etc."
                                    ></textarea>
                                </div>

                                <div className="flex justify-end">
                                    <Button type="submit" size="lg">{isEditing ? 'Update Job' : 'Publish Job'}</Button>
                                </div>
                            </form>
                        </Card>
                    )}

                    {activeTab === 'my-jobs' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Posted Jobs</h2>
                                <Button size="sm" onClick={() => setActiveTab('post-job')}><FiPlus /> New Job</Button>
                            </div>

                            {loading ? (
                                <Spinner />
                            ) : jobs.length === 0 ? (
                                <Card className="p-8 text-center">
                                    <p className="text-slate-500 dark:text-slate-400 mb-4">You haven't posted any jobs yet.</p>
                                    <Button variant="outline" onClick={() => setActiveTab('post-job')}>Post Your First Job</Button>
                                </Card>
                            ) : (
                                jobs.map(job => (
                                    <Card key={job._id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{job.title}</h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm">{job.company} • {job.location}</p>
                                            <div className="flex gap-2 mt-2">
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span>
                                                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{job.type}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button className="text-slate-400 hover:text-blue-600 transition-colors" title="Edit" onClick={() => handleEditClick(job)}><FiEdit2 /></button>
                                            <button
                                                className="text-slate-400 hover:text-red-600 transition-colors"
                                                title="Delete"
                                                onClick={() => handleDeleteJob(job._id)}
                                            >
                                                <FiTrash2 />
                                            </button>
                                            <Button size="sm" variant="outline" onClick={() => handleViewApplicants(job)}>
                                                View Applicants
                                            </Button>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Applicants Modal */}
                {selectedJob && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col"
                        >
                            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Applicants for {selectedJob.title}</h2>
                                <button onClick={() => setSelectedJob(null)} className="text-slate-400 hover:text-slate-600">&times;</button>
                            </div>

                            <div className="p-6 overflow-y-auto flex-grow">
                                {loadingApplicants ? (
                                    <div className="text-center py-10">Loading applicants...</div>
                                ) : applicants.length === 0 ? (
                                    <div className="text-center py-10 text-slate-500">No applicants yet.</div>
                                ) : (
                                    <div className="space-y-4">
                                        {applicants.map(app => (
                                            <div key={app._id} className="border border-slate-200 dark:border-slate-700 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                <div>
                                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{app.applicant?.name || 'Unknown User'}</h3>
                                                    <p className="text-slate-500 dark:text-slate-400 text-sm">{app.applicant?.email}</p>
                                                    <div className="mt-2 text-xs text-slate-400">
                                                        Applied: {new Date(app.createdAt).toLocaleDateString()}
                                                    </div>

                                                    {/* Applicant Links */}
                                                    <div className="flex gap-3 mt-3">
                                                        {app.applicantProfile?.resume && (
                                                            <a
                                                                href={app.applicantProfile.resume}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-xs font-semibold text-primary-600 hover:underline flex items-center gap-1"
                                                            >
                                                                <FiBriefcase className="text-xs" /> Resume
                                                            </a>
                                                        )}
                                                        {app.applicantProfile?.socials?.linkedin && (
                                                            <a
                                                                href={app.applicantProfile.socials.linkedin}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-xs font-semibold text-blue-700 hover:underline"
                                                            >
                                                                LinkedIn
                                                            </a>
                                                        )}
                                                        {app.applicantProfile?.socials?.github && (
                                                            <a
                                                                href={app.applicantProfile.socials.github}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-xs font-semibold text-slate-800 dark:text-slate-300 hover:underline"
                                                            >
                                                                GitHub
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mr-2 ${app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                                        app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {app.status}
                                                    </div>

                                                    {/* Actions */}
                                                    <select
                                                        className="border dark:border-slate-600 rounded px-2 py-1 text-sm bg-slate-50 dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                                                        value={app.status}
                                                        onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                                                    >
                                                        <option value="applied">Applied</option>
                                                        <option value="shortlisted">Shortlisted</option>
                                                        <option value="interviewing">Interviewing</option>
                                                        <option value="accepted">Accepted</option>
                                                        <option value="rejected">Rejected</option>
                                                    </select>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
                                <Button variant="outline" onClick={() => setSelectedJob(null)}>Close</Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div >
    );
};

export default RecruiterDashboard;
