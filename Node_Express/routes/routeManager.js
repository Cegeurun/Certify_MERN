import express from 'express';
import path from 'path';
import { __dirname } from '../dirname.js';

import baseRouter from './baseRoute.js';
import dashboardRouter from './dashboardRoute.js';
import loginRouter from './loginRoute.js';
import homeRouter from './homeRoute.js';
import profileRouter from './profileRoute.js';
import receiptRouter from './receiptRoute.js';
import venueRouter from './venueRoute.js';
import adminRouter from './adminRoute.js';

const routeManager = express.Router();

// routeManager.use(express.static(path.join(__dirname, "view", "frontend")));

routeManager.use(baseRouter);
routeManager.use(dashboardRouter);
routeManager.use(homeRouter);
routeManager.use(loginRouter);
routeManager.use(profileRouter);
routeManager.use(receiptRouter);
routeManager.use(venueRouter);
routeManager.use(adminRouter);

export default routeManager;
