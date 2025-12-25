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
    console.log(req.body);

    const user = await loginModel.verifyLogin(req.body.username, req.body.password);

    console.log(user);
    if (user.success == true)
    {
        // Save user data to session
        req.session.user = {
            id: user.id,
            username: user.username,
            agency_name: user.agency_name,
            is_authenticated: true
        };
        
        console.log('User logged in:', user.username);
        res.redirect('/dashboard');
    }
    else
    {
        console.log("wrong password");
        res.redirect('/login');
    }
});

// Register user
route.post('/signup',async (req,res) => {
  console.log(req.body.username);
    console.log(req.body.password);

    console.log(await loginModel.createUser(req.body.agency_name ,req.body.username, req.body.password));

    res.redirect('/login');
});


export default route;
