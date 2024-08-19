const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.cookies.token; // Assuming the token is stored in cookies

  if (!token) {
    return res.redirect('/login'); // Redirect to login if no token is found
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.redirect('/login'); // Redirect to login if token verification fails
    }
    req.user = user; // Store the user data in the request object
    next(); // Proceed to the next middleware or route handler
  });
}

module.exports = authenticateToken;
