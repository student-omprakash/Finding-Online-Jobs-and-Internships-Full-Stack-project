import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    console.log('StudentDashboard Render. Loading:', loading, 'Profile:', profile);

    const navigate = useNavigate();
    // ...
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axios.get('/profile/me');
                setProfile(data);
            } catch (error) {
                // Profile might not exist yet -> Redirect to Onboarding
                if (error.response && error.response.status === 404) {
                    navigate('/complete-profile');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const ensureAbsoluteUrl = (url) => {
        if (!url) return '#';
        // Handle local uploads (backend static files)
        if (url.includes('uploads/')) {
            const cleanPath = url.startsWith('/') ? url.slice(1) : url;
            return `http://localhost:5005/${cleanPath}`;
        }
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        return `https://${url}`;
    };

    if (loading) return <Spinner />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
                <Link to="/profile/edit">
                    <Button variant="outline">Edit Profile</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Basic Info */}
                <div className="md:col-span-1 space-y-6">
                    <Card className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-600">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                                <p className="text-gray-500">{profile?.bio || 'No bio added'}</p>
                            </div>
                        </div>

                        {profile?.contact && (
                            <div className="text-sm text-gray-600 mt-4 space-y-1">
                                {profile.contact.phone && <p>📞 {profile.contact.phone}</p>}
                                {profile.contact.city && <p>📍 {profile.contact.city}, {profile.contact.country}</p>}
                            </div>
                        )}

                        <div className="mt-6">
                            <h3 className="font-semibold text-gray-900 mb-2">Socials</h3>
                            <div className="flex space-x-3">
                                {profile?.socials?.linkedin && <a href={ensureAbsoluteUrl(profile.socials.linkedin)} target="_blank" rel="noreferrer" className="text-primary-600 hover:text-primary-800">LinkedIn</a>}
                                {profile?.socials?.github && <a href={ensureAbsoluteUrl(profile.socials.github)} target="_blank" rel="noreferrer" className="text-primary-600 hover:text-primary-800">GitHub</a>}
                                {profile?.socials?.website && <a href={ensureAbsoluteUrl(profile.socials.website)} target="_blank" rel="noreferrer" className="text-primary-600 hover:text-primary-800">Website</a>}
                            </div>
                        </div>

                        {profile?.resume && (
                            <div className="mt-6 border-t pt-4">
                                <h3 className="font-semibold text-gray-900 mb-2">Resume</h3>
                                <a
                                    href={ensureAbsoluteUrl(profile.resume)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center text-primary-600 hover:text-primary-800 font-medium"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    View Resume
                                </a>
                            </div>
                        )}
                    </Card>

                    {/* Skills Section */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {profile?.skills && profile.skills.length > 0 ? (
                                profile.skills.map((skill, index) => (
                                    <span key={index} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm" title={skill.description}>
                                        {typeof skill === 'object' ? skill.name : skill} <span className="text-xs text-indigo-400">({skill.level || 'Intermediate'})</span>
                                    </span>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">No skills added yet.</p>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Right Column: Experience, Education, Certs */}
                <div className="md:col-span-2 space-y-6">
                    {/* Certifications */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 text-lg">Certifications</h3>
                        {profile?.certifications && profile.certifications.length > 0 ? (
                            <div className="space-y-4">
                                {profile.certifications.map((cert, index) => (
                                    <div key={index} className="border-l-2 border-indigo-200 pl-4 py-1">
                                        <h4 className="font-medium text-gray-900">{cert.name}</h4>
                                        <p className="text-sm text-gray-500">{cert.issuer} • {cert.date ? new Date(cert.date).getFullYear() : 'No date'}</p>
                                        {cert.url && <a href={ensureAbsoluteUrl(cert.url)} target="_blank" rel="noreferrer" className="text-xs text-indigo-500 hover:underline">View Credential</a>}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No certifications added.</p>
                        )}
                    </Card>

                    {/* Experience */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 text-lg">Experience</h3>
                        {profile?.experience && profile.experience.length > 0 ? (
                            <div className="space-y-4">
                                {profile.experience.map((exp, index) => (
                                    <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                                        <h4 className="font-medium text-gray-900">{exp.title}</h4>
                                        <p className="text-sm text-gray-600">{exp.company}</p>
                                        <p className="text-xs text-gray-400">
                                            {exp.from ? new Date(exp.from).toLocaleDateString() : ''} -
                                            {exp.current ? 'Present' : (exp.to ? new Date(exp.to).toLocaleDateString() : '')}
                                        </p>
                                        <p className="mt-2 text-sm text-gray-700">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No experience added.</p>
                        )}
                    </Card>

                    {/* Education */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 text-lg">Education</h3>
                        {profile?.education && profile.education.length > 0 ? (
                            <div className="space-y-4">
                                {profile.education.map((edu, index) => (
                                    <div key={index}>
                                        <h4 className="font-medium text-gray-900">{edu.school}</h4>
                                        <p className="text-sm text-gray-600">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No education added.</p>
                        )}
                    </Card>
                </div>
            </div >
        </div >
    );
};

export default StudentDashboard;
