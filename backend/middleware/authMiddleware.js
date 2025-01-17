const admin = require('../config/firebaseAdmin');
const AuthUser = require('../models/AuthUser'); // Your AuthUser model

// Middleware to verify token
async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Attach user info to request
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
}

// Middleware to check if the user is a regular user
async function checkUser(req, res, next) {
  try {
    const authUser = await AuthUser.findOne({ email: req.user.email });
    if (!authUser || authUser.userType !== 'user') {
      return res.status(403).json({ message: 'Forbidden: User access required' });
    }

    next(); // User is authorized
  } catch (error) {
    console.error('Authorization error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Middleware to check if the user is an agency
async function checkAgency(req, res, next) {
  try {
    const authUser = await AuthUser.findOne({ email: req.user.email });

    if (!authUser || authUser.userType !== 'agency') {
      return res.status(403).json({ message: 'Forbidden: Agency access required' });
    }

    next(); // Agency is authorized
  } catch (error) {
    console.error('Authorization error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Middleware to check if the user is an admin
async function checkAdmin(req, res, next) {
    try {
      const authUser = await AuthUser.findOne({ email: req.user.email });
  
      if (!authUser || authUser.userType !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admin access required' });
      }
  
      next(); // User is an admin, proceed
    } catch (error) {
      console.error('Authorization error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
    

module.exports = { verifyToken, checkUser, checkAgency, checkAdmin };
