import express from 'express';
import path from 'path';
import { __dirname } from '../dirname.js';

const route = express.Router();

// Home page route
route.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/view/frontend/home.html'));
});

route.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '/view/frontend/home.html'));
});

export default route;
