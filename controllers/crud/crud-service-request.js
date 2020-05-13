// tables
const LOG = require('../../models/change-log');

const mail = require('../../mail/massage-routelet');
const { cellHandler } = require('../../helpers/cellHandler');
const { createAzureServiceRequest, createState, createBlob } = require('./create-helpers');
const { createEditState, updateSSR, updateEditState, setErrorState } = require('./edit-helpers');
const { createDeleteState, updateDeleteState } = require('./delete-helpers');
const { findState, findBlobById, findSSRById, findUserById } = require('../../shared/querries');

const createSr = async (req, res, next) => {
  const problemType = req.body.mainCategory;
  const problemSubType = req.body.subCategory;
  const thirdLevelCat = req.body.thirdLevelCat;
  const title = req.body.title;
  const name = req.body.fullName;
  const email = req.body.emailAddress;
  const phone = cellHandler(req.body.phoneNumber);
  const description = req.body.description;
  const impact = req.body.impact;
  const klhModule = req.body.klhModule;
  const blobName = req.body.blobName;
  const containerName = req.body.containerName;
  const idOpen = req.id;

  try {
    const asr = await createAzureServiceRequest(
      problemType, 
      problemSubType, 
      thirdLevelCat, 
      title, 
      name, 
      idOpen, 
      email, 
      phone, 
      description, 
      impact, 
      klhModule
    );
    await createBlob(asr.id, blobName, containerName);
    await createState(asr.id);
    res.status(201).send({ message: 'success' });
  } catch (err) {
    res.status(500).send({ msg: err.message });
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
  const currentUser = req.id;
  
  try {
    const state = await findState(srId);    
    const authUser = await findUserById(currentUser)
    
    if (!state) {
      await createEditState(srId);
      res.status(201).send({ message: 'created a new state'});
    } else {
      // check the status
      if (stats.includes(state.syncStatus)) { 
        //get the SSR to update
        const updatedSSR = await findSSRById(srId); 
        // if status has changed do this
        if (updatedSSR.status !== status) { 
          // if impact has chaneg save to log
          if (updatedSSR.impact !== impact) { 
            await LOG.create({ old_value: updatedSSR.impact, new_value: impact, date_edited: new Date(), edited_by: authUser.name, srId: srId })
          }
        // update SSR
        await updateSSR(updatedSSR, title, description, impact, klhModule, status); 
        // update state
        await updateEditState(state) 
       
        mail.messageRoutelet({
          srId: updatedSSR ? updatedSSR.id: null,
          category: updatedSSR ? updatedSSR.problem_sub_type: null,
          subCategory: updatedSSR ? updatedSSR.third_level_category: null,
          status: status,
          module: klhModule,
          title: title,
          description: description,
          email: authUser.email,
          name: authUser.fullName,
          impact: impact,
          isChanged: true
        }, route);
        res.status(201).send({ message: 'success' });
        } else {
           // update SSR
        await updateSSR(updatedSSR, title, description, impact, klhModule, status); 
        // update state
        await updateEditState(state) 
          mail.messageRoutelet({
            srId: updatedSSR ? updatedSSR.id: null,
            category: updatedSSR ? updatedSSR.problem_sub_type: null,
            subCategory: updatedSSR ? updatedSSR.third_level_category: null,
            status: status,
            module: klhModule,
            title: title,
            description: description,
            email: authUser.email,
            name: authUser.fullName,
            impact: impact,
            isChanged: false
          }, route);
          res.status(201).send({ message: 'success' });
        }
        // if state has an error
      } else if (state.syncStatus === 6) {
        // set the state
        await setErrorState(state)
        res.status(201).send({ message: 'success' });

      } else {
        res.status(401).send({ message: 'record was not updated'});
      }
    }
  } catch (err) {
    res.status(500).send(err.message + 'here');
  }
};

const deleteSr = async (req, res, next) => {
  const srId = req.body.srId;
  const route = req.originalUrl;
  const stats = [4, 5, 6];

  try {
    const state = await findState(srId);
    if (!state) {
      // created state for deletion
      await createDeleteState(srId); 
      const ssr = await findSSRById(srId);
      const image = await findBlobById(ssr.id);
      await image.destroy();
      await ssr.destroy();
      res.status(201).json({ message: 'state does not exist, created a state with id 4 to delete' });
    } else {
      if (!stats.includes(state.syncStatus)) {
        const stateToUpdate = await findState(srId);
        await updateDeleteState(stateToUpdate);
        const ssr = await findSSRById(srId);
        const image = await findBlobById(ssr.id);
        await image.destroy();
        await ssr.destroy();
        res.status(201).json({ message: 'sysaid service request destroyed, status updated for deletion' });
      }
      res.status(401).json({ message: 'nothing to delete' });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = { createSr, editSr, deleteSr };
