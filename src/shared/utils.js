const merge = require("lodash.merge");

// Merges objects together
const mergeNested = function (obj, path, split, val) {
  let tokens = path.split(split);
  let temp = {};
  let temp2;
  temp[`${tokens[tokens.length - 1]}`] = val;
  for (var i = tokens.length - 2; i >= 0; i--) {
    temp2 = {};
    temp2[`${tokens[i]}`] = temp;
    temp = temp2;
  }
  return merge(obj, temp);
}

// https://stackoverflow.com/a/34890276/1837080
const groupByArray = function(xs, key) {
  return xs.reduce(function (rv, x) {
    let v = key instanceof Function ? key(x) : x[key];
    let el = rv.find((r) => r && r.key === v);
    if (el) {
      el.values.push(x);
    } else {
      rv.push({
        key: v,
        values: [x]
      });
    }
    return rv;
  }, []);
}

module.exports = {
  mergeNested,
  groupByArray,
}