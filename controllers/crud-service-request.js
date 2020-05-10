// tables
const ASR = require('../models/azure-service-request');
const SSR = require('../models/sysaid-service-request');
const STATE = require('../models/state');
const USER = require('../models/user');
const BLOB = require('../models/mvcBlob');
const BLOB_SERVER = require('../models/mvcBlobServers');
const LOG = require('../models/change-log');

const handlers = require('../helpers/cellHandler');
const mail = require('../mail/massage-routelet');

const createSr = async (req, res, next) => {
  const problemType = req.body.mainCategory;
  const problemSubType = req.body.subCategory;
  const title = req.body.title;
  const name = req.body.fullName;
  const idOpen = req.body.id;
  const email = req.body.emailAddress;
  const phone = handlers.cellHandler(req.body.phoneNumber);
  const description = req.body.description;
  const impact = req.body.impact;
  const klhModule = req.body.klhModule;
  const blobName = req.body.blobName;
  const containerName = req.body.containerName;

  try {
    const asr = await ASR.create({
      // create service request and insert into sysaid_sr table
      problem_type: problemType,
      problem_sub_type: problemSubType,
      title: title,
      name_open: name,
      id_open: idOpen,
      email_open: email,
      phone_open: phone,
      description: description,
      impact: impact,
      sr_cust_module: klhModule,
      status: 1,
      update_time: new Date(),
    });
    await BLOB.create({
      azureId: asr.id,
      blobName: blobName,
      containerName: containerName,
      blobServer: 1,
    });
    await STATE.create({
      srId: asr.id,
      syncStatus: 0,
      syncStatusName: 'waiting insert sync',
      syncUpdated: new Date(),
    });
    res.status(201).send({ message: 'success' });
  } catch (err) {
    res.status(500).send({ id: 1, msg: err.message });
  }
};

const editSr = async (req, res, next) => {
  const srId = req.body.srId;
  const title = req.body.title;
  const description = req.body.description;
  const impact = req.body.affection;
  const klhModule = req.body.klhModule;
  const status = req.body.status;
  const route = req.originalUrl;
  const stats = [1, 2, 3];

  try {
    const state = await STATE.findOne({ where: { srId: srId }, raw: true });
    console.log(state);

    if (!state) {
      const createdState = await STATE.create({
        srId: srId,
        syncStatus: 2,
        syncStatusName: 'waiting update sync',
        syncUpdated: new Date(),
      });
      res.status(201).send({ message: 'created a new state'});
    } else {
      if (stats.includes(state.syncStatus)) {
        const updateUser = await USER.findOne({ where: { id: req.id }})
        const updatedSSR = await SSR.findOne({ where: { id: srId } });
        if (updatedSSR.impact !== impact) {
          // sr = {
          //   srId: updatedSSR.id,
          //   updatingUser: updateUser,
          //   updateDate: new Date(),
          // };
          // mail.messageRoutelet(sr, route);
          await LOG.create({ old_value: updatedSSR.impact, new_value: impact, date_edited: new Date(), edited_by: updateUser, srId: srId })
          // add to log
        }
        updatedSSR.title = title;
        updatedSSR.description = description;
        updatedSSR.impact = impact;
        updatedSSR.sr_cust_module = klhModule;
        updatedSSR.status = status;
        updatedSSR.update_time = new Date();
        await updatedSSR.save();

        state.syncStatus = 2;
        state.syncStatusName = 'waiting update sync';
        state.syncUpdated = new Date();
        await state.save();
  
        res.status(201).send({ message: 'success' });
        // }
      } else if (state.syncStatus === 6) {
        state.syncStatus = 6;
        state.syncStatusName = 'error';
        state.syncUpdated = new Date();
        await state.save();
        // mail.messageRoutelet(asr, route);
      } else {
        res.status(401).send({ message: 'record was not updated'});
      }
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteSr = async (req, res, next) => {
  const srId = req.body.srId;
  const route = req.originalUrl;
  const stats = [4, 5, 6];

  try {
    const state = await STATE.findOne({ where: { srId: srId } });
    if (!state) {
      await STATE.create({
        srId: srId,
        syncStatus: 4,
        syncStatusName: 'delete',
        syncUpdated: new Date(),
      });
      const ssr = await SSR.findOne({ where: { id: srId } });
      const image = await BLOB.findOne({ where: { sysId: ssr.id } });
      // mail.messageRoutelet(ssr, route)
      await image.destroy();
      await ssr.destroy();
      res.status(201).json({ message: 'state does not exist, created a state with id 4 to delete' });
    } else {
      if (!stats.includes(state.syncStatus)) {
        const stateToUpdate = await STATE.findOne({ where: { srId: srId } });
        stateToUpdate.syncStatus = 4;
        stateToUpdate.syncStatusName = 'delete';
        await stateToUpdate.save();
        const ssr = await SSR.findOne({ where: { srId: srId } });
        const image = await BLOB.findOne({ where: { sysId: ssr.id } });

        // mail.messageRoutelet(ssr, route)
        await image.destroy();
        await ssr.destroy();
        res.status(201).json({ message: 'sysaid service request destroyed, status updated for deletion' });
      }
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = { createSr, editSr, deleteSr };
