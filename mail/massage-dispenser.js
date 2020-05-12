const serviceRequestMsgRouter = (data, route) => {
  if (route.includes('create')) {
    return createServiceRequest(data);
  }  else if (route.includes('edit') && !data.isChanged) {
    return updateServiceRequest(data);
  } else if (route.includes('edit') && data.isChanged) {
    return updateServiceRequestStatus(data)
  }
  
}

const userMsgRouter = (data, route, state) => {
  if (route.includes('register') && state.includes('waiting')) {
    return userWaiting(data) ; 
  } else if (route.includes('register') && state.includes('accepted')) {
    return userAccepted(data) && registerRequest(data);
  } else if (route.includes('password/update')) {
    return userPwdUpdateRequest(data);
  }
}

const userPwdUpdateRequest = (data) => {
  let title = `איפוס סיסמה למערכת לניהול קריאות שירות`;
  let mail = data.email;  
  // let ref = '<a href="https://targetwebform.z6.web.core.windows.net/login">Target Webform</a>';
  let output = `
  <div style="direction: rtl;">
  <p>שלום ${data.name},</p>
  <p>בקשתך לשינוי סיסמא התקבלה וממתינה לאישור מנהל המערכת..</p>
  
  <p>בברכה,</p>
  <p>צוות מערכות מידע</p></div>
  `  
  return prepareMailBody(mail, title, output);
}

const adminApproveUserUpdatePwd = (data) => {

}

const userAccepted = (data) => {
  let title = `אישור הרשמה למערכת לניהול קריאות שירות`;
  let mail = data.email;  
  let ref = '<a href="https://targetwebform.z6.web.core.windows.net/login">Target Webform</a>';
  let output = `
  <div style="direction: rtl;">
  <p>שלום ${data.name},</p>
  <p>בקשתך לרישום אושרה ע"י מנהל המערכת.</p>
  <p>שם משתמש: ${data.name}</p>
  <p>ניתן להיכנס למערכת ע"י הקישור הבא: ${ref}</p>
  
  <p>בברכה,</p>
  <p>צוות מערכות מידע</p></div>
  `  
  return prepareMailBody(mail, title, output);
}

const userWaiting = (data) => {
  let title = `שלום ${data.name}`;
  let mail = data.email;  
  let output = `
  <div style="direction: rtl;">
  <p>בקשתך לרישום למערכת קריאות שירות עבור מערכת טראפיק התקבלה במערכת.</p>
  <p>הבקשה ממתינה לאישור של מנהל המערכת.</p>
  <p>לאחר אישור המשתמש ישלח מייל אישור</p>
  
  <p>בברכה,</p>
  <p>צוות מערכות מידע</p></div>
  `  
  return prepareMailBody(mail, title, output);
}

const registerRequest = (data) => {
  let title = `משתמש חדש מחכה לאישורך`;
  let mail = '';  
  let output = `
  <div style="direction: rtl;">
  <p>שלום רב,</p>
  <p>מחכה לאישורך משתמש חדש בשם ${data.name}</p>
  <p>יש להכנס למערכת על מנת לאשר </p>
  
  <p>בברכה,</p>
  <p>צוות מערכות מידע</p></div>
  `  
  return prepareMailBody(mail, title, output);
}

const createServiceRequest = (data) => {
  
  let title = `נפתחה קריאת שירות חדשה במערכת ${data.system}, מספר ${data.srId}`;
  let mail = data.email;  
  let output = `
  <div style="direction: rtl;">
  <p>שלום רב,</p>
  <p>קטגוריה: ${data.category} ${data.subCategory}</p>

  <p>מודול: ${data.klhModule}</p>
  <p>כותרת: ${data.title}</p>
  <p>תיאור: ${data.description}</p>
  <p>משתמש בקשה: ${data.name}</p>

  <p>דחיפות: ${data.impact}</p>
  <p>בברכה,</p>
  <p>צוות מערכות מידע</p></div>
  `  
  return prepareMailBody(mail, title, output);
}

const updateServiceRequestStatus = (data) => {
  console.log(data);
  
  let title = `קריאה שמספרה ${data.srId} עודכנה`;
  let mail = data.email;  
  let output = `
  <div style="direction: rtl;">
  <p>שלום,</p>
  
  <p>קטגוריה: ${data.category} ${data.subCategory}</p>

  <p>מודול: ${data.module}</p>
  <p>כותרת: ${data.title}</p>
  <p>תיאור: ${data.description}</p>
  <p>משתמש בקשה: ${data.name}</p>

  <p>דחיפות: ${data.impact}</p>
  <p>בברכה,</p>
  <p>צוות מערכות מידע</p></div>
  `
  return prepareMailBody(mail, title, output);
}

const updateServiceRequest = (data) => {
  console.log(data);
  
  let title = `קריאה שמספרה ${data.srId} שונתה לסטאטוס ${data.status}`;
  let mail = data.email;  
  let output = `
  <div style="direction: rtl;">
  <p>שלום,</p>
  <p>סטאטוס הקריאה השתנה ל${data.status}</p>
  <p>קטגוריה: ${data.category} ${data.subCategory}</p>

  <p>מודול: ${data.module}</p>
  <p>כותרת: ${data.title}</p>
  <p>תיאור: ${data.description}</p>
  <p>משתמש בקשה: ${data.name}</p>

  <p>דחיפות: ${data.impact}</p>
  <p>בברכה,</p>
  <p>צוות מערכות מידע</p></div>
  `
  return prepareMailBody(mail, title, output);
}

const prepareMailBody = (mail, title, output) => {
  
  let body = {
    from: '"Target webform" <webform@kan.org.il>',
    to: mail,
    subject: title,
    html: output,
  };
  // console.log(body);
  
  return body;
}

module.exports = { serviceRequestMsgRouter, userMsgRouter }