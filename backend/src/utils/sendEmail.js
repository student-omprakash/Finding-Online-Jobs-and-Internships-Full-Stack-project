const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a transporter
    // For now, if no SMTP env vars are set, we just log to console
    if (!process.env.SMTP_HOST && !process.env.SMTP_SERVICE) {
        console.log('---------------------------------------------------');
        console.log(`[MOCK EMAIL] To: ${options.email}`);
        console.log(`[MOCK EMAIL] Subject: ${options.subject}`);
        console.log(`[MOCK EMAIL] Message: \n${options.message}`);
        console.log('---------------------------------------------------');
        return;
    }

    const transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE || 'gmail', // Default to gmail if using service
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    // Define the email options
    const mailOptions = {
        from: `${process.env.FROM_NAME || 'CareerNest'} <${process.env.FROM_EMAIL || 'no-reply@careernest.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: options.html, // Optional if we want HTML emails later
    };

    // Send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
