import express from 'express';
import { fetchCollegesFromAPI, getFilteredColleges } from '../controllers/collegeController.js';

const router = express.Router();

// Route to fetch colleges from external API
router.get('/fetch', fetchCollegesFromAPI);

// Route to get filtered colleges based on GPA and credits completed
router.get('/filter', getFilteredColleges);

export default router;
