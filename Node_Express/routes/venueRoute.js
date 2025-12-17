import express from 'express';
import path from 'path';
import { __dirname } from '../dirname.js';

const route = express.Router();

// Sample venues data
const sampleVenues = [
    {
        name: 'MOA Arena',
        location: 'Pasay City, Metro Manila',
        capacity: 15000,
        morning_price: 500000,
        afternoon_price: 750000,
        evening_price: 1000000
    },
    {
        name: 'Philippine Arena',
        location: 'Bocaue, Bulacan',
        capacity: 55000,
        morning_price: 1000000,
        afternoon_price: 1500000,
        evening_price: 2000000
    },
    {
        name: 'Araneta Coliseum',
        location: 'Quezon City, Metro Manila',
        capacity: 25000,
        morning_price: 600000,
        afternoon_price: 900000,
        evening_price: 1200000
    }
];

// Venue page route
route.get('/venue', (req, res) => {
    res.render('venue.html', {
        venues: sampleVenues
    });
});

route.get('/venues', (req, res) => {
    res.render('venue.html', {
        venues: sampleVenues
    });
});

export default route;
