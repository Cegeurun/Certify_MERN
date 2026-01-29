import express from 'express';
import path from 'path';
import { __dirname } from '../dirname.js';
import * as loginModel from '../model/loginModel.js';


const route = express.Router();

// Sample venue data (replace with database queries later)
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

// Sample events data (replace with database queries later)
const sampleEvents = [
    {
        venue: { name: 'MOA Arena' },
        concert_title: 'Summer Concert 2024',
        artist_name: 'Taylor Swift',
        user: { agency_name: 'Live Nation' },
        date: '2024-06-15',
        time_slot: 'Evening'
    },
    {
        venue: { name: 'Philippine Arena' },
        concert_title: 'Rock Festival',
        artist_name: 'Coldplay',
        user: { agency_name: 'Wilbros Live' },
        date: '2024-07-20',
        time_slot: 'Evening'
    }
];

// Home page route
route.get('/',async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const bookings = await loginModel.getBookingsByObjectId(req.session.user?.id);
    const venues = await loginModel.getAllVenues();

    res.render('home.html', {
        venues: venues,
        events: sampleEvents,
        bookings: bookings,
        agency_name: req.session.user?.agency_name,
        today: today
    });
});

route.get('/home', async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const bookings = await loginModel.getBookingsByObjectId(req.session.user?.id);
    const venues = await loginModel.getAllVenues();

    res.render('home.html', {
        venues: venues,
        events: sampleEvents,
        bookings: bookings,
        agency_name: req.session.user?.agency_name,
        today: today
    });
});

export default route;
