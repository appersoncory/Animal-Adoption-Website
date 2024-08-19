const jwt = require('jsonwebtoken');

function addAuthStatus(req, res, next) {
  const token = req.cookies.token;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (!err && user) {
        req.user = user; // User is authenticated
        res.locals.isAuthenticated = true;
        console.log('User authenticated:', user);
      } else {
        res.locals.isAuthenticated = false;
        console.log('Token verification failed:', err ? err.message : 'No error message');
      }
      next(); // Ensure next() is called inside the verification
    });
  } else {
    res.locals.isAuthenticated = false;
    console.log('No token found, user not authenticated');
    next();
  }
}

module.exports = addAuthStatus;
