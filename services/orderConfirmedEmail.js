require('dotenv').config();
const nodemailer = require('nodemailer');

//Sends an email when a user places a new order
const sendOrderConfirmedMail = (email,transactionId) => {
    const emailContent = `<div style='font-size:20px;padding-left:10px;'>
    <p style='color:green; font-size:35px;'>Payment Successful!</p>
    <p>Transaction ID: ${transactionId}</p>
    
    <p>Dear valued customer,</p>

    <p>We are excited to inform you that your payment was successful, and your order has been confirmed!</p>

    <p>You can track the status of your order by visiting the <a href='http://localhost:4200/profile/track_orders' class="fs-4">Track Orders</a> section in your profile.</p>

    <p>Thank you for choosing Little Fashion! If you have any questions or need further assistance, feel free to contact our customer support team.</p>

    <p>Best regards,</p>
    <p>The Little Fashion Team</p>
</div>`

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
        subject: "Order Confirmed",
        html: emailContent
    };

    transport.sendMail(message, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent successfully');
        }
    });
}

module.exports = { sendOrderConfirmedMail }
