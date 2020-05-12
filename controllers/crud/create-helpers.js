const ASR = require('../../models/azure-service-request');
const BLOB = require('../../models/mvcBlob');
const STATE = require('../../models/state');

const createAzureServiceRequest = async (problemType, problemSubType, thirdLevelCat, title, name, idOpen, email, phone, description, impact, klhModule) => {
  const asr = await ASR.create({
    problem_type: problemType,
    problem_sub_type: problemSubType,
    third_level_category: thirdLevelCat,
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
  return asr;
}

const createBlob = async (asrId, blobName, containerName) => {
  await BLOB.create({
    azureId: asrId,
    blobName: blobName,
    containerName: containerName,
    blobServer: 1,
  });
}

const createState = async (asrId) => {
  await STATE.create({
    srId: asrId,
    syncStatus: 0,
    syncStatusName: 'waiting insert sync',
    syncUpdated: new Date(),
  });
}

module.exports = { createAzureServiceRequest, createBlob, createState }