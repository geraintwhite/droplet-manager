var do_wrapper = require('do-wrapper');
var config = require('./config');

var dig = new do_wrapper(config.api_key);

var out = {};

out.get_snapshot_id = function(cb) {
  dig.imagesGetAll({private:true}, function (err, res, body) {
    if (err) throw err;
    cb(body.images.filter(function (image) {
      return (new RegExp(config.droplet.name+'-[0-9]+')).test(image.name);
    }).map(function (image) {
      return image.id;
    })[0]);
  });
};

out.create_from_snapshot = function(cb) {
  get_snapshot_id(function (id) {
    config.droplet.image = id;
    dig.dropletsCreate(config.droplet, function (err, res, body) {
      if (err) throw err;
      cb(body.id);
    });
  });
};

