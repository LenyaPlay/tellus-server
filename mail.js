const nodemailer = require('nodemailer');
const config = require('./config');


module.exports.transporter = nodemailer.createTransport({
    service: 'mail',
    host: "smtp.mail.ru",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: config.mail.user,
        pass: config.mail.password,
    }
})

