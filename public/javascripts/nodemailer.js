require("dotenv").config();
const nodemailer = require('nodemailer');

const nodemailerSetup = async () => {
  let transporter = await nodemailer.createTransport({
    service: "Gmail", // can switch for 'hotmail'
    auth: {
      user: "chrisjcastle93@gmail.com",
      pass: process.env.GMAIL_PASS,
    },
  });
  return transporter;
};

module.exports = nodemailerSetup;
