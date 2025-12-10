import express from 'express';
import path from 'path';
import { __dirname } from '../dirname.js';
import * as loginModel from '../model/loginModel.js';
import jwt from "jsonwebtoken";

const route = express.Router();
route.use(express.json());
route.use(express.urlencoded({ extended: true }));

route.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/view/frontend/index.html'));
});

route.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '/view/frontend/signup.html'));
});

// Login user
route.post('/login', async (req,res) => {
    console.log(req.body);


    const user =  await loginModel.verifyLogin(req.body.email, req.body.password);
    if (user.success == true)
    {
        res.json({"id": user.id});
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

    console.log(await loginModel.createUser(req.body.username, req.body.password, req.body.email));
    
    res.redirect('/login');
});


export default route;
