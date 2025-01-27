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
                scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "https:"],
                connectSrc: ["'self'", "http://localhost:5000", "https://rahala.onrender.com"],
                fontSrc: ["'self'", "data:"],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'"],
                frameAncestors: ["'none'"], // Strict anti-clickjacking
                formAction: ["'self'"],
                baseUri: ["'self'"],
                upgradeInsecureRequests: [],
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
