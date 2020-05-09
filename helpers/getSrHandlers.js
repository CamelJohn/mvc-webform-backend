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

module.exports = { getAllOpenSr, getAllClosedSr, getAllUserSr };