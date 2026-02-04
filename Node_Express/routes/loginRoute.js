import express from 'express';
import path from 'path';
import { __dirname } from '../dirname.js';
import * as loginModel from '../model/loginModel.js';
import jwt from "jsonwebtoken";

const route = express.Router();
route.use(express.json());
route.use(express.urlencoded({ extended: true }));

route.get('/login', (req, res) => {
    res.render('login.html');
});

route.get('/signup', (req, res) => {
    res.render('signup.html');
});

// Login user
route.post('/login', async (req,res) => {
    const { username, password } = req.body;
    
    // Validate input to prevent path traversal
    if (!username || !password || 
        username.includes('..') || username.includes('/') || username.includes('\\')) {
        return res.status(400).send('Invalid input');
    }

    console.log(req.body);

    const user = await loginModel.verifyLogin(username, password);
    console.log(user);
    if (user.success == true)
    {
        // Save user data to session
        req.session.user = {
            id: user.id,
            username: user.username,
            agency_name: user.agency_name,
            isAdmin: user.isAdmin,
            is_authenticated: true,
            findUser: 'Guest'
        };
        
        console.log('User logged in:', user.username);
        
        // Redirect based on admin status
        if (user.isAdmin === true) {
            res.redirect('/admin');
        } else {
            res.redirect('/dashboard');
        }
    }
    else
    {
        console.log("wrong password");
        res.redirect('/login');
    }
});

// Register user
route.post('/signup',async (req,res) => {
    const { agency_name, username, password } = req.body;
    
    // Validate input to prevent path traversal and format string attacks
    if (!username || !password || !agency_name || 
        username.includes('..') || username.includes('/') || username.includes('\\') ||
        agency_name.includes('..') || agency_name.includes('/') || agency_name.includes('\\')) {
        return res.status(400).send('Invalid input');
    }
    
    // Sanitize inputs to prevent format string attacks
    const sanitize = (input) => {
        if (!input) return '';
        return String(input).replace(/[%]/g, '');
    };
    
    const sanitizedAgency = sanitize(agency_name);
    const sanitizedUsername = sanitize(username);
    const sanitizedPassword = sanitize(password);

    await loginModel.createUser(sanitizedAgency, sanitizedUsername, sanitizedPassword);

    res.redirect('/login');
});


export default route;
