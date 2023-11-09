// This file contains my middleware. The only middleware I'm using is to check if the user is logged in or out, with authorisation placed on the relevant routes.

// checks if the user is logged in when trying to access a specific page
const isLoggedIn = (req, res, next) => {
  console.log("is logged in", req.session);
  if (!req.session.passport?.user) {
    return res.redirect("/login");
  }
  next();
};

// if an already logged in user tries to access the login page it redirects the user to the home page
const isLoggedOut = (req, res, next) => {
  if (req.session.passport?.user) {
    console.log("not logged out");
    return res.redirect("/");
  }
  next();
};

module.exports = {
  isLoggedIn,
  isLoggedOut,
};
