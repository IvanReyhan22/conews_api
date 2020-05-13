'use strict';

exports.ok = function(values, res) {
  var data = {
      'status': true,
      'message' : "success",
      'values': values
  };
  res.json(data);
  res.end();
};

exports.err = function(error,res) {
  var data = {
      'status': false,
      'message' : "failed",
      'values': error
  };
  res.json(data);
  res.end();
};