"use strict";

var merge = require("lodash.merge"); // Merges objects together


var mergeNested = function mergeNested(obj, path, split, val) {
  var tokens = path.split(split);
  var temp = {};
  var temp2;
  temp["".concat(tokens[tokens.length - 1])] = val;

  for (var i = tokens.length - 2; i >= 0; i--) {
    temp2 = {};
    temp2["".concat(tokens[i])] = temp;
    temp = temp2;
  }

  return merge(obj, temp);
}; // https://stackoverflow.com/a/34890276/1837080


var groupByArray = function groupByArray(xs, key) {
  return xs.reduce(function (rv, x) {
    var v = key instanceof Function ? key(x) : x[key];
    var el = rv.find(function (r) {
      return r && r.key === v;
    });

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
};

module.exports = {
  mergeNested: mergeNested,
  groupByArray: groupByArray
};