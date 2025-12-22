const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        bio: {
            type: String,
        },
        skills: [
            {
                name: { type: String, required: true },
                level: { type: String, enum: ['Beginner', 'Intermediate', 'Expert'], default: 'Intermediate' },
                description: { type: String }
            }
        ],
        contact: {
            phone: { type: String },
            address: { type: String },
            city: { type: String },
            state: { type: String },
            country: { type: String },
            zip: { type: String }
        },
        education: [
            {
                school: { type: String, required: true },
                degree: { type: String, required: true },
                fieldOfStudy: { type: String },
                from: { type: Date },
                to: { type: Date },
                current: { type: Boolean, default: false },
                description: { type: String }
            }
        ],
        experience: [
            {
                title: { type: String, required: true },
                company: { type: String, required: true },
                location: { type: String },
                from: { type: Date },
                to: { type: Date },
                current: { type: Boolean, default: false },
                description: { type: String }
            }
        ],
        certifications: [
            {
                name: { type: String, required: true },
                issuer: { type: String, required: true },
                date: { type: Date },
                url: { type: String },
                description: { type: String }
            }
        ],
        resume: {
            type: String, // Path to file
        },
        socials: {
            linkedin: { type: String },
            github: { type: String },
            website: { type: String },
            twitter: { type: String }
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Profile', profileSchema);
