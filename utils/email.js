const nodemailer = require('nodemailer');

const sendEmail = async options => {
    const transporter = nodemailer.createTransport({
        host: '',
        port: '',
        auth: {
            user: '',
            pass: ''
        }
    });

    const mailOptions = {
        from: 'John Doe <jdoe@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;