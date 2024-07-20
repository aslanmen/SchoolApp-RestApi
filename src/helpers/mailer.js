
const nodemailer = require('nodemailer');

//Create a bearer for the SMTP server
const transporter = nodemailer.createTransport({
    service: 'gmail', // The email service you want to use (for example, Gmail)
    auth: {
        user: 'your-mail', // Your sender email address
        pass: 'app-password'    // application password
    }
});

// E-posta gönderme fonksiyonu
const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: 'your-password', // Your sender email address
        to: to,                       // Recipient email address
        subject: subject,             // Email title
        text: text                    // Email content
    };

    // E-postayı gönder
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('E-posta gönderme hatası: ', error);
        } else {
            console.log('E-posta başarıyla gönderildi: ', info.response);
        }
    });
};

module.exports = sendEmail;
