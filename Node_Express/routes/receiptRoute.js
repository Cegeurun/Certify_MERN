import express from 'express';
import path from 'path';
import { __dirname } from '../dirname.js';

const route = express.Router();

// Receipt page route
route.get('/receipt', (req, res) => {
    res.sendFile(path.join(__dirname, '/view/frontend/receipt.html'));
});

export default route;
