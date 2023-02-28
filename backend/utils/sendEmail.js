const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    service:"gmail",
    host:process.env.SMTP_HOST,
    port:process.env.SMTP_PORT,
    auth: {
      user: "drishya234@gmail.com",
      pass: "ixksapffppxtywpr",
    },
  });
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
