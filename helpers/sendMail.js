const nodemailer = require("nodemailer");

async function sendMail(info, token){
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'nikolas.larkin@ethereal.email',
                pass: 'WbR5BDnvenEhW3V8CU'
            }
        });

        // define email options
        let mailOptions = {
            from: 'AlloMedia.livraieon@media.com',
            to: info.email,
            subject: 'Account activation link',
            text: `Hello ${info.name},`,
            html: `<h1> Please click on the link to activate your account </h1>
        <a href="http://localhost:3000/api/auth/activate/${token}">Activate your account</a>`,
        };

        let details = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", details.messageId);

    } catch (error) {
        console.log(error);
        return error;
    }
}

module.exports = sendMail;