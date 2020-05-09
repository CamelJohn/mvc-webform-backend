const dispenser = require('./massage-dispenser');
const axios = require('axios');
// const mailTransporter = require("./mail-transporter");

exports.messageRoutelet = (data, route, pwd, state) => {
  let email;
    
  if (route.includes('user')) {
    email = dispenser.userMessages(data, route);
  } else if (route.includes('password')) {
    email = dispenser.pwdMessages(data, route, pwd, state);
  } else if (route.includes('crud')) {
    email = dispenser.srMessages(data, route);
  }  
  mailSender(email);
};

const mailSender = async (mail) => {
  console.log(mail);
  
  try {
    const result = await axios.post('http://localhost:8081/mail/send', {
      mail: mail,
    });
    // if (result) {
    //   res.status(200).json({ message: 'success!' });
    // } else {
    //   res.status(404).json({ message: 'something went wrong !' });
    // }
  } catch (err) {
    // res.status(500).json({ message: err.message });
    console.log({ message : err.message });
    
  }
};
