require('dotenv').config();
const nodemailer = require('nodemailer');

//Sends an email when a user cancels his/her order
const sendOrderCancelledMail = (email, transactionId, isRefunded) => {
    if (isRefunded) {
        paymentStatus = "Refunded";
        refundMessage = "<p>The refund amount will be credited back to your account within 4-5 business days.</p>";
    } else {
        paymentStatus = "Voided";
        refundMessage = "";
    }
    const emailContent = `<div style='font-size:20px;padding-left:10px;'>
    <p style='color:red;font-size:35px;'>Order Cancellation</p>
    <p>Transaction ID: ${transactionId}</p>
    
    <p>Dear valued customer,</p>

    <p>We regret to inform you that your order has been canceled. The payment for this order has been ${paymentStatus}.</p>
    
    <p>${refundMessage}</p>

    <p>If you have any questions or concerns, please don't hesitate to contact our customer support team.</p>

    <p>Thank you for considering Little Fashion! We hope to serve you again in the future.</p>

    <p>Best regards,</p>
    <p>The Little Fashion Team</p>
</div>`;

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
        subject: "Order Cancelled",
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

module.exports = { sendOrderCancelledMail }
