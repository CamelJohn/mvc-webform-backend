// tables
const ASR = require("../models/azure-service-request");
const SSR = require('../models/sysaid-service-request');
const Blob = require("../models/blob");
const State = require('../models/state');

const Op = require("sequelize");
const handlers = require("../helper/handlers");

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
  ASR.create({// create service request and insert into sysaid_sr table
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
  }).then((ssr) => {
    Blob.create({ srId: ssr.id });
    return ssr;
  }).then((ssr) => {
    State.create({
      srId: ssr.id,
      syncStatus: 0,
      syncStatusName: "waiting insert sync",
      syncUpdated: new Date(),
    });
      res.status(200).send({ id: 2, msg: "success" });
    }).catch((err) => res.status(400).send({ id: 1, msg: err.message }));
};

const editSr = (req, res, next) => {
  
};

const deleteSr = (req, res, next) => {
  const srId = req.body.srId;
  State.findOne({ where: { srId: srId }})
  .then((sr) => { 
    if (!sr) {
      State.create({
        srId: srId,
        syncStatus: 4,
        syncStatusName: 'delete',
        syncUpdated: new Date()
      })
      handlers.removeSr(res, sr.srId);
    } else {
      if (sr.syncStatus !== '4' || sr.syncStatus !== '5' || sr.syncStatus !== '6') {
        sr.syncStatus = 4;
        sr.syncStatusName = 'delete';
        return sr.save()
        .then(sr => { 
         handlers.removeSr(res, sr.srId);
        }).catch(err => console.log(err))
      }
    }
  }).catch(err => console.log(err))
};

module.exports = {
  create: createSr,
  update: editSr,
  delete: deleteSr
};
  