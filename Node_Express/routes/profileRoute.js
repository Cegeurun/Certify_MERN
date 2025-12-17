import express from 'express';
import path from 'path';
import { __dirname } from '../dirname.js';

const route = express.Router();

// Profile page route
route.get('/profile', (req, res) => {
    res.render('profile.html', {
        user: req.session.user || {
            username: 'Guest',
            email: 'guest@example.com',
            agency_name: 'Demo Agency',
            contact_number: 'N/A'
        }
    });
});

export default route;
