const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMPT_HOST || 'smtp.gmail.com',
    port: process.env.SMPT_PORT || 465,
    service: process.env.SMPT_SERVICE || 'gmail',
    auth: {
      user: process.env.SMPT_MAIL || 'bhanupratapudemy@gmail.com',
      pass: process.env.SMPT_PASSWORD || 'bhanu@218',
    },
  });

  const mailOptions = {
    from: process.env.SMPT_MAIL || 'bhanupratapudemy@gmail.com',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

 return  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
