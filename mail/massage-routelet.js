const dispenser = require('./massage-dispenser');
const axios = require('axios');
// const mailTransporter = require("./mail-transporter");

const messageRoutelet = (data, route, pwd, state) => {
  let email;
  
  if (route.includes('service-request')) {
    email = dispenser.serviceRequestMsgRouter(data, route, pwd);
  } else if (route.includes('user')) {
    email = dispenser.userMsgRouter(data, route, state);
  }
  console.log(email);
  
  mailSender(email);
};

const mailSender = async (mail) => {  
   
  // try {
  //   await axios.post('http://localhost:8081/mail/send', {
  //     mail: mail,
  //   });
  // } catch (err) {
  //   console.log({ message : err.message });
  // }
};

module.exports = { messageRoutelet }