const dispenser = require("./massage-dispenser");
const mailTransporter = require("./mail-transporter");

exports.messageRoutelet = (data, route, pwd, state) => {
  if (route.includes("user")) {
    mailTransporter.mailHandler(dispenser.userMessages(data, route));
  } else if (route.includes("password")) {
    mailTransporter.mailHandler(dispenser.pwdMessages(data, route, pwd, state));
  } else if (route.includes("service-request")) {
    mailTransporter.mailHandler(dispenser.srMessages(data, route));
  }
};
