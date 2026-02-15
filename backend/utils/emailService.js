const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text, html) => {

    console.log("USER:", process.env.EMAIL_USER);
    console.log("PASS LENGTH:", process.env.EMAIL_PASS?.length);

    console.log("Email Service Attempt:", {
        user: process.env.EMAIL_USER ? "DETECTED" : "MISSING",
        pass: process.env.EMAIL_PASS ? "DETECTED" : "MISSING"
    });

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error("Missing EMAIL_USER or EMAIL_PASS environment variables");
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false, // 👈 ADD THIS
        },
    });



    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = { sendEmail };
