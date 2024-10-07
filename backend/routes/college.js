import express from 'express';
import { fetchCollegesFromAPI } from '../controllers/collegeController.js';

const router = express.Router();

// Route to fetch colleges from external API
router.get('/fetch', fetchCollegesFromAPI);

export default router;
