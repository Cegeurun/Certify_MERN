import express from 'express';
import path from 'path';
import { __dirname } from '../dirname.js';
import * as loginModel from '../model/loginModel.js';

const route = express.Router();

// Admin page route
route.get('/admin', async (req, res) => {
    // Basic admin page with placeholder functionality
    const userCount = await loginModel.getUserCount()
    // console.log(`Usercount: ${userCount}`);
    const bookingCount = await loginModel.getBookingsCount();
    const venueCount = await loginModel.getVenueCount();
    res.render('admin.html', {
        username: req.session.user?.username || 'Admin',
        totalUsers: userCount,
        totalBookings: bookingCount,
        activeVenues: venueCount
    });
});

route.get('/admin/find', async (req, res) => {
    // findUsername = req.session.user?.findUser;
    // userBookings = loginModel.getBookingsByUserId(req.session.user?.username);
    const bookings = await loginModel.getBookingsByObjectId(req.session.user?.id);
    const userData = await loginModel.getUserIdByUsername(req.session.user?.findUser);
    const userId = userData._id;
    console.log(`UserID: ${userId}`);
    console.log(userId);
    res.render('adminFindUser.html', {
        username: req.session.user?.username || 'Admin',
        findUser: req.session.user?.findUser || 'User',
        bookings: bookings,
        userData: userData
    });
});

// Find user info endpoint
route.post('/admin/find-user', async (req, res) => {
    const username = req.body.searchQuery;
    if(req.session.user)
    {
        req.session.user.findUser = username;
            console.log(`Searching for user: ${req.session.user?.findUser}`);
    }

    // Placeholder for user search functionality

    res.redirect('/admin/find');
});

export default route;
