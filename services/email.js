require('dotenv').config();
const nodemailer = require('nodemailer');

//Sends an email to user on registering
const sendMail = (email) => {
    let transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        secure: false,
        auth: {
            user: process.env.USER,
            pass: process.env.PASSWORD
        }
    });

    const message = {
        from: "little_fashion@gmail.com",
        to: email,
        subject: "Successfully Registered",
        text: "Congratulations for successful registration and to become a part of Little Fashion!"
    };

    transport.sendMail(message, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent successfully');
        }
    });
}

module.exports = {sendMail}
