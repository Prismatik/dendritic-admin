import { isPlainObject } from 'lodash';

exports.deepToFlat = function deepToFlat(obj) {
  let recurse, res;
  res = {};
  recurse = function(obj, current) {
    let key, newKey, results, value;
    results = [];
    for (key in obj) {
      value = obj[key];
      newKey = (current ? current + '.' + key : key);
      if (value && isPlainObject(value)) {
        results.push(recurse(value, newKey));
      } else {
        results.push(res[newKey] = value);
      }
    }
    return results;
  };
  recurse(obj);
  return res;
};
