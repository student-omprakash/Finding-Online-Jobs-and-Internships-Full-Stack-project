import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Autocomplete from '../components/ui/Autocomplete';
import { skillsList } from '../data/skills';
import { collegesList } from '../data/colleges';
import { degreesList } from '../data/degrees';
import { fieldsOfStudyList } from '../data/fieldsOfStudy';
import { jobTitlesList } from '../data/jobTitles';
import { companiesList } from '../data/companies';
import { certificationsList } from '../data/certifications';
import { issuersList } from '../data/issuers';
import { locationsList } from '../data/locations';
import { statesList } from '../data/states';
import { countriesList } from '../data/countries';
import { FiCheck, FiChevronRight, FiChevronLeft } from 'react-icons/fi';

const CompleteProfile = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const location = useLocation();
    const { mobile, workStatus } = location.state || {};

    const [formData, setFormData] = useState({
        bio: '',
        contact: { phone: mobile || '', address: '', city: '', state: '', country: '', zip: '' },
        socials: { linkedin: '', github: '', website: '', twitter: '' },
        skills: [{ name: '', level: 'Intermediate', description: '' }],
        education: [{ school: '', degree: '', fieldOfStudy: '', from: '', to: '', current: false }],
        experience: [],
        certifications: []
    });

    const handleChange = (e, section, index) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;

        if (section) {
            setFormData(prev => ({
                ...prev,
                [section]: prev[section].map((item, i) => i === index ? { ...item, [name]: val } : item)
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: val }));
        }
    };

    const handleNestedChange = (e, parent) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [parent]: { ...prev[parent], [name]: value }
        }));
    };

    const addItem = (section, template) => {
        setFormData(prev => ({
            ...prev,
            [section]: [...prev[section], template]
        }));
    };

    const removeItem = (section, index) => {
        setFormData(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Sanitize data before sending
            const payload = {
                ...formData,
                education: formData.education.map(edu => ({
                    ...edu,
                    to: edu.current ? null : edu.to
                })),
                experience: formData.experience.map(exp => ({
                    ...exp,
                    to: exp.current ? null : exp.to
                }))
            };

            await axios.post('/profile', payload);
            toast.success('Profile setup complete!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save profile');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Wizard Progress Bar
    const steps = [
        { num: 1, title: 'Contact' },
        { num: 2, title: 'Education & Skills' },
        { num: 3, title: 'Experience' },
        { num: 4, title: 'Links & Bio' }
    ];

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Complete Your Profile</h1>
                    <p className="mt-2 text-slate-600">Let's get you correctly set up to find the best jobs.</p>
                </div>

                {/* Progress Steps */}
                <div className="mb-8 flex justify-between items-center relative">
                    <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-200 -z-10"></div>
                    <div className="absolute left-0 top-1/2 h-1 bg-primary-600 -z-10 transition-all duration-300"
                        style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}></div>

                    {steps.map((s) => (
                        <div key={s.num} className="flex flex-col items-center bg-slate-50 px-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s.num ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'
                                }`}>
                                {step > s.num ? <FiCheck /> : s.num}
                            </div>
                            <span className={`text-xs mt-1 font-medium ${step >= s.num ? 'text-primary-600' : 'text-slate-400'}`}>
                                {s.title}
                            </span>
                        </div>
                    ))}
                </div>

                <Card className="p-8">
                    {/* Step 1: Contact Info */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-slate-900">Contact Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Phone Number *</label>
                                    <input type="text" name="phone" value={formData.contact.phone} onChange={(e) => handleNestedChange(e, 'contact')}
                                        className="mt-1 block w-full border border-slate-300 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500" placeholder="+91 98765 43210" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Address</label>
                                    <input type="text" name="address" value={formData.contact.address} onChange={(e) => handleNestedChange(e, 'contact')}
                                        className="mt-1 block w-full border border-slate-300 rounded-md p-2" placeholder="Street Address" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">City *</label>
                                    <Autocomplete
                                        placeholder="City *"
                                        name="city"
                                        value={formData.contact.city}
                                        onChange={(e) => handleNestedChange(e, 'contact')}
                                        options={locationsList}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">State *</label>
                                    <Autocomplete
                                        placeholder="State *"
                                        name="state"
                                        value={formData.contact.state}
                                        onChange={(e) => handleNestedChange(e, 'contact')}
                                        options={statesList}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Country *</label>
                                    <Autocomplete
                                        placeholder="Country *"
                                        name="country"
                                        value={formData.contact.country}
                                        onChange={(e) => handleNestedChange(e, 'contact')}
                                        options={countriesList}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Zip / Postal Code</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="zip"
                                            value={formData.contact.zip}
                                            onChange={async (e) => {
                                                const val = e.target.value;
                                                // Update state immediately
                                                handleNestedChange(e, 'contact');

                                                // Trigger lookup if 6 digits
                                                if (val.length === 6 && /^\d+$/.test(val)) {
                                                    try {
                                                        const toastId = toast.loading("Fetching location...");
                                                        // Use fetch to bypass axios interceptors
                                                        const response = await fetch(`https://api.postalpincode.in/pincode/${val}`);
                                                        const data = await response.json();

                                                        if (data && data[0].Status === "Success") {
                                                            const details = data[0].PostOffice[0];
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                contact: {
                                                                    ...prev.contact,
                                                                    city: details.District,
                                                                    state: details.State,
                                                                    country: "India",
                                                                    zip: val
                                                                }
                                                            }));
                                                            toast.update(toastId, { render: "Address found!", type: "success", isLoading: false, autoClose: 2000 });
                                                        } else {
                                                            toast.update(toastId, { render: "Invalid Pincode", type: "error", isLoading: false, autoClose: 2000 });
                                                        }
                                                    } catch (error) {
                                                        console.error("Pincode lookup failed", error);
                                                        toast.dismiss();
                                                        toast.error("Failed to fetch location");
                                                    }
                                                }
                                            }}
                                            className="mt-1 block w-full border border-slate-300 rounded-md p-2"
                                            placeholder="Enter 6-digit Pincode"
                                            maxLength={6}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Education & Skills */}
                    {step === 2 && (
                        <div className="space-y-8">
                            {/* Education Section */}
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 mb-4">Education</h2>
                                {formData.education.map((edu, index) => (
                                    <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200 mb-4 relative">
                                        <button onClick={() => removeItem('education', index)} className="absolute top-2 right-2 text-red-500 text-sm hover:underline">Remove</button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <Autocomplete
                                                placeholder="School / University *"
                                                name="school"
                                                value={edu.school}
                                                onChange={(e) => handleChange(e, 'education', index)}
                                                options={collegesList}
                                                required
                                            />
                                            <Autocomplete
                                                placeholder="Degree (e.g. B.Tech) *"
                                                name="degree"
                                                value={edu.degree}
                                                onChange={(e) => handleChange(e, 'education', index)}
                                                options={degreesList}
                                                required
                                            />
                                            <Autocomplete
                                                placeholder="Field of Study (e.g. CS)"
                                                name="fieldOfStudy"
                                                value={edu.fieldOfStudy}
                                                onChange={(e) => handleChange(e, 'education', index)}
                                                options={fieldsOfStudyList}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">From Date</label>
                                                <input type="date" name="from" value={edu.from} onChange={(e) => handleChange(e, 'education', index)} className="w-full p-2 border rounded" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">To Date</label>
                                                <input
                                                    type="date"
                                                    name="to"
                                                    value={edu.to}
                                                    onChange={(e) => handleChange(e, 'education', index)}
                                                    className="w-full p-2 border rounded"
                                                    disabled={edu.current}
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-2 flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`edu-current-${index}`}
                                                name="current"
                                                checked={edu.current}
                                                onChange={(e) => handleChange(e, 'education', index)}
                                                className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor={`edu-current-${index}`} className="text-sm text-gray-700">Currently studying here</label>
                                        </div>
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" onClick={() => addItem('education', { school: '', degree: '', fieldOfStudy: '', from: '', to: '', current: false })}>+ Add Education</Button>
                            </div>

                            <hr />

                            {/* Skills Section */}
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 mb-4">Skills</h2>
                                {formData.skills.map((skill, index) => (
                                    <div key={index} className="flex gap-3 mb-3 items-start">
                                        <div className="flex-1">
                                            <Autocomplete
                                                placeholder="Skill (e.g. React.js)"
                                                name="name"
                                                value={skill.name}
                                                onChange={(e) => handleChange(e, 'skills', index)}
                                                options={skillsList}
                                            />
                                        </div>
                                        <select name="level" value={skill.level} onChange={(e) => handleChange(e, 'skills', index)} className="p-2 border rounded w-32 h-[42px]">
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Expert">Expert</option>
                                        </select>
                                        <button onClick={() => removeItem('skills', index)} className="text-red-500 hover:text-red-700 mt-2">&times;</button>
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" onClick={() => addItem('skills', { name: '', level: 'Intermediate', description: '' })}>+ Add Skill</Button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Experience & Certifications */}
                    {step === 3 && (
                        <div className="space-y-8">
                            {/* Experience */}
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 mb-4">Work Experience (Internships/Jobs)</h2>
                                {formData.experience.length === 0 && <p className="text-slate-500 text-sm mb-2">No experience added yet. It's okay if you're a fresher!</p>}
                                {formData.experience.map((exp, index) => (
                                    <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200 mb-4 relative">
                                        <button onClick={() => removeItem('experience', index)} className="absolute top-2 right-2 text-red-500 text-sm">Remove</button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                            <Autocomplete
                                                placeholder="Job Title"
                                                name="title"
                                                value={exp.title}
                                                onChange={(e) => handleChange(e, 'experience', index)}
                                                options={jobTitlesList}
                                            />
                                            <Autocomplete
                                                placeholder="Company"
                                                name="company"
                                                value={exp.company}
                                                onChange={(e) => handleChange(e, 'experience', index)}
                                                options={companiesList}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mb-2">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">From Date</label>
                                                <input type="date" name="from" value={exp.from} onChange={(e) => handleChange(e, 'experience', index)} className="w-full p-2 border rounded" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">To Date</label>
                                                <input
                                                    type="date"
                                                    name="to"
                                                    value={exp.to}
                                                    onChange={(e) => handleChange(e, 'experience', index)}
                                                    className="w-full p-2 border rounded"
                                                    disabled={exp.current}
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-2 flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`exp-current-${index}`}
                                                name="current"
                                                checked={exp.current}
                                                onChange={(e) => handleChange(e, 'experience', index)}
                                                className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor={`exp-current-${index}`} className="text-sm text-gray-700">Currently work here</label>
                                        </div>

                                        <textarea placeholder="Description" name="description" value={exp.description} onChange={(e) => handleChange(e, 'experience', index)} className="w-full p-2 border rounded" rows="2" />
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" onClick={() => addItem('experience', { title: '', company: '', from: '', to: '', description: '', current: false })}>+ Add Experience</Button>
                            </div>

                            <hr />

                            {/* Certifications */}
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 mb-4">Certifications</h2>
                                {formData.certifications.map((cert, index) => (
                                    <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200 mb-4 relative">
                                        <button onClick={() => removeItem('certifications', index)} className="absolute top-2 right-2 text-red-500 text-sm hover:underline">Remove</button>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <Autocomplete
                                                placeholder="Certification Name"
                                                name="name"
                                                value={cert.name}
                                                onChange={(e) => handleChange(e, 'certifications', index)}
                                                options={certificationsList}
                                            />
                                            <Autocomplete
                                                placeholder="Issuer (e.g. Coursera)"
                                                name="issuer"
                                                value={cert.issuer}
                                                onChange={(e) => handleChange(e, 'certifications', index)}
                                                options={issuersList}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Issue Date</label>
                                                <input
                                                    type="date"
                                                    name="date"
                                                    value={cert.date}
                                                    onChange={(e) => handleChange(e, 'certifications', index)}
                                                    className="w-full p-2 border rounded"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Certificate URL (PDF/Link)</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="url"
                                                        name="url"
                                                        value={cert.url}
                                                        onChange={(e) => handleChange(e, 'certifications', index)}
                                                        className="flex-1 p-2 border rounded"
                                                        placeholder="https://..."
                                                    />
                                                    <div className="relative">
                                                        <input
                                                            type="file"
                                                            onChange={async (e) => {
                                                                const file = e.target.files[0];
                                                                if (!file) return;

                                                                const formData = new FormData();
                                                                formData.append('file', file);

                                                                try {
                                                                    e.target.disabled = true;
                                                                    toast.info('Uploading...');
                                                                    const res = await axios.post('/profile/upload-file', formData, {
                                                                        headers: { 'Content-Type': 'multipart/form-data' }
                                                                    });

                                                                    // Update the URL field
                                                                    handleChange({ target: { name: 'url', value: res.data.url } }, 'certifications', index);
                                                                    toast.success('File uploaded!');
                                                                } catch (error) {
                                                                    toast.error('Upload failed');
                                                                    console.error(error);
                                                                } finally {
                                                                    e.target.disabled = false;
                                                                    e.target.value = ''; // Reset input
                                                                }
                                                            }}
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                        />
                                                        <button className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm whitespace-nowrap">
                                                            Upload File
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" onClick={() => addItem('certifications', { name: '', issuer: '', date: '', url: '' })}>+ Add Certification</Button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Socials & Bio */}
                    {step === 4 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-slate-900">Final Touches</h2>

                            {/* Resume Upload */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Resume / CV *</label>
                                <div className="flex gap-4 items-center">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={formData.resume || ''}
                                            readOnly
                                            placeholder="No file chosen"
                                            className="block w-full border border-slate-300 rounded-md p-2 bg-slate-50"
                                        />
                                        <input
                                            type="file"
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (!file) return;

                                                const uploadData = new FormData();
                                                uploadData.append('file', file);

                                                try {
                                                    const toastId = toast.loading('Uploading resume...');
                                                    const res = await axios.post('/profile/upload-file', uploadData, {
                                                        headers: { 'Content-Type': 'multipart/form-data' }
                                                    });

                                                    setFormData(prev => ({ ...prev, resume: res.data.url }));
                                                    toast.update(toastId, { render: 'Resume uploaded!', type: 'success', isLoading: false, autoClose: 2000 });
                                                } catch (error) {
                                                    toast.dismiss();
                                                    toast.error('Details: ' + (error.response?.data?.message || error.message));
                                                    console.error(error);
                                                }
                                            }}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            accept=".pdf,.doc,.docx"
                                        />
                                    </div>
                                    <Button variant="outline" type="button" className="pointer-events-none">
                                        Upload Resume
                                    </Button>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Accepted formats: PDF, DOC, DOCX</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Bio / About Me</label>
                                <textarea name="bio" value={formData.bio} onChange={(e) => handleChange(e)}
                                    className="mt-1 block w-full border border-slate-300 rounded-lg p-3 shadow-sm" rows="4"
                                    placeholder="Brief introduction about your career goals..."></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">LinkedIn URL</label>
                                    <input type="text" name="linkedin" value={formData.socials.linkedin} onChange={(e) => handleNestedChange(e, 'socials')}
                                        className="mt-1 block w-full border border-slate-300 rounded-md p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">GitHub URL</label>
                                    <input type="text" name="github" value={formData.socials.github} onChange={(e) => handleNestedChange(e, 'socials')}
                                        className="mt-1 block w-full border border-slate-300 rounded-md p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Portfolio Website</label>
                                    <input type="text" name="website" value={formData.socials.website} onChange={(e) => handleNestedChange(e, 'socials')}
                                        className="mt-1 block w-full border border-slate-300 rounded-md p-2" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="mt-8 flex justify-between pt-6 border-t border-slate-200">
                        {step > 1 ? (
                            <Button variant="outline" onClick={prevStep}>
                                <FiChevronLeft className="mr-2" /> Back
                            </Button>
                        ) : (
                            <div></div> // Spacer
                        )}

                        {step < 4 ? (
                            <Button onClick={nextStep}>
                                Next <FiChevronRight className="ml-2" />
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit} isLoading={isSubmitting}>
                                Complete Setup
                            </Button>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CompleteProfile;
