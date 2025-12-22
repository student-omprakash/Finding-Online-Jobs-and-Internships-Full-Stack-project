const Profile = require('../models/Profile');

// @desc    Get current user profile
// @route   GET /api/profile/me
// @access  Private
const getMyProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate(
            'user',
            'name email role'
        );

        if (!profile) {
            return res.status(404).json({ message: 'There is no profile for this user' });
        }

        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create or update user profile
// @route   POST /api/profile
// @access  Private
const createOrUpdateProfile = async (req, res) => {
    const {
        bio,
        skills,
        education,
        experience,
        certifications,
        socials,
        contact,
        resume // Add resume to destructured fields
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (bio) profileFields.bio = bio;
    if (skills) profileFields.skills = skills;
    if (resume) profileFields.resume = resume; // Add resume to profileFields

    // Helper to clean dates
    const cleanDates = (arr) => arr.map(item => {
        const newItem = { ...item };
        if (newItem.from === '') newItem.from = null;
        if (newItem.to === '') newItem.to = null;
        if (newItem.date === '') newItem.date = null;
        return newItem;
    });

    if (education) profileFields.education = cleanDates(education);
    if (experience) profileFields.experience = cleanDates(experience);
    if (certifications) profileFields.certifications = cleanDates(certifications);
    if (socials) profileFields.socials = socials;
    if (contact) profileFields.contact = contact;

    try {
        console.log('Profile Create/Update Body:', JSON.stringify(req.body, null, 2));
        let profile = await Profile.findOne({ user: req.user.id });

        if (profile) {
            // Update
            console.log('Updating existing profile...');
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            );

            return res.json(profile);
        }

        // Create
        console.log('Creating new profile...');
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error('Profile Logic Error:', error.message);
        console.error(error.stack);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

// @desc    Upload resume
// @route   POST /api/profile/resume
// @access  Private
const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const resumePath = `/uploads/${req.file.filename}`;

        const profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { resume: resumePath },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Upload generic file (for certifications etc)
// @route   POST /api/profile/upload-file
// @access  Private
const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const filePath = `/uploads/${req.file.filename}`;
        res.json({ url: filePath });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getMyProfile,
    createOrUpdateProfile,
    uploadResume,
    uploadFile,
};
