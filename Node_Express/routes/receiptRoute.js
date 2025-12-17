import express from 'express';
import path from 'path';
import { __dirname } from '../dirname.js';

const route = express.Router();

// Receipt page route
route.get('/receipt', (req, res) => {
    res.render('receipt.html');
});

route.get('/receipt/:booking_id', (req, res) => {
    res.render('receipt.html', {
        booking_id: req.params.booking_id
    });
});

export default route;
