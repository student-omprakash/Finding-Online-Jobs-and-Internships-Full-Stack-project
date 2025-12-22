const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a job title'],
            trim: true
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        company: {
            type: String,
            required: [true, 'Please add a company name'],
        },
        location: {
            type: String,
            required: [true, 'Please add a location (or Remote)'],
        },
        type: {
            type: String,
            enum: ['Internship', 'Full-time', 'Part-time', 'Contract'],
            default: 'Internship',
        },
        salary: {
            type: String, // Can be range "10k-20k"
        },
        requirements: {
            type: [String],
        },
        experienceLevel: {
            type: String, // e.g., "0-2 years", "3-5 years"
            required: [true, 'Please add experience level']
        },
        skills: {
            type: [String], // e.g., ["React", "Node.js"]
        },
        recruiter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        isOpen: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Job', jobSchema);
