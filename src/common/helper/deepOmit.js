const _ = require("lodash");
function omitDeep(obj, target) {
  _.forIn(obj, function (value, key) {
    if (_.isObject(value)) {
      omitDeep(value,target);
    } else if (key === target) {
      delete obj[key];
    }
  });
  return obj;
}
module.exports = { omitDeep };
