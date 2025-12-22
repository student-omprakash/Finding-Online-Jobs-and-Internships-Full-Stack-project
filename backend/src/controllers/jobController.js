const Job = require('../models/Job');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
    try {
        const { keyword, location, type, experience } = req.query;
        let query = { isOpen: true };

        if (keyword) {
            const regex = { $regex: keyword, $options: 'i' };
            query.$or = [
                { title: regex },
                { company: regex },
                { description: regex },
                { skills: regex }
            ];
        }

        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        if (type) {
            query.type = type;
        }

        if (experience) {
            // Flexible match for experience level
            query.experienceLevel = { $regex: experience, $options: 'i' };
        }

        const jobs = await Job.find(query).populate('recruiter', 'name email').sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate(
            'recruiter',
            'name email'
        );

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.json(job);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Recruiter/Admin)
const createJob = async (req, res) => {
    try {
        const { title, description, company, location, type, salary, requirements, experienceLevel, skills } = req.body;

        const job = await Job.create({
            title,
            description,
            company,
            location,
            type,
            salary,
            requirements,
            experienceLevel: experienceLevel || '0-1 years', // Provide default if missing
            skills,
            recruiter: req.user.id,
        });

        res.status(201).json(job);
    } catch (error) {
        console.error('Create Job Error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter/Admin)
const updateJob = async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Make sure user is job owner or admin
        if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.json(job);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter/Admin)
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Make sure user is job owner or admin
        if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await job.deleteOne();

        res.json({ message: 'Job removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get recommended jobs based on profile
// @route   GET /api/jobs/recommendations
// @access  Private
const getRecommendedJobs = async (req, res) => {
    try {
        const Profile = require('../models/Profile');
        const profile = await Profile.findOne({ user: req.user.id });

        if (!profile || !profile.skills || profile.skills.length === 0) {
            // Fallback to recent jobs if no profile/skills
            const jobs = await Job.find({ isOpen: true }).sort({ createdAt: -1 }).limit(10).populate('recruiter', 'name email');
            return res.json(jobs);
        }

        const skillNames = profile.skills.map(s => s.name);
        // Create Regex for flexible matching (case insensitive)
        const skillRegexes = skillNames.map(name => new RegExp(name, 'i'));

        let jobs = await Job.find({
            isOpen: true,
            $or: [
                { skills: { $in: skillNames } }, // Exact match in skills array
                { skills: { $in: skillRegexes } }, // Regex match in skills array
                { description: { $in: skillRegexes } }, // Mentioned in description
                { requirements: { $in: skillRegexes } }
            ]
        }).populate('recruiter', 'name email').limit(20);

        // Fallback: If no recommendations found, return recent jobs
        if (jobs.length === 0) {
            jobs = await Job.find({ isOpen: true }).sort({ createdAt: -1 }).limit(20).populate('recruiter', 'name email');
        }

        res.json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    getRecommendedJobs
};
