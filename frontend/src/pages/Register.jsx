import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { FiUser, FiMail, FiLock, FiBriefcase, FiPhone, FiUpload, FiCheck, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'student';
  const isRecruiter = role === 'recruiter';

  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [workStatus, setWorkStatus] = useState('fresher'); // 'fresher' | 'experienced'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: ''
  });

  const [resume, setResume] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResumeChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const uploadResume = async () => {
    if (!resume) return;

    const formData = new FormData();
    formData.append('resume', resume);

    try {
      await axios.post('/profile/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Silent success or log
      console.log('Resume uploaded successfully via Register flow');
    } catch (error) {
      console.error('Failed to upload resume during registration', error);
      // Optional: don't block registration success if resume fails
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await register(formData.name, formData.email, formData.password, role);

    if (success) {
      // If there is a resume and user is student, upload it
      if (resume && !isRecruiter) {
        await uploadResume();
      }

      if (isRecruiter) {
        navigate('/dashboard');
      } else {
        // Navigate to profile completion with pre-filled data
        navigate('/complete-profile', {
          state: {
            mobile: formData.mobile,
            workStatus: workStatus
          }
        });
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-200">
      <div className="w-full max-w-6xl bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row h-auto min-h-[600px]">

        {/* Left Side - Info Panel (Naukri Style) */}
        <div className="hidden md:flex flex-col justify-center p-12 w-2/5 relative bg-gradient-to-br from-primary-50 to-white dark:from-slate-800 dark:to-slate-900 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-y-1/2 -translate-x-1/4"></div>

          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-6 leading-tight">
              On registering, you can
            </h2>
            <ul className="space-y-6">
              {[
                'Build your profile and let recruiters find you',
                'Get job postings delivered right to your email',
                'Find a job and grow your career'
              ].map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + (index * 0.1) }}
                  className="flex items-start"
                >
                  <div className="bg-white dark:bg-slate-700 p-1 rounded-full shadow-sm mr-3 mt-1 text-primary-600 dark:text-primary-400">
                    <FiCheck size={16} strokeWidth={3} />
                  </div>
                  <span className="text-slate-600 dark:text-slate-300 font-medium">{item}</span>
                </motion.li>
              ))}
            </ul>

            <div className="mt-12 p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/50 dark:border-slate-600/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">CN</div>
                <div>
                  <div className="font-bold text-slate-800 dark:text-white">CareerNest Trust</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Over 10,000+ Students Placed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full md:w-3/5 p-8 md:p-12 relative">
          <div className="max-w-md mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{isRecruiter ? 'Create Recruiter Account' : 'Create your account'}</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2">
                {isRecruiter ? 'Find the best talent for your company' : "Search & apply to jobs from India's No.1 Job Site"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Work Status Toggle (Students Only) */}
              {!isRecruiter && (
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div
                    onClick={() => setWorkStatus('fresher')}
                    className={`cursor-pointer relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center text-center gap-2
                    ${workStatus === 'fresher'
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'}`}
                  >
                    {workStatus === 'fresher' && <div className="absolute top-2 right-2 text-primary-600"><FiCheckCircle /></div>}
                    <div className={`p-2 rounded-full ${workStatus === 'fresher' ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                      <FiUser size={20} />
                    </div>
                    <div>
                      <div className={`font-bold ${workStatus === 'fresher' ? 'text-primary-800 dark:text-primary-300' : 'text-slate-700 dark:text-slate-300'}`}>I'm a Fresher</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">I am a student / haven't worked</div>
                    </div>
                  </div>

                  <div
                    onClick={() => setWorkStatus('experienced')}
                    className={`cursor-pointer relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center text-center gap-2
                    ${workStatus === 'experienced'
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'}`}
                  >
                    {workStatus === 'experienced' && <div className="absolute top-2 right-2 text-primary-600"><FiCheckCircle /></div>}
                    <div className={`p-2 rounded-full ${workStatus === 'experienced' ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                      <FiBriefcase size={20} />
                    </div>
                    <div>
                      <div className={`font-bold ${workStatus === 'experienced' ? 'text-primary-800 dark:text-primary-300' : 'text-slate-700 dark:text-slate-300'}`}>I'm Experienced</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">I have work experience (2+ years)</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                  <input
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Tell us what's your name"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Email ID *</label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Tell us your Email ID"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">We'll send you relevant jobs in your mail</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Password *</label>
                  <input
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password for your account"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Mobile Number *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-slate-500 dark:text-slate-400 font-medium">+91</span>
                    <input
                      name="mobile"
                      required
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="Enter your mobile number"
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Recruiters will contact you on this number</p>
                </div>

                {/* Resume Upload - Optional (Students Only) */}
                {!isRecruiter && (
                  <div className="pt-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Resume (Optional)</label>
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors relative">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center justify-center text-slate-500">
                        {resume ? (
                          <div className="flex items-center text-primary-600 font-medium">
                            <FiCheckCircle className="mr-2" />
                            {resume.name}
                          </div>
                        ) : (
                          <>
                            <FiUpload className="mb-2 text-2xl" />
                            <span className="text-sm font-medium text-primary-600">Upload Resume</span>
                            <span className="text-xs mt-1">DOC, DOCX, PDF, RTF | Max: 2 MB</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 space-y-4">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3"
                  isLoading={isLoading}
                >
                  Register Now
                </Button>

                <div className="text-center mt-4 text-xs text-slate-500">
                  By clicking Register, you agree to the <a href="#" className="text-primary-600">Terms and Conditions</a> & <a href="#" className="text-primary-600">Privacy Policy</a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
