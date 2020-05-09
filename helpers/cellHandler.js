const cellHandler = (cell) => {
  let res;
  if (cell !== '' || cell !== 'undefined' || cell != null) {
    if (cell.includes('+972')) {
      res = cell.replace('+972', '0');
      res = res.replace('-', '');
      res = res.replace('!', '');
    }
  }
  return res;
};

module.exports = { cellHandler }