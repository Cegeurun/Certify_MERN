import express from 'express';
import path from 'path';
import { __dirname } from '../dirname.js';

const route = express.Router();

// Sample venues data for dashboard
const sampleVenues = [
    { name: 'MOA Arena', location: 'Pasay City', capacity: 15000 },
    { name: 'Philippine Arena', location: 'Bocaue, Bulacan', capacity: 55000 },
    { name: 'Araneta Coliseum', location: 'Quezon City', capacity: 25000 }
];

// Sample bookings data
const sampleBookings = [];

route.get('/dashboard', (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    
    res.render('dashboard.html', {
        username: req.session.user?.username || 'Guest',
        agency_name: req.session.user?.agency_name || 'Demo Agency',
        venues: sampleVenues,
        bookings: sampleBookings,
        today: today
    });
});

export default route;
