require('dotenv').config();
const nodemailer = require('nodemailer');

//Sends an email to a user with a specific link to reset password
const sendResetMail = (email, token) => {
    let transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 25,
        secure: false,
        auth: {
            user: process.env.USER,
            pass: process.env.PASSWORD
        }
    });
    const message = {
        from: "little_fashion@gmail.com",
        to: email,
        subject: "Reset Password",
        text: 'You are receiving this because you have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://localhost:4200/reset_password/' + token + '\n\n' +
            'This link is active for next 5 minutes only.\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    };

    transport.sendMail(message, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Email Sent Successfully');
        }
    });
}

module.exports = { sendResetMail };
