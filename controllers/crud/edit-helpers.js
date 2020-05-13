const STATE = require('../../models/state');
const createEditState = async (srId) => {
  await STATE.create({
    srId: srId,
    syncStatus: 2,
    syncStatusName: "waiting update sync",
    syncUpdated: new Date(),
  });
};

const updateEditState = async (state) => {
  state.syncStatus = 2;
  state.syncStatusName = "waiting update sync";
  state.syncUpdated = new Date();
  await state.update();
};

const setErrorState = async (state) => {
  state.syncStatus = 6;
  state.syncStatusName = "error";
  state.syncUpdated = new Date();
  await state.update();
};

const updateSSR = async (
  updatedSSR,
  title,
  description,
  impact,
  klhModule,
  status
) => {
  updatedSSR.title = title;
  updatedSSR.description = description;
  updatedSSR.impact = impact;
  updatedSSR.sr_cust_module = klhModule;
  updatedSSR.status = status;
  updatedSSR.update_time = new Date();

  await updatedSSR.save();
};
module.exports = { createEditState, updateSSR, updateEditState, setErrorState };
