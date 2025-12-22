const axios = require('axios');

const BASE_URL = 'http://localhost:5005/api';

const testUser = {
    name: 'Test Student',
    email: `teststudent_${Date.now()}@example.com`,
    password: 'password123',
    role: 'student'
};

async function run() {
    try {
        console.log('1. Registering User...');
        let token;
        try {
            const regRes = await axios.post(`${BASE_URL}/auth/register`, testUser);
            token = regRes.data.token;
            console.log('   Registration successful. Token:', token);
        } catch (err) {
            console.log('   Registration failed:', err.response ? err.response.data : err.message);
            // Try login if already exists (though email is unique with timestamp, so unlikely)
            return;
        }

        console.log('\n2. Fetching Jobs...');
        const jobsRes = await axios.get(`${BASE_URL}/jobs`);
        const jobs = jobsRes.data;
        console.log(`   Found ${jobs.length} jobs.`);

        if (jobs.length === 0) {
            console.log('   No jobs found to apply to. Aborting.');
            return;
        }

        const jobId = jobs[0]._id;
        console.log(`   Targeting Job ID: ${jobId}`);

        console.log('\n3. Applying for Job...');
        try {
            const applyRes = await axios.post(
                `${BASE_URL}/applications/${jobId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log('   Application Successful:', applyRes.data);
        } catch (err) {
            console.error('   Application Failed:');
            console.error('   Status:', err.response ? err.response.status : 'No response');
            console.error('   Data:', err.response ? err.response.data : err.message);
        }

    } catch (error) {
        console.error('Unexpected Error:', error.message);
    }
}

run();
