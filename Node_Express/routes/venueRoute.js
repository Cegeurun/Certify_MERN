import express from 'express';
import path from 'path';
import { __dirname } from '../dirname.js';

const route = express.Router();

// Venue page route
route.get('/venue', (req, res) => {
    res.sendFile(path.join(__dirname, '/view/frontend/venue.html'));
});

export default route;
