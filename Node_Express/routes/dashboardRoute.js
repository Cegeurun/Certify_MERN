import express from 'express';
import path from 'path';
import { __dirname } from '../dirname.js';
import * as loginModel from '../model/loginModel.js';

const route = express.Router();

// Sample venues data for dashboard
const sampleVenues = [
    { name: 'MOA Arena', location: 'Pasay City', capacity: 15000 },
    { name: 'Philippine Arena', location: 'Bocaue, Bulacan', capacity: 55000 },
    { name: 'Araneta Coliseum', location: 'Quezon City', capacity: 25000 }
];

// Sample bookings data
// const bookings = await loginModel.getBookingsByObjectId(req.session.user?.id);

route.get('/dashboard', async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const bookings = await loginModel.getBookingsByObjectId(req.session.user?.id);
    console.log(`SessionId: ${req.session.user?.id}`);
    // sampleBookings = loginModel.getBookingsByUserId(req.session.userId);
    // sampleBookings = [];
    console.log();
    res.render('dashboard.html', {
        username: req.session.user?.username || 'Guest',
        agency_name: req.session.user?.agency_name || 'Demo Agency',
        venues: sampleVenues,
        bookings: bookings,
        today: today
    });
});

route.post("/book", async (req, res) => {
        console.log(`Venue: ${req.body.venue}`)
        console.log(await loginModel.createBooking(req.session.user?.id, req.body.venue, req.body.artist_name, req.body.concert_title, req.body.date, req.body.time_slot, req.body.amount_expected, req.body.status, req.body.receipt_id));
        
        res.redirect('/dashboard');
})

export default route;
