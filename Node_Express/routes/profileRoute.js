import express from 'express';
import path from 'path';
import { __dirname } from '../dirname.js';

const route = express.Router();

// Profile page route
route.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '/view/frontend/profile.html'));
});

export default route;
