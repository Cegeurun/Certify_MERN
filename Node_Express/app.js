import express from 'express';
import nunjucks from 'nunjucks';
import session from 'express-session';
import helmet from 'helmet';
import routeManager from './routes/routeManager.js';
import {connectDB} from './model/loginModel.js';
import path from 'path';
import { __dirname } from './dirname.js';
// import modelManager from './model/modelManager.js';
// import controllerManager from './controller/controllerManager.js';

const app = express();

// Configure Nunjucks
const nunjucksEnv = nunjucks.configure(path.join(__dirname, 'view', 'frontend'), {
    autoescape: true,
    express: app,
    watch: true // Auto-reload templates when they change
});

// Add custom filters for Nunjucks
nunjucksEnv.addFilter('replace', function(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
});

// Add number formatting filter (replaces Python's format)
nunjucksEnv.addFilter('formatNumber', function(num) {
    if (num === undefined || num === null) return '0.00';
    return Number(num).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
});

// Add url_for function (Flask-like routing)
nunjucksEnv.addGlobal('url_for', function(route, options = {}) {
    // Map Flask route names to Express routes
    const routes = {
        'static': (filename) => {
            if (filename.startsWith('css/')) return '/' + filename;
            if (filename.startsWith('js/')) return '/' + filename;
            if (filename.startsWith('images/')) return '/media/' + filename.replace('images/', '');
            if (filename.startsWith('media/')) return '/' + filename;
            return '/' + filename;
        },
        'home': () => '/',
        'dashboard': () => '/dashboard',
        'login': () => '/login',
        'signup': () => '/signup',
        'logout': () => '/logout',
        'profile': () => '/profile',
        'venues': () => '/venues',
        'view_receipt': (booking_id) => `/receipt/${booking_id || options.booking_id}`,
        'cancel_booking': (booking_id) => `/cancel/${booking_id || options.booking_id}`,
        'book': () => '/book'
    };
    
    if (route === 'static' && options.filename) {
        return routes.static(options.filename);
    }
    
    return routes[route] ? routes[route](options.booking_id) : '#';
});

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
            scriptSrcElem: ["'self'", "https://cdn.jsdelivr.net"],
            scriptSrcAttr: ["'none'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            styleSrcElem: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            styleSrcAttr: ["'unsafe-inline'"],
            imgSrc: ["'self'", "data:"],
            fontSrc: ["'self'", "https://cdn.jsdelivr.net"],
            connectSrc: ["'self'"],
            mediaSrc: ["'self'"],
            formAction: ["'self'"],
            frameAncestors: ["'none'"],
            frameSrc: ["'none'"],
            childSrc: ["'self'"],
            workerSrc: ["'self'"],
            manifestSrc: ["'self'"],
            navigateTo: ["'self'"],
            prefetchSrc: ["'self'"],
            baseUri: ["'self'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: []
        }
    }
}));

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sanitize User-Agent header to prevent User-Agent based attacks
app.use((req, res, next) => {
    if (req.headers['user-agent']) {
        const userAgent = req.headers['user-agent'];
        if (userAgent.length > 500 || /[<>'"{}]/.test(userAgent)) {
            return res.status(400).send('Invalid request');
        }
    }
    next();
});

// Session middleware (for user authentication)
app.use(session({
    secret: 'your-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Middleware to pass user data to all templates
app.use((req, res, next) => {
    res.locals.current_user = req.session.user || { is_authenticated: false };
    res.locals.request = req;
    
    // Flash messages support (simple implementation)
    res.locals.flash_messages = req.session.flash_messages || [];
    req.session.flash_messages = []; // Clear flash messages after reading
    
    next();
});

// Load folders
app.use('/css',  express.static(path.join(__dirname, 'view', 'frontend', 'public', 'css')));
app.use('/js',   express.static(path.join(__dirname, 'view', 'frontend', 'public', 'js')));
app.use('/media',  express.static(path.join(__dirname, 'view', 'frontend', 'public', 'media')));
app.use('/userMedia', express.static(path.join(__dirname, 'userMedia')));

console.log(__dirname);

// Load Connection Pool
connectDB;

app.use(routeManager);
// app.use(modelManager);
// app.use(controllerManager);




app.listen(3000, 'localhost');
