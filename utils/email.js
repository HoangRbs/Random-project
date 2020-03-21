const nodemailer = require('nodemailer');
const pug = require('pug');

class Email {
  constructor(user, url) {
    this.from = 'hoang minh <hoangrbs@gmail.com>';
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
  }

  createTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
    }

    return nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST,
      port: process.env.NODEMAILER_PORT,
      auth: {
        user: process.env.NODEMAILER_USERNAME, // generated ethereal user
        pass: process.env.NODEMAILER_PASSWORD // generated ethereal password
      }
    });
  }

  async send(templateFile, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${templateFile}`, {
      firstName: this.firstName,
      url: this.url
    });

    const mailOption = {
      from: this.from, // sender address
      to: this.to, // list of receivers
      subject: subject, // Subject line
      html
    };

    await this.createTransport().sendMail(mailOption);
  }

  async sendWelcome() {
    await this.send('welcome.pug', 'welcome to random project');
  }
}

module.exports = Email;
