import express from 'express';
import path from 'path';
import { __dirname } from '../dirname.js';
import * as loginModel from '../model/loginModel.js';

const route = express.Router();

// Middleware to check if user is admin
function checkAdmin(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    
    if (req.session.user.isAdmin !== true) {
        return res.status(403).render('accessDenied.html', {
            username: req.session.user.username
        });
    }
    
    next();
}

// Apply admin middleware to all admin routes
route.use(checkAdmin);

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

// Manage Venues page
route.get('/admin/venues', async (req, res) => {
    const venues = await loginModel.getAllVenues();
    res.render('adminVenues.html', {
        username: req.session.user?.username || 'Admin',
        venues: venues
    });
});

// Update venue field endpoint
route.post('/admin/update-venue', async (req, res) => {
    const { venueId, fieldName, fieldValue } = req.body;
    await loginModel.updateVenueField(venueId, fieldName, fieldValue);
    res.json({ success: true });
});

// View All Bookings page
route.get('/admin/bookings', async (req, res) => {
    const bookings = await loginModel.getAllBookings();
    res.render('adminBookings.html', {
        username: req.session.user?.username || 'Admin',
        bookings: bookings
    });
});

// User Management page
route.get('/admin/users', async (req, res) => {
    const users = await loginModel.getAllUsers();
    res.render('adminUsers.html', {
        username: req.session.user?.username || 'Admin',
        users: users
    });
});

// Delete user endpoint
route.post('/admin/delete-user/:userId', async (req, res) => {
    await loginModel.deleteUserById(req.params.userId);
    res.redirect('/admin/users');
});

// System Settings page
route.get('/admin/settings', async (req, res) => {
    res.render('adminSettings.html', {
        username: req.session.user?.username || 'Admin',
        nodeVersion: process.version
    });
});

export default route;
