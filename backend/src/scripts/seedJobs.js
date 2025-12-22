const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('../models/Job');
const User = require('../models/User');

dotenv.config();

const jobs = [
    // --- Full Time Jobs ---

    // Bangalore (Tech Hub)
    {
        title: "Senior Software Engineer (Backend)",
        company: "Swiggy",
        location: "Bangalore, Karnataka, India",
        type: "Full-time",
        experienceLevel: "3-5 years",
        salary: "25-40 LPA",
        description: "Scale our high-throughput backend systems. Check for availability of items in real-time. Golang/Java experience preferred.",
        requirements: ["Java", "Golang", "Distributed Systems", "AWS"],
        skills: ["Backend", "Scalability", "System Design"],
        postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Product Designer",
        company: "Cred",
        location: "Bangalore, Karnataka, India",
        type: "Full-time",
        experienceLevel: "2-4 years",
        salary: "20-30 LPA",
        description: "Craft beautiful and rewarding experiences for Cred members. Strong portfolio in UI/UX required.",
        requirements: ["Figma", "Prototyping", "Visual Design"],
        skills: ["UI/UX", "Product Design", "Figma"],
        postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Data Scientist",
        company: "Flipkart",
        location: "Bangalore, Karnataka, India",
        type: "Full-time",
        experienceLevel: "3+ years",
        salary: "30-50 LPA",
        description: "Build recommendation engines and optimize supply chain using ML models.",
        requirements: ["Python", "TensorFlow", "SQL", "Machine Learning"],
        skills: ["Data Science", "Machine Learning", "Python"],
        postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },

    // Mumbai (Finance & Ent)
    {
        title: "Investment Banking Analyst",
        company: "HDFC Bank",
        location: "Mumbai, Maharashtra, India",
        type: "Full-time",
        experienceLevel: "0-2 years",
        salary: "12-18 LPA",
        description: "Analyze financial data and assist in deal structuring. Great opportunity for finance graduates.",
        requirements: ["MBA Finance", "Excel", "Financial Modeling"],
        skills: ["Finance", "Banking", "Analysis"],
        postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Marketing Manager",
        company: "BookMyShow",
        location: "Mumbai, Maharashtra, India",
        type: "Full-time",
        experienceLevel: "4-6 years",
        salary: "15-22 LPA",
        description: "Lead marketing campaigns for major events and movie launches.",
        requirements: ["Digital Marketing", "Campaign Management", "SEO/SEM"],
        skills: ["Marketing", "Brand Management", "Social Media"],
        postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },

    // Delhi NCR (Corporate & Startups)
    {
        title: "Frontend Developer (React)",
        company: "Zomato",
        location: "Gurgaon, Haryana, India",
        type: "Full-time",
        experienceLevel: "1-3 years",
        salary: "12-20 LPA",
        description: "Build pixel-perfect UI for Zomato's food delivery app website.",
        requirements: ["React.js", "Redux", "JavaScript", "HTML/CSS"],
        skills: ["Frontend", "React", "Web Development"],
        postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Operations Manager",
        company: "Delhivery",
        location: "Gurgaon, Haryana, India",
        type: "Full-time",
        experienceLevel: "2-5 years",
        salary: "10-15 LPA",
        description: "Optimize logistics and supply chain operations for last-mile delivery.",
        requirements: ["Supply Chain", "Logistics", "Team Management"],
        skills: ["Operations", "Logistics", "Management"],
        postedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Android Developer",
        company: "Paytm",
        location: "Noida, UP, India",
        type: "Full-time",
        experienceLevel: "2-4 years",
        salary: "18-28 LPA",
        description: "Develop secure and fast payment features for the Paytm Android app.",
        requirements: ["Kotlin", "Android SDK", "Java"],
        skills: ["Android", "Mobile Dev", "Kotlin"],
        postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },

    // Hyderabad & Chennai
    {
        title: "Cloud Support Engineer",
        company: "Microsoft",
        location: "Hyderabad, Telangana, India",
        type: "Full-time",
        experienceLevel: "1-3 years",
        salary: "15-25 LPA",
        description: "Support enterprise customers in deploying and managing Azure solutions.",
        requirements: ["Azure", "Networking", "Linux/Windows"],
        skills: ["Cloud", "Azure", "Support"],
        postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Systems Engineer",
        company: "TCS",
        location: "Chennai, Tamil Nadu, India",
        type: "Full-time",
        experienceLevel: "0-2 years",
        salary: "4-7 LPA",
        description: "Entry-level role for fresh graduates to work on global IT projects.",
        requirements: ["B.Tech CS/IT", "Java/C++ Basics", "Communication"],
        skills: ["Java", "SQL", "Communication"],
        postedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
    },

    // Pune & Kolkata
    {
        title: "Automotive Software Engineer",
        company: "Tata Motors",
        location: "Pune, Maharashtra, India",
        type: "Full-time",
        experienceLevel: "3-6 years",
        salary: "12-20 LPA",
        description: "Develop embedded software for electric vehicles.",
        requirements: ["Embedded C", "Matlab", "Control Systems"],
        skills: ["Embedded", "Automotive", "C"],
        postedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Business Analyst",
        company: "ITC Infotech",
        location: "Kolkata, West Bengal, India",
        type: "Full-time",
        experienceLevel: "2-4 years",
        salary: "8-14 LPA",
        description: "Bridge the gap between IT and business teams.",
        requirements: ["Requirements Gathering", "Documentation", "Agile"],
        skills: ["Analysis", "Agile", "Communication"],
        postedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    },

    // --- Internships ---

    {
        title: "SDE Intern",
        company: "Amazon",
        location: "Bangalore, Karnataka, India",
        type: "Internship",
        experienceLevel: "Student",
        salary: "₹80,000 / month",
        description: "6-month internship for final year students. Chance to get PPO.",
        requirements: ["DSA", "Java/C++", "Problem Solving"],
        skills: ["Software Engineering", "DSA", "Java"],
        postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Marketing Intern",
        company: "Nykaa",
        location: "Mumbai, Maharashtra, India",
        type: "Internship",
        experienceLevel: "Student",
        salary: "₹15,000 / month",
        description: "Assist with social media content and influencer marketing.",
        requirements: ["Social Media", "Creativity", "Communication"],
        skills: ["Marketing", "Social Media", "Content"],
        postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Graphic Design Intern",
        company: "Zomato",
        location: "Gurgaon, Haryana, India",
        type: "Internship",
        experienceLevel: "Student",
        salary: "₹20,000 / month",
        description: "Design quirky social media posts for Zomato.",
        requirements: ["Photoshop", "Illustrator", "Portfolio"],
        skills: ["Design", "Adobe Suite", "Creativity"],
        postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Research Intern (AI)",
        company: "IIIT Hyderabad",
        location: "Hyderabad, Telangana, India",
        type: "Internship",
        experienceLevel: "Student",
        salary: "₹10,000 / month",
        description: "Summer research internship in Computer Vision lab.",
        requirements: ["Python", "PyTorch", "Computer Vision Basics"],
        skills: ["AI", "Research", "Computer Vision"],
        postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
        title: "HR Intern",
        company: "Tata Steel",
        location: "Jamshedpur/Kolkata, India",
        type: "Internship",
        experienceLevel: "Student",
        salary: "₹12,000 / month",
        description: "Assist with recruitment drives and employee engagement.",
        requirements: ["HR Management", "Communication", "MS Office"],
        skills: ["HR", "Recruitment", "Management"],
        postedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Finance Intern",
        company: "KPMG",
        location: "Bangalore, Karnataka, India",
        type: "Internship",
        experienceLevel: "Student",
        salary: "₹20,000 / month",
        description: "Support audit and risk advisory teams.",
        requirements: ["B.Com/BBA", "Accounting Basics", "Excel"],
        skills: ["Finance", "Accounting", "Audit"],
        postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
        title: "Content Writer Intern",
        company: "Inshorts",
        location: "Noida, UP, India",
        type: "Internship",
        experienceLevel: "Student",
        salary: "₹10,000 / month",
        description: "Write concise 60-word news summaries.",
        requirements: ["English Proficiency", "Writing", "General Awareness"],
        skills: ["Writing", "Content", "Journalism"],
        postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
    },
    {
        title: "IoT Intern",
        company: "Bosch",
        location: "Bangalore, Karnataka, India",
        type: "Internship",
        experienceLevel: "Student",
        salary: "₹25,000 / month",
        description: "Work on connected mobility solutions.",
        requirements: ["IoT", "Embedded C", "Sensors"],
        skills: ["IoT", "Embedded", "Engineering"],
        postedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Find a recruiter user to assign jobs to
        // If no recruiter exists, create a dummy one or use the first user found
        let recruiter = await User.findOne({ role: 'recruiter' });

        if (!recruiter) {
            console.log('No recruiter found, checking for any user...');
            recruiter = await User.findOne();
            if (!recruiter) {
                console.log('No users found. Creating a dummy recruiter...');
                const hashedPassword = await require('bcryptjs').hash('123456', 10);
                recruiter = await User.create({
                    name: 'Recruiter Admin',
                    email: 'admin@recruiter.com',
                    password: hashedPassword,
                    role: 'recruiter'
                });
            }
        }

        console.log(`Assigning jobs to Recruiter: ${recruiter.name} (${recruiter._id})`);

        // Clear existing jobs
        await Job.deleteMany();
        console.log('Jobs collection cleared');

        const jobsWithRecruiter = jobs.map(job => ({
            ...job,
            recruiter: recruiter._id,
            isOpen: true
        }));

        await Job.insertMany(jobsWithRecruiter);
        console.log('Jobs seeded successfully');

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedDB();
