const createDeleteState = async (srId) => {
  await STATE.create({
    srId: srId,
    syncStatus: 4,
    syncStatusName: "delete",
    syncUpdated: new Date(),
  });
};

const updateDeleteState = async (stateToUpdate) => {
  stateToUpdate.syncStatus = 4;
  stateToUpdate.syncStatusName = "delete";
  await stateToUpdate.save();
};

module.exports = { createDeleteState, updateDeleteState };
