const nodemailer = require('nodemailer');

exports.sendEmail = async ({ receiverMail, subject, message }) => {
  let transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_USERNAME, // generated ethereal user
      pass: process.env.NODEMAILER_PASSWORD // generated ethereal password
    }
  });

  const mailOption = {
    from: 'hoang minh <hoangrbs2@gmail.com>', // sender address
    to: receiverMail, // list of receivers
    subject: subject, // Subject line
    text: message // plain text body
  };

  // send mail with defined transport object
  await transporter.sendMail(mailOption);
};
