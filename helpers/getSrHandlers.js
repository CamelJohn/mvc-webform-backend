const getAllOpenSr = (res, sr) => {
  const allSr = sr.filter((sr) => sr.status !== 3); // all sr's with status other than 3 => open only
  if (allSr.length !== 0) {
    res.status(201).send({ data: allSr });
  } else {
    res.status(404).send({ message: 'no service requests' });
  }
}; // refactored open service requests (all, specific user)

const getAllClosedSr = (res, sr) => {
  const allSr = sr.filter((sr) => sr.status === 3); // all sr's with status other than 3 => closed only
  if (allSr.length !== 0) {
    res.status(201).send({ data: allSr });
  } else {
    res.status(404).send({ message: 'no service requests' });
  }
}; // refactored closed service requests (all, specific user)

const getAllUserSr = (res, sr) => {
  if (sr.length !== 0) {
    res.status(201).send({ data: sr });
  } else {
    res.status(404).send({ message: 'no service requests' });
  }
}; // refactored all service requests (specific user)

const mergeBlobAndServiceReq = (sr, blob) => {
  const s = sr;
  const b = blob;
  let merged = [];
  s.map((ssr, id) => {
    if (ssr.id === b[id].srId) {
      merged.push({ ...ssr, blobName: b[id].blobName, containerName: b[id].containerName })
    } else {
      merged.push({ ...ssr, blobName: null, containerName: null })
    }
  })
  return merged;
}

module.exports = { getAllOpenSr, getAllClosedSr, getAllUserSr, mergeBlobAndServiceReq };