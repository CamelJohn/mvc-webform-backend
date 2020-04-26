// tables
const ASR = require("../models/azure-service-request");
const SSR = require('../models/sysaid-service-request');
const Blob = require("../models/blob");
const State = require('../models/state');

const handlers = require("../helper/handlers");
const mail = require('../mail/massage-routelet');

const createSr = (req, res, next) => {
  const problemType = req.body.mainCategory;
  const problemSubType = req.body.subCategory;
  const title = req.body.title;
  const name = req.body.fullName;
  const idOpen = req.body.id;
  const email = req.body.emailAddress;
  const phone = handlers.cellHandler(req.body.phoneNumber);
  const description = req.body.description;
  const impact = req.body.impact;
  const module = req.body.klhModule;
  ASR.create({ // create service request and insert into sysaid_sr table
    problem_type: problemType,
    problem_sub_type: problemSubType,
    title: title,
    name_open: name,
    id_open: idOpen,
    email_open: email,
    phone_open: phone,
    description: description,
    impact: impact,
    sr_cust_module: module,
    status: 1,
    update_time: new Date(),
  }).then((asr) => {
    Blob.create({ srId: asr.id });
    return asr;
  }).then((asr) => {
    State.create({
      srId: asr.id,
      syncStatus: 0,
      syncStatusName: "waiting insert sync",
      syncUpdated: new Date(),
    });
      res.status(200).send({ id: 2, msg: "success" });
    }).catch((err) => res.status(400).send({ id: 1, msg: err.message }));
};

const editSr = (req, res, next) => {
  const srId = req.body.srId;
  const title = req.body.title;
  const description = req.body.description;
  const impact = req.body.affection;
  const module = req.body.klhModule;
  const status = req.body.status;
  const route = req.originalUrl;  

  State.findOne({ where: { srId: srId }, raw: true })
  .then((state) => { 
    console.log(state);
    
    if (!state) {
      State.create({
        srId: srId,
        syncStatus: 2,
        syncStatusName: 'waiting update sync',
        syncUpdated: new Date()
      }).then(data => { 
        console.log(data);
        res.status(201).send('created a new state');
      }).catch(err => res.status(400).send('something went wrong'));
    } else {
      if (state.syncStatus == "1" || state.syncStatus == "2" || state.syncStatus == "3") {
        state.syncStatus = 2;
        state.syncStatusName = 'waiting update sync';
        state.syncUpdated = new Date();
        
        ASR.findOne({ where: { srId: srId } })
        .then((sr) => {          
          sr.title = title;
          sr.description = description;
          sr.impact = impact;
          sr.sr_cust_module = module;
          sr.status = status;
          sr.update_time = new Date();
          res.send({ id: 2, text: 'success' });
          sr.save();
          mail.messageRoutelet(sr, route);
        }).catch(err => {
          console.log(err)
          res.send({ id: 1, text: err.message })
        })
      }
      else if (state.syncStatus == "6") {
        state.syncStatus = 6;
        state.syncStatusName ='error';
        syncUpdated = new Date();
        // mail.messageRoutelet(sr, route);
        res.status(200).send({ id: 2, text: 'success'});
      }
      else {
        res.status(400).send('record was not updated');
      }
    }
  }).catch(err => console.log(err))
};

const deleteSr = (req, res, next) => {
  const srId = req.body.srId;
  const route = req.originalUrl;  
  State.findOne({ where: { srId: srId }})
  .then((sr) => { 
    if (!sr) {
      State.create({
        srId: srId,
        syncStatus: 4,
        syncStatusName: 'delete',
        syncUpdated: new Date()
      })
    SSR.findOne({ where: { srId: srId }})
    .then(sr => { 
      mail.messageRoutelet(sr, route)
      sr.destroy();
    }).catch(err => console.log(err))
    } else {
      if (sr.syncStatus != '4' || sr.syncStatus != '5' || sr.syncStatu !== '6') {
        sr.syncStatus = 4;
        sr.syncStatusName = 'delete';
    SSR.findOne({ where: { srId: srId }})
    .then(sr => { 
    mail.messageRoutelet(sr, route)
      sr.destroy();
    }).catch(err => console.log(err))
        sr.save();
      }
    }
  }).catch(err => console.log(err))
};

module.exports = {
  create: createSr,
  update: editSr,
  delete: deleteSr
};
  