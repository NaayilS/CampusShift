import axios from 'axios';
import College from '../models/College.js';

// Function to fetch colleges from external API
export const fetchCollegesFromAPI = async (req, res) => {
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
                    gpaRequirement: Math.random() * (4 - 2) + 2,
                    creditsAccepted: Math.floor(Math.random() * 120),
                    tuition: college.latest.cost.tuition.in_state,
                    deadline: admissionDeadline || null,
                    financialAidAvailable: college.latest.aid.pell_grant_rate > 0
                });

                await newCollege.save();
            }
        }

        res.status(200).json({ message: 'Colleges fetched and saved successfully' });

    } catch (err) {
        console.error('Error fetching colleges:', err.message);
        res.status(500).json({ error: 'Error fetching colleges from external API' });
    }
};

// Function to filter colleges based on GPA and credits
export const getFilteredColleges = async (req, res) => {
    const { gpa, credits } = req.query;

    try {
        const filteredColleges = await College.find({
            gpaRequirement: { $lte: gpa },
            creditsAccepted: { $lte: credits }
        });

        if (filteredColleges.length === 0) {
            return res.status(404).json({ message: 'No transfer-friendly colleges found matching your criteria.' });
        }

        res.status(200).json(filteredColleges);

    } catch (err) {
        console.error('Error fetching filtered colleges:', err.message);
        res.status(500).json({ error: 'Error fetching filtered colleges' });
    }
};
