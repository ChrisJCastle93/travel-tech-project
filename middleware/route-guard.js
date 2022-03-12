// middleware/route-guard.js

// checks if the user is logged in when trying to access a specific page
const isLoggedIn = (req, res, next) => {
  console.log('== isLoggedIn - REQ.SESSION.CURRENTUSER ==>', req.session.currentUser);
  if (!req.session.currentUser) {
    return res.redirect('/login');
  }
  next();
};

// if an already logged in user tries to access the login page it redirects the user to the home page
const isLoggedOut = (req, res, next) => {
  console.log('== isLoggedOut - REQ.SESSION.CURRENTUSER ==>', req.session.currentUser);
  if (req.session.currentUser) {
    console.log('not logged out')
    return res.redirect('/');
  }
  next();
};

module.exports = {
  isLoggedIn,
  isLoggedOut
};