// tables
const ASR = require('../models/azure-service-request');
const SSR = require('../models/sysaid-service-request');
const Blob = require('../models/blob');
const State = require('../models/state');
const Image = require('../models/service-request-images');
const BlobServer = require('../models/mvcBlobServers');

const handlers = require('../helper/handlers');
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
  const blobName = rea.body.blobName;
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
    await Blob.create({ srId: asr.id });
    await Image.create({
      azureId: asr.id,
      blobName: blobName,
      containerName: containerName,
      blobServer: 1,
    });
    await State.create({
      srId: asr.id,
      syncStatus: 0,
      syncStatusName: 'waiting insert sync',
      syncUpdated: new Date(),
    });
    res.status(201).send({ id: 2, msg: 'success' });
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
  const updateUser = req.body.updateUser;

  try {
    const state = await State.findOne({ where: { srId: srId }, raw: true });
    console.log(state);

    if (!state) {
      const createdState = await State.create({
        srId: srId,
        syncStatus: 2,
        syncStatusName: 'waiting update sync',
        syncUpdated: new Date(),
      });
      // console.log(createdState);
      res.status(201).send('created a new state');
    } else {
      if (stats.includes(state.syncStatus)) {
        // if (state.syncStatus === 1 || state.syncStatus === 2 || state.syncStatus === 3) {
        const updatedSSR = await findOne({ where: { id: srId } });
        if (updatedSSR.impact !== impact) {
          sr = {
            srId: updatedSSR.id,
            updatingUser: updateUser,
            updateDate: new Date(),
          };
          // mail.messageRoutelet(sr, route);
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
        // const asr = await ASR.findOne({ where: { srId: srId } });
        // if (!asr) {

        // } else {
        // asr.title = title;
        // asr.description = description;
        // asr.impact = impact;
        // asr.sr_cust_module = klhModule;
        // asr.status = status;
        // asr.update_time = new Date();
        // await asr.save();

        // mail.messageRoutelet(asr, route);
        res.status(201).send({ id: 2, text: 'success' });
        // }
      } else if (state.syncStatus === 6) {
        state.syncStatus = 6;
        state.syncStatusName = 'error';
        state.syncUpdated = new Date();
        await state.save();
        // mail.messageRoutelet(asr, route);
      } else {
        res.status(401).send('record was not updated');
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
    const state = await State.findOne({ where: { srId: srId } });
    if (!state) {
      await State.create({
        srId: srId,
        syncStatus: 4,
        syncStatusName: 'delete',
        syncUpdated: new Date(),
      });
      const ssr = await SSR.findOne({ where: { id: srId } });
      const image = await Image.findOne({ where: { sysId: ssr.id } });
      // mail.messageRoutelet(ssr, route)
      await image.destroy();
      await ssr.destroy();
      res
        .status(201)
        .json({
          message: 'state does not exist, created a state with id 4 to delete',
        });
    } else {
      // if (state.syncStatus !== 4 || state.syncStatus !== 5 || state.syncStatus !== 6) {
      if (!stats.includes(state.syncStatus)) {
        const stateToUpdate = await State.findOne({ where: { srId: srId } });
        stateToUpdate.syncStatus = 4;
        stateToUpdate.syncStatusName = 'delete';
        await stateToUpdate.save();
        const ssr = await SSR.findOne({ where: { srId: srId } });
        const image = await Image.findOne({ where: { sysId: ssr.id } });

        // mail.messageRoutelet(ssr, route)
        await image.destroy();
        await ssr.destroy();
        res
          .status(201)
          .json({
            message:
              'sysaid service request destroyed, status updated for deletion',
          });
      }
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  create: createSr,
  update: editSr,
  delete: deleteSr,
};
