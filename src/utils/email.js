const nodemailer = require('nodemailer');
const { sendGridApiKey, sendGridEmail } = require('../config/config');
const AppError = require('./appError');

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  auth: {
    user: 'apikey', // always this value
    pass: sendGridApiKey // your API key
  }
});

const sendEmail = async ({ to, subject, text, html }) => {
  const info = await transporter.sendMail({
    from: sendGridEmail,
    to: to,
    subject: subject,
    text: text,
    html: html || `<p>${text}</p>`
  });

  console.log('Email sent:', info.messageId);
};

module.exports = sendEmail;
