import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';


const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    const { name, email, password, creditsCompleted, currentGPA } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create a new user
        user = new User({ name, email, password, creditsCompleted, currentGPA });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user to the database
        await user.save();

        // Generate JWT
        const payload = {
            user: {
                id: user.id
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        // Respond with the token and success status
        res.status(201).json({ token });

    } catch (err) {
        console.error(err.message);
        // Send server error response
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const payload = {
            user: {
                id: user.id
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        // Respond with the token
        res.status(200).json({ token });

    } catch (err) {
        console.error(err.message);
        // Send server error response
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

export default router;
