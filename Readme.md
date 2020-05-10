# **Mvc Service Requests**

## **Upon Installation**

```
whilst installing node_modules you need to change a folder in the sequelize lib :

node_modules/sequelize/lib/data-types.js => 
```

```javascript
DATE.prototype._stringify = function _stringify(date, options) {
  date = this._applyTimezone(date, options);

  // Z here means current timezone, _not_ UTC
  // return date.format('YYYY-MM-DD HH:mm:ss.SSS Z');
  return date.format('YYYY-MM-DD HH:mm:ss.SSS');
};
```