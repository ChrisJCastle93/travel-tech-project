const express = require('express');
const Company = require('../models/company');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index', { user: req.user });
});



module.exports = router;
