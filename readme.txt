###1

whilst installing node_modules you need to change a folder in the sequelize lib :

sequelize/lib/data-types.js => 

DATE.prototype._stringify = function _stringify(date, options) {
  date = this._applyTimezone(date, options);

  // Z here means current timezone, _not_ UTC
  // return date.format('YYYY-MM-DD HH:mm:ss.SSS Z');
  return date.format('YYYY-MM-DD HH:mm:ss.SSS');
};

###2

need to install bcrypt on cloud before runing the code since bcrypt was installed in the wrond compatability (64 instead of 32 or something like that)