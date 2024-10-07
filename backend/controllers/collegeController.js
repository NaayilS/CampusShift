import axios from 'axios'; // Make sure axios is imported
import College from '../models/College.js';

export const fetchCollegesFromAPI = async (req, res, next) => {
    try {
        const apiUrl = 'https://api.data.gov/ed/collegescorecard/v1/schools.json';
        const apiKey = process.env.COLLEGE_API_KEY;

        const response = await axios.get(`${apiUrl}?api_key=${apiKey}&per_page=10`);
        const collegesData = response.data.results;

        for (let college of collegesData) {
            const collegeExists = await College.findOne({ name: college.school.name });
            
            if (!collegeExists) {
                const admissionDeadline = college.latest.admissions ? college.latest.admissions.admission_date : null;

                const newCollege = new College({
                    name: college.school.name,
                    location: `${college.school.city}, ${college.school.state}`,
                    gpaRequirement: Math.random() * (4 - 2) + 2, // Placeholder GPA value
                    creditsAccepted: Math.floor(Math.random() * 120), // Placeholder credits value
                    tuition: college.latest.cost.tuition.in_state,
                    deadline: admissionDeadline || null, // Use null if no deadline is found
                    financialAidAvailable: college.latest.aid.pell_grant_rate > 0
                });

                await newCollege.save();
            }
        }

        res.status(200).json({ message: 'Colleges fetched and saved successfully' });

    } catch (err) {
        console.error('Error fetching colleges:', err.response ? err.response.data : err.message);
        res.status(500).json({ error: 'Error fetching colleges from external API' });
    }
};
