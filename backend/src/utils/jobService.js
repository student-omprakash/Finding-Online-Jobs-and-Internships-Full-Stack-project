const Parser = require('rss-parser');
const parser = new Parser();

const WE_WORK_REMOTELY_RSS = 'https://weworkremotely.com/remote-jobs.rss';

/**
 * Fetches jobs from We Work Remotely RSS feed
 * and maps them to our application's Job schema structure.
 */
const fetchExternalJobs = async () => {
    try {
        const feed = await parser.parseURL(WE_WORK_REMOTELY_RSS);

        // Map RSS items to our Job format
        const externalJobs = feed.items.map(item => {
            // Description in RSS is usually HTML, we might want to strip it or keep it.
            // For now, we'll keep a snippet or the full HTML if the frontend supports it.
            // item.contentSnippet is a plain text version provided by rss-parser.

            // Extract type/category if available (WWR puts it in <category>)
            const jobType = item.categories && item.categories.length > 0 ? item.categories[0] : 'Remote';

            return {
                _id: `ext-${item.guid}`, // Unique ID for keying
                title: item.title,
                company: 'External Company', // WWR RSS often puts "Company: Title" in title, need to parse if possible, or use generic.
                // Actually WWR title format is "Role: Company" or just "Role" sometimes.
                // Let's try to extract if there's a colon.
                location: 'Remote',
                type: 'Contract/Full-time', // Default, difficult to infer exact type from simple RSS without deep parsing
                description: item.contentSnippet || item.content,
                salary: 'Competitive', // RSS rarely has salary
                requirements: ['Remote Work', 'Experience in field'], // Placeholder
                postedBy: null, // No local recruiter
                applicants: [],
                createdAt: new Date(item.pubDate),
                isExternal: true, // Flag to identify and treat differently in UI
                externalLink: item.link
            };
        });

        // Better company extraction logic
        return externalJobs.map(job => {
            const parts = job.title.split(': ');
            if (parts.length > 1) {
                // Heuristic: "Company Name: Job Title" is common in some feeds, 
                // but WWR is usually "Job Title: Company Name" or "Job Title"
                // Let's leave it as is for now to avoid bad splitting.
                // Actually, WWR RSS titles are usually "Company Name: Job Title".
                // Let's try to split carefully.
                // Example: "Clevertech: Senior JavaScript Engineer"
                return {
                    ...job,
                    company: parts[0],
                    title: parts.slice(1).join(': ')
                };
            }
            return job;
        });

    } catch (error) {
        console.error("Error fetching external jobs:", error.message);
        return []; // Return empty array so we don't break the local listings
    }
};

module.exports = { fetchExternalJobs };
