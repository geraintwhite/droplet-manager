var do_wrapper = require('do-wrapper');
var config = require('./config');

var dig = new do_wrapper(config.api_key);
var log = function(err, res, body) { console.log(err || body); };

var d = {};

d.get_snapshot_id = function(cb) {
  dig.imagesGetAll({private:true}, function(err, res, body) {
    if (err) throw err;
    cb(body.images.filter(function(image) {
      return (new RegExp(config.droplet.name+'-[0-9]+')).test(image.name);
    }).map(function(image) {
      return image.id;
    })[0]);
  });
};

d.create_from_snapshot = function(cb) {
  d.get_snapshot_id(function(id) {
    config.droplet.image = id;
    dig.dropletsCreate(config.droplet, function(err, res, body) {
      if (err) throw err;
      cb(body.id);
    });
  });
};

module.exports = d;
