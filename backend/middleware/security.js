const helmet = require('helmet');

const securityMiddleware = (app) => {
    // Remove X-Powered-By header
    app.disable('x-powered-by');

    // Basic security headers with helmet
    app.use(helmet());

    // Custom CSP settings with frame-ancestors directive
    app.use(
        helmet.contentSecurityPolicy({
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    "'unsafe-eval'",
                    "https://www.googletagmanager.com",
                    "https://*.firebase.google.com",
                    "https://*.firebaseio.com",
                    "https://*.firebaseapp.com",
                    "https://*.emailjs.com",
                    "https://cdn.jsdelivr.net",
                    "https://js.stripe.com",
                    "https://maps.googleapis.com"
                ],
                styleSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    "https://fonts.googleapis.com",
                    "https://cdn.jsdelivr.net"
                ],
                imgSrc: [
                    "'self'",
                    "data:",
                    "https:",
                    "blob:",
                    "https://*.cloudinary.com",
                    "https://res.cloudinary.com"
                ],
                connectSrc: [
                    "'self'",
                    "http://localhost:5000",
                    "https://rahala.onrender.com",
                    "https://*.firebase.google.com",
                    "https://*.firebaseio.com",
                    "https://*.firebaseapp.com",
                    "https://*.google-analytics.com",
                    "https://*.googleapis.com",
                    "wss://*.firebaseio.com",
                    "https://api.emailjs.com",
                    "https://api.cloudinary.com",
                    "https://*.stripe.com",
                    "https://maps.googleapis.com"
                ],
                fontSrc: [
                    "'self'",
                    "data:",
                    "https://fonts.gstatic.com",
                    "https://cdn.jsdelivr.net"
                ],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'", "https://*.cloudinary.com"],
                frameAncestors: ["'none'"],
                formAction: ["'self'"],
                baseUri: ["'self'"],
                workerSrc: ["'self'", "blob:"],
                frameSrc: [
                    "'self'",
                    "https://*.stripe.com",
                    "https://*.google.com"
                ],
                upgradeInsecureRequests: []
            },
        })
    );

    // Custom CORS settings
    app.use((req, res, next) => {
        // Set strict CORS origin
        const allowedOrigins = ['http://localhost:3000', 'https://rahala.netlify.app'];
        const origin = req.headers.origin;
        if (allowedOrigins.includes(origin)) {
            res.header('Access-Control-Allow-Origin', origin);
        }

        // Other security headers
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.header('X-Content-Type-Options', 'nosniff');
        res.header('X-Frame-Options', 'DENY');
        res.header('X-XSS-Protection', '1; mode=block');
        res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
        res.header('Permissions-Policy', 
            'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()'
        );
        
        // Cache control for static assets
        if (req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico)$/)) {
            res.header('Cache-Control', 'public, max-age=31536000'); // 1 year
        } else {
            res.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            res.header('Pragma', 'no-cache');
            res.header('Expires', '0');
        }

        // Handle preflight requests
        if (req.method === 'OPTIONS') {
            res.sendStatus(200);
        } else {
            next();
        }
    });
};

module.exports = securityMiddleware;
