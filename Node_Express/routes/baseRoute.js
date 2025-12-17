import express from 'express';
import path from 'path';
import { __dirname } from '../dirname.js';

const route = express.Router();

// Logout route
route.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log('Error destroying session:', err);
        }
        res.redirect('/');
    });
});

export default route;
