import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const RESUME_RTF = `{\\rtf1\\ansi\\deff0\\nouicompat{\\fonttbl{\\f0\\fnil\\fcharset0 Arial;}}
{\\colortbl ;\\red0\\green0\\blue0;}
\\viewkind4\\uc1 
\\pard\\sa200\\sl276\\slmult1\\qc\\b\\f0\\fs48 [YOUR NAME]\\par
\\fs24 [City, State, Zip] | [Phone] | [Email]\\par
[LinkedIn] | [Portfolio]\\par
\\pard\\sa200\\sl276\\slmult1\\par
\\b0\\fs22\\par
\\pard\\sa200\\sl276\\slmult1\\b\\fs28 PROFESSIONAL SUMMARY\\par
\\b0\\fs24 Motivated professional. Proven track record.\\par
\\par
\\b\\fs28 SKILLS\\par
\\b0\\fs24\\bullet  Technical: [Skills]\\par
\\bullet  Soft Skills: [Skills]\\par
\\par
\\b\\fs28 EXPERIENCE\\par
\\b0\\fs24\\b [Role]\\b0  | [Company] | [Dates]\\par
\\bullet  Achievement 1.\\par
\\bullet  Achievement 2.\\par
\\par
\\b\\fs28 EDUCATION\\par
\\b0\\fs24\\b [Degree]\\b0  | [School] | [Year]\\par
}`;

const BLOG_POSTS = [
    {
        id: 1,
        category: "Career Advice",
        title: "Top 10 Tips for Landing Your First Internship in 2025",
        excerpt: "Navigating the early career landscape can be tough. Here are the essential strategies you need to know...",
        content: `
            <p class="mb-4">Getting your foot in the door is often the hardest part. Here is a breakdown of what really works in 2025:</p>
            <h4 class="font-bold mb-2">1. Optimize your LinkedIn</h4>
            <p class="mb-4">Recruiters are using AI to find candidates. Make sure your headline and 'About' section contain relevant keywords.</p>
            <h4 class="font-bold mb-2">2. Build Projects, Not Just Resumes</h4>
            <p class="mb-4">Show, don't just tell. A GitHub portfolio with 2-3 solid projects is worth more than a generic degree description.</p>
            <p><strong>Conclusion:</strong> Consistency is key. Apply to 5 jobs a day, network with alumni, and keep learning.</p>
        `
    },
    {
        id: 2,
        category: "Industry Trends",
        title: "Why Full-Stack Development is evolving",
        excerpt: "The lines between frontend and backend are blurring. Is the era of the specialist returning?",
        content: `
            <p class="mb-4">With the rise of serverless architecture and frameworks like Next.js, the definition of 'Full Stack' is changing.</p>
            <p class="mb-4">Frontend developers are now managing database queries, and backend developers are dealing with edge rendering.</p>
            <p>To stay relevant, focus on understanding the <strong>fundamental architecture</strong> of the web, not just specific libraries.</p>
        `
    },
    {
        id: 3,
        category: "Interview Prep",
        title: "Mastering the Behavioral Interview",
        excerpt: "It's not just about code. The STAR method is your best friend when answering soft-skill questions.",
        content: `
            <p class="mb-4">"Tell me about a time you failed." This question trips up many brilliant engineers.</p>
            <p class="mb-4"><strong>S.T.A.R. Method:</strong></p>
            <ul class="list-disc pl-5 mb-4 space-y-2">
                <li><strong>Situation:</strong> Set the scene.</li>
                <li><strong>Task:</strong> Describe the challenge.</li>
                <li><strong>Action:</strong> What did YOU do?</li>
                <li><strong>Result:</strong> What was the outcome?</li>
            </ul>
            <p>Practice this structure, and you will turn awkward moments into demonstrations of leadership.</p>
        `
    }
];

export const Blog = () => {
    const [expandedIds, setExpandedIds] = useState([]);

    const toggleExpand = (id) => {
        setExpandedIds(prev =>
            prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
        );
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-16 px-4 transition-colors duration-200">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8 text-center">Career Nest Blog</h1>
                <div className="grid gap-8">
                    {BLOG_POSTS.map(post => {
                        const isExpanded = expandedIds.includes(post.id);
                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                key={post.id}
                                className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow"
                            >
                                <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">{post.category}</span>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2 mb-3">{post.title}</h2>
                                <p className="text-slate-500 dark:text-slate-300 mb-4 text-lg">{post.excerpt}</p>

                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-4 mt-4"
                                        >
                                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <button
                                    onClick={() => toggleExpand(post.id)}
                                    className="text-primary-600 dark:text-primary-400 font-bold hover:text-primary-800 dark:hover:text-primary-300 transition-colors flex items-center gap-2 mt-2"
                                >
                                    {isExpanded ? 'Read Less' : 'Read More'} &rarr;
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export const ResumeGuide = () => (
    <div className="bg-white dark:bg-slate-900 min-h-screen py-16 px-4 transition-colors duration-200">
        <div className="max-w-3xl mx-auto prose prose-slate dark:prose-invert lg:prose-lg">
            <h1 className="text-center text-slate-900 dark:text-white">The Ultimate Resume Guide</h1>
            <p className="lead text-center text-slate-500 dark:text-slate-400 mb-12">Craft a resume that gets past ATS and impresses recruiters.</p>

            <h3>1. Keep it Concise</h3>
            <p>Recruiters spend an average of 7 seconds scanning a resume. Keep yours to 1 page if you have less than 10 years of experience.</p>

            <h3>2. Focus on Impact</h3>
            <p>Don't just list duties. List achievements. Use numbers whenever possible (e.g., "Increased sales by 20%").</p>

            <h3>3. Tailor Your Skills</h3>
            <p>Read the job description and make sure your skills section matches the keywords they are looking for.</p>

            <div className="bg-primary-50 dark:bg-slate-800 p-6 rounded-xl border border-primary-100 dark:border-slate-700 not-prose mt-8">
                <h4 className="font-bold text-primary-800 dark:text-primary-300 text-lg mb-2">Need a template?</h4>
                <p className="text-primary-700 dark:text-slate-300 mb-4">Download our ATS-friendly resume template to get started.</p>
                <div className="flex gap-4">
                    <a
                        href={`data:application/rtf;charset=utf-8,${encodeURIComponent(RESUME_RTF)}`}
                        download="Harvard_ATS_Resume_Template.rtf"
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 inline-block font-medium"
                    >
                        Download Harvard Template (RTF)
                    </a>
                    <a
                        href="/resume_template.md"
                        download="Harvard_ATS_Resume_Template.md"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white dark:bg-slate-700 text-slate-700 dark:text-white border border-slate-300 dark:border-slate-600 px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 inline-block font-medium"
                    >
                        Download Simple Text (MD)
                    </a>
                </div>
            </div>
        </div>
    </div>
);

export const FAQ = () => (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-16 px-4 transition-colors duration-200">
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">Frequently Asked Questions</h1>
            <div className="space-y-4">
                {[
                    { q: "Is CareerNest free for students?", a: "Yes! Creating a profile, browsing jobs, and applying is 100% free for students." },
                    { q: "How do I spot a fake job listing?", a: "We vet all companies, but always be wary of anyone asking for money or sensitive banking info upfront." },
                    { q: "Can I apply for jobs outside my major?", a: "Absolutely. Many skills are transferable. Highlight your relevant projects and soft skills." },
                    { q: "How can I improve my profile visibility to recruiters?", a: "Complete your profile 100%. Add a professional photo, detailed bio, list all your skills, and upload a verified resume. Profiles with certifications get 3x more views." },
                    { q: "What happens after I submit an application?", a: "The recruiter receives your profile and resume immediately. You will be notified via email if they shortlist you for an interview." },
                    { q: "Can I update my resume after applying?", a: "No, the version of the resume you submitted at the time of application is final for that specific job. You can update it for future applications." },
                    { q: "Is there a limit to how many jobs I can apply for?", a: "There is no strict limit, but we recommend applying only to roles that match your skills and interests to maintain a high response rate." }
                ].map((item, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.q}</h3>
                        <p className="text-slate-600 dark:text-slate-300">{item.a}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export const RecruiterLanding = () => (
    <div className="bg-white dark:bg-slate-900 min-h-screen transition-colors duration-200">
        <div className="bg-slate-900 text-white py-24 px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Hire the Best Talent, <span className="text-primary-400">Faster.</span></h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">Join 1000+ companies using CareerNest to find their next interns and full-time employees.</p>
            <div className="flex justify-center gap-4">
                <Link to="/register?role=recruiter" className="bg-primary-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-primary-700 transition-colors inline-block">Start Hiring</Link>
                <a href="mailto:sales@careernest.com" className="bg-transparent border border-white text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white/10 transition-colors inline-block">Contact Sales</a>
            </div>
        </div>
        <div className="py-20 max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
                <div className="text-5xl font-bold text-primary-600 mb-2">10k+</div>
                <div className="text-slate-600 font-medium">Active Students</div>
            </div>
            <div>
                <div className="text-5xl font-bold text-primary-600 mb-2">95%</div>
                <div className="text-slate-600 font-medium">Placement Rate</div>
            </div>
            <div>
                <div className="text-5xl font-bold text-primary-600 mb-2">48h</div>
                <div className="text-slate-600 font-medium">Avg. Time to Hire</div>
            </div>
        </div>
    </div>
);
