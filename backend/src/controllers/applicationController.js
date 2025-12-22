const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User'); // Import User model if needed, but Job populate is sufficient
const sendEmail = require('../utils/sendEmail');

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Student)
const applyForJob = async (req, res) => {
    console.log(`[ApplyForJob] Request received for Job ID: ${req.params.jobId}, User: ${req.user.id}`);
    try {
        // Fetch job and populate recruiter details
        const job = await Job.findById(req.params.jobId).populate('recruiter', 'name email');

        if (!job) {
            console.log(`[ApplyForJob] Job not found: ${req.params.jobId}`);
            return res.status(404).json({ message: 'Job not found' });
        }

        console.log(`[ApplyForJob] Job found: ${job.title}, Recruiter: ${job.recruiter ? job.recruiter.email : 'None'}`);

        // Check if valid role
        if (req.user.role !== 'student') {
            console.log(`[ApplyForJob] Invalid role: ${req.user.role}`);
            return res.status(400).json({ message: 'Only students can apply' });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            job: req.params.jobId,
            applicant: req.user.id,
        });

        if (existingApplication) {
            console.log(`[ApplyForJob] Already applied`);
            return res.status(400).json({ message: 'Already applied to this job' });
        }

        const application = await Application.create({
            job: req.params.jobId,
            applicant: req.user.id,
        });

        console.log(`[ApplyForJob] Application created: ${application._id}`);

        // Send Email to Recruiter (Non-blocking)
        if (job.recruiter && job.recruiter.email) {
            sendEmail({
                email: job.recruiter.email,
                subject: `New Application for ${job.title}`,
                message: `Hello ${job.recruiter.name},\n\nYou have received a new application for the position of ${job.title} from ${req.user.name}.\n\nLog in to your dashboard to view the application.\n\nBest,\nCareerNest Team`,
            }).then(() => console.log(`[ApplyForJob] Recruiter email sent`))
                .catch(err => console.error('Failed to send recruiter email:', err));
        } else {
            console.log(`[ApplyForJob] No recruiter email to send to.`);
        }

        // Send Confirmation Email to Student (Non-blocking)
        if (req.user.email) {
            sendEmail({
                email: req.user.email,
                subject: `Application Submitted: ${job.title}`,
                message: `Hello ${req.user.name},\n\nYou application for ${job.title} at ${job.company} has been successfully submitted.\n\nGood luck!\n\nBest,\nCareerNest Team`,
            }).then(() => console.log(`[ApplyForJob] Student email sent`))
                .catch(err => console.error('Failed to send student email:', err));
        }

        res.status(201).json(application);
    } catch (error) {
        console.error('[ApplyForJob] Server Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get student's applications
// @route   GET /api/applications/my
// @access  Private (Student)
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.user.id })
            .populate('job', 'title company location type')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get applications for a job
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter)
const getJobApplications = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if user is the recruiter of the job
        if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const applications = await Application.find({ job: req.params.jobId })
            .populate('applicant', 'name email')
            .sort({ createdAt: -1 });

        // Fetch profiles for each applicant
        const applicationsWithProfile = await Promise.all(applications.map(async (app) => {
            const profile = await require('../models/Profile').findOne({ user: app.applicant._id }).select('resume socials education experience skills');
            return {
                ...app.toObject(),
                applicantProfile: profile
            };
        }));

        res.json(applicationsWithProfile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update application status
// @route   PUT /api/applications/:id
// @access  Private (Recruiter)
const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id).populate('job');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Verify ownership
        if (application.job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        application.status = status;
        await application.save();

        res.json(application);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    applyForJob,
    getMyApplications,
    getJobApplications,
    updateApplicationStatus,
};
