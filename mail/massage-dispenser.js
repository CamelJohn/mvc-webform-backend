exports.userMessages = (data, route) => {
  let title;
  let mail = data.email;
  let gist;
  
  if (route.includes('delete')) {
    gist = 'Your user has been deleted';
    title = 'Target webform user deleted';
  } else if (route.includes('update')) {
    gist = 'Your user has been deleted';
    title = 'Target webform user updated';
  }

  var output = `
      <h3>Dear ${data.fullName},</h3>
      <p>${gist}</p>
      <p>to register: <a href="https://targetwebform.z6.web.core.windows.net/signup">Target Webform</a> </p>`;

  const body = {
    from: '"Target webform" <webform@gkan.org.il>',
    to: `'${mail}'`,
    subject: title,
    html: output,
  };
  return body;
};

exports.pwdMessages = (data, route, pwd, state) => {  
  // console.log(data.token);
  
  let gist;
  let gist2;
  let title;
  let mail = data.user.email;
  let link;
  let ref = `<a href="https://targetwebform.z6.web.core.windows.net/login">Target Webform</a>`;

  if (route.includes('update')) {
    gist = `Your password has been changed to:  <b>${pwd}</b> , please login and change your password`;
    link = `to log in: ${ref}`;
    title = 'User password changed';
  } else if (route.includes('key')) {   
    title = 'Token for password change';
    gist = `Your password token has been successfully generated`;
    gist2 = `Please sign in with <b>${pwd}</b> within the next 30 minutes, remember this token will expire at ${data.token.expirtaionDate}`;
    link = `login to view the change: ${ref}`;
  } else if (route.includes('reset')) {
    if (state === 'fail') {
      title = 'Token for password change';
      gist = 'Your password could not be reset reset';
    } else {
      title = 'Token for password change';
      gist = 'Your password was reset reset';
      link = `login to view the change: ${ref}`;
    }
  }
  var output = `
  <h3>Dear ${data.user.fullName ? data.user.fullName : 'customer'},</h3>
  <p>${gist}</p>
  <p>${gist2 ? gist2 : ''}</p>
  <p>${link ? link : ''}</p>`;

  const body = {
    from: '"Target webform" <webform@gkan.org.il>',
    to: mail,
    subject: title,
    html: output,
  };
  return body;
};

exports.srMessages = (data, route) => {
  let gist;
  let gist2 = `service request number: <b>${data.srId}</b> `;
  let title;
  let mail = data.email_open;
  let link;
  let ref = `<a href="https://targetwebform.z6.web.core.windows.net/login">Target Webform</a>`;

  if (route.includes('delete')) {
    gist = `your service request was deleted`;
    title = 'Service reqeust deleted';
  } else if (route.includes('update')) {
    gist = `your service request was updated`;
    link = `login to view the change: ${ref}`;
    title = 'Service reqeust updated';
  }

  var output = `
  <h3>Dear ${data.name_open ? data.name_open : 'customer'},</h3>
  <p>${gist}</p>
  <p>${gist2 ? gist2 : ''}</p>
  <p>${link ? link : ''}</p>`;

  const body = {
    from: '"Target webform" <webform@gkan.org.il>',
    to: `'${mail}'`,
    subject: title,
    html: output,
  };
  return body;
};
