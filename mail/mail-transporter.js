const nodemailer = require('nodemailer');

exports.mailHandler = (cb) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, 
    auth: {
      user: 'deangelo.runolfsdottir@ethereal.email',
      pass: 'RbtqWPwBvYJxNQyCqd'
    }
  });

  transporter.sendMail(cb, (error, info) => {
    if (error) {
      return console.log(error)
    } 
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  })
}