import express from 'express';
import path from 'path';
import { __dirname } from '../dirname.js';
import * as loginModel from '../model/loginModel.js';

const route = express.Router();

// Profile page route
// route.get('/profile', (req, res) => {
//     res.render('profile.html', {
//         user: req.session.user || {
//             username: 'Guest',
//             email: 'guest@example.com',
//             agency_name: 'Demo Agency',
//             contact_number: 'N/A'
//         }
//     });
// });

route.get('/profile', async (req, res) => {
    console.log(`testing ${req.session.user?.id}`)
    res.render('profile.html', {
        username: req.session.user?.username || 'Guest',
        userId: req.session.user?._id, 
    });
});

route.post('/profile/update_username', async (req, res) => {
    const newUsername = req.body.new_username;
    const userId = req.session.user?.id;
    
    // Validate input to prevent path traversal
    if (!newUsername || newUsername.includes('..') || newUsername.includes('/') || newUsername.includes('\\')) {
        return res.status(400).send('Invalid username');
    }
    
    console.log(`${userId} - ${newUsername}`);
    if (userId && newUsername) {

        await loginModel.updateUsernameByUserId(userId, newUsername);
        req.session.user.username = newUsername;
    }
    res.redirect('/profile');
});

route.post('/profile/update_password', async (req, res) => {
    const newPassword = req.body.new_password;
    const userId = req.session.user?.id;
    console.log(`${userId} - ${newPassword}`);
    if (userId && newPassword) {
        await loginModel.updatePasswordByUserId(userId, newPassword);
        req.session.user.password = newPassword;
    }
    res.redirect('/profile');
});

export default route;
