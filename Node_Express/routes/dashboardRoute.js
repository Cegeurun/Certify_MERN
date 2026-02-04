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


route.post("/cancel/:bookingId", async (req, res) => {
    console.log(`Bookingid: ${req.params.bookingId}`)
        await loginModel.removeBookingByObjectId(req.params.bookingId);
        res.redirect('/dashboard');
})

route.post("/book", async (req, res) => {
    const { venue, artist_name, concert_title, date, time_slot, payment_method } = req.body;
    
    // Sanitize inputs to prevent format string attacks
    const sanitize = (input) => {
        if (!input) return '';
        return String(input).replace(/[%]/g, '');
    };
    
    const sanitizedVenue = sanitize(venue);
    const sanitizedArtist = sanitize(artist_name);
    const sanitizedTitle = sanitize(concert_title);
    const sanitizedDate = sanitize(date);
    const sanitizedTimeSlot = sanitize(time_slot);
    const sanitizedPaymentMethod = sanitize(payment_method);
    
    const bookingResult = await loginModel.createBooking(req.session.user?.id, sanitizedVenue, sanitizedArtist, sanitizedTitle, sanitizedDate, sanitizedTimeSlot, req.body.amount_expected, req.body.status, req.body.receipt_id);
    
    // Create transaction using the booking ID
    const venueData = await loginModel.getVenuesByName(sanitizedVenue);
    let amountPaid = 0;
    if (sanitizedTimeSlot === 'Morning') {
        amountPaid = venueData.morning_price;
    } else if (sanitizedTimeSlot === 'Afternoon') {
        amountPaid = venueData.afternoon_price;
    } else if (sanitizedTimeSlot === 'Evening') {
        amountPaid = venueData.evening_price;
    }
    
    await loginModel.createTransaction(bookingResult.insertedId, sanitizedPaymentMethod, amountPaid);
    
    res.redirect('/dashboard');
})

// `/cancel/${booking_id || options.booking_id}`

export default route;
