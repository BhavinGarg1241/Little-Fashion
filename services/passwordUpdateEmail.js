require('dotenv').config();
const nodemailer = require('nodemailer');

//Senda an email when a user updates his password
const sendPasswordUpdateMail = (email) => {
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
        subject: "Password Updated",
        text: "Your password has been updated successfully."
    };

    transport.sendMail(message, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent successfully');
        }
    });
}

module.exports = {sendPasswordUpdateMail}
