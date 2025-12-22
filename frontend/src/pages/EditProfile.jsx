import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const EditProfile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('basic');

    const [formData, setFormData] = useState({
        bio: '',
        contact: { phone: '', address: '', city: '', state: '', country: '', zip: '' },
        socials: { linkedin: '', github: '', website: '', twitter: '' },
        resume: '',
        skills: [],
        experience: [],
        education: [],
        certifications: []
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axios.get('/profile/me');
                if (data) {
                    // Normalize skills data
                    let normalizedSkills = [];
                    if (data.skills && Array.isArray(data.skills)) {
                        normalizedSkills = data.skills.map(skill => {
                            if (typeof skill === 'string') {
                                return { name: skill, level: 'Intermediate', description: '' };
                            }
                            return skill;
                        });
                    }

                    setFormData({
                        bio: data.bio || '',
                        contact: data.contact || { phone: '', address: '', city: '', state: '', country: '', zip: '' },
                        socials: data.socials || { linkedin: '', github: '', website: '', twitter: '' },
                        resume: data.resume || '',
                        skills: normalizedSkills,
                        experience: data.experience || [],
                        education: data.education || [],
                        certifications: data.certifications || []
                    });
                }
            } catch (error) {
                // Ignore 404 (no profile yet)
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e, section, index) => {
        const { name, value } = e.target;
        if (section) {
            setFormData(prev => ({
                ...prev,
                [section]: prev[section].map((item, i) => i === index ? { ...item, [name]: value } : item)
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/profile', formData);
            toast.success('Profile updated successfully');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Key Profile Information</h1>

            <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
                {['Basic', 'Contact', 'Resume', 'Skills', 'Experience', 'Education', 'Certs'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                        className={`py-4 px-6 font-medium text-sm focus:outline-none ${activeTab === tab.toLowerCase()
                            ? 'border-b-2 border-indigo-500 text-indigo-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow">

                {/* Basic Info */}
                {activeTab === 'basic' && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Bio</label>
                            <textarea
                                name="bio"
                                rows={4}
                                value={formData.bio}
                                onChange={(e) => handleChange(e)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                placeholder="Tell us about yourself..."
                            />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Social Links</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {['linkedin', 'github', 'website', 'twitter'].map((field) => (
                                <div key={field}>
                                    <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
                                    <input
                                        type="text"
                                        name={field}
                                        value={formData.socials[field]}
                                        onChange={(e) => handleNestedChange(e, 'socials')}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Contact Info */}
                {activeTab === 'contact' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {['phone', 'address', 'city', 'state', 'country', 'zip'].map((field) => (
                            <div key={field}>
                                <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
                                <input
                                    type="text"
                                    name={field}
                                    value={formData.contact[field]}
                                    onChange={(e) => handleNestedChange(e, 'contact')}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Resume Upload */}
                {activeTab === 'resume' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-900">Resume / CV</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Resume</label>
                            <div className="flex gap-4 items-center">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={formData.resume || ''}
                                        readOnly
                                        placeholder="No file chosen"
                                        className="block w-full border border-gray-300 rounded-md p-2 bg-gray-50"
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
                                                toast.update(toastId, { render: 'Resume uploaded successfully!', type: 'success', isLoading: false, autoClose: 2000 });
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
                                <Button type="button" variant="outline" className="pointer-events-none">
                                    Choose File
                                </Button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX</p>

                            {formData.resume && (
                                <div className="mt-4">
                                    <a
                                        href={formData.resume.startsWith('http') ? formData.resume : `http://localhost:5005${formData.resume}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                                    >
                                        View Current Resume
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Skills */}
                {activeTab === 'skills' && (
                    <div className="space-y-6">
                        {formData.skills.map((skill, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-4 p-4 border rounded relative bg-gray-50">
                                <button type="button" onClick={() => removeItem('skills', index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">&times;</button>
                                <div className="flex-1">
                                    <input placeholder="Skill Name" name="name" value={skill.name} onChange={(e) => handleChange(e, 'skills', index)} className="block w-full border rounded p-2 mb-2" required />
                                    <select name="level" value={skill.level} onChange={(e) => handleChange(e, 'skills', index)} className="block w-full border rounded p-2">
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Expert">Expert</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <textarea placeholder="Description (optional)" name="description" value={skill.description} onChange={(e) => handleChange(e, 'skills', index)} rows={3} className="block w-full border rounded p-2" />
                                </div>
                            </div>
                        ))}
                        <Button type="button" variant="outline" onClick={() => addItem('skills', { name: '', level: 'Intermediate', description: '' })}>+ Add Skill</Button>
                    </div>
                )}

                {/* Experience */}
                {activeTab === 'experience' && (
                    <div className="space-y-6">
                        {formData.experience.map((exp, index) => (
                            <div key={index} className="p-4 border rounded relative bg-gray-50 space-y-4">
                                <button type="button" onClick={() => removeItem('experience', index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">&times;</button>
                                <div className="grid grid-cols-2 gap-4">
                                    <input placeholder="Title" name="title" value={exp.title} onChange={(e) => handleChange(e, 'experience', index)} className="block w-full border rounded p-2" required />
                                    <input placeholder="Company" name="company" value={exp.company} onChange={(e) => handleChange(e, 'experience', index)} className="block w-full border rounded p-2" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="date" name="from" value={exp.from ? exp.from.split('T')[0] : ''} onChange={(e) => handleChange(e, 'experience', index)} className="block w-full border rounded p-2" placeholder="From" />
                                    <input type="date" name="to" value={exp.to ? exp.to.split('T')[0] : ''} onChange={(e) => handleChange(e, 'experience', index)} className="block w-full border rounded p-2" placeholder="To" />
                                </div>
                                <textarea placeholder="Description" name="description" value={exp.description} onChange={(e) => handleChange(e, 'experience', index)} rows={3} className="block w-full border rounded p-2" />
                            </div>
                        ))}
                        <Button type="button" variant="outline" onClick={() => addItem('experience', { title: '', company: '', from: '', to: '', description: '' })}>+ Add Experience</Button>
                    </div>
                )}

                {/* Certifications */}
                {activeTab === 'certs' && (
                    <div className="space-y-6">
                        {formData.certifications.map((cert, index) => (
                            <div key={index} className="p-4 border rounded relative bg-gray-50 space-y-4">
                                <button type="button" onClick={() => removeItem('certifications', index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">&times;</button>
                                <div className="grid grid-cols-2 gap-4">
                                    <input placeholder="Name" name="name" value={cert.name} onChange={(e) => handleChange(e, 'certifications', index)} className="block w-full border rounded p-2" required />
                                    <input placeholder="Issuer" name="issuer" value={cert.issuer} onChange={(e) => handleChange(e, 'certifications', index)} className="block w-full border rounded p-2" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="date" name="date" value={cert.date ? cert.date.split('T')[0] : ''} onChange={(e) => handleChange(e, 'certifications', index)} className="block w-full border rounded p-2" />
                                    <input placeholder="URL" name="url" value={cert.url} onChange={(e) => handleChange(e, 'certifications', index)} className="block w-full border rounded p-2" />
                                </div>
                            </div>
                        ))}
                        <Button type="button" variant="outline" onClick={() => addItem('certifications', { name: '', issuer: '', date: '', url: '' })}>+ Add Certification</Button>
                    </div>
                )}

                {/* Education (Simplified for brevity, can implement similar to others) */}
                {activeTab === 'education' && (
                    <div className="space-y-6">
                        {formData.education.map((edu, index) => (
                            <div key={index} className="p-4 border rounded relative bg-gray-50 space-y-4">
                                <button type="button" onClick={() => removeItem('education', index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">&times;</button>
                                <div className="grid grid-cols-2 gap-4">
                                    <input placeholder="School" name="school" value={edu.school} onChange={(e) => handleChange(e, 'education', index)} className="block w-full border rounded p-2" required />
                                    <input placeholder="Degree" name="degree" value={edu.degree} onChange={(e) => handleChange(e, 'education', index)} className="block w-full border rounded p-2" required />
                                </div>
                            </div>
                        ))}
                        <Button type="button" variant="outline" onClick={() => addItem('education', { school: '', degree: '', from: '', to: '' })}>+ Add Education</Button>
                    </div>
                )}

                <div className="flex justify-end pt-6">
                    <Button type="submit" size="lg">Save Profile</Button>
                </div>
            </form>
        </div>
    );
};

export default EditProfile;
