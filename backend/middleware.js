const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt || req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No authentication token, authorization denied' });
    }
    
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get reference to in-memory users map from the main app
    const { inMemoryUsers, useInMemoryStore } = req.app.locals;
    
    if (useInMemoryStore) {
      // For in-memory mode
      const user = inMemoryUsers.get(verified.email);
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
      req.user = user;
      next();
    } else {
      // For MongoDB mode
      try {
        // Dynamically import User model only when using MongoDB
        const User = require('./models/userModel');
        const user = await User.findOne({ email: verified.email });
        
        if (!user) {
          return res.status(401).json({ error: 'User not found' });
        }
        
        req.user = user;
        next();
      } catch (err) {
        console.error('Error accessing MongoDB in middleware:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

module.exports = auth;