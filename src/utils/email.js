const nodemailer = require('nodemailer');
const { sendGridApiKey, sendGridEmail } = require('../config/config');

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  auth: {
    user: 'apikey', // always this value
    pass: sendGridApiKey // your API key
  }
});

async function sendEmail(options) {
  try {
    const info = await transporter.sendMail({
      from: sendGridEmail,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html || `<p>${options.text}</p>`
    });

    console.log('Email sent:', info.messageId);
  } catch (err) {
    console.error('Error sending email:', err);
  }
}

module.exports = sendEmail;
