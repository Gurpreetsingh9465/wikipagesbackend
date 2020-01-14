const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD  
    }
});

module.exports = (to, subject, text) => {
    transporter.sendMail({
        from: process.env.EMAIL,
        to: to,
        subject: subject,
        text: text
    });
}