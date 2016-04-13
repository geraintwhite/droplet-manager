var do_wrapper = require('do-wrapper');
var config = require('./config');

var dig = new do_wrapper(config.api_key);

var out = {};

out.get_snapshot_id = function(cb) {
  dig.imagesGetAll({private: true}, function(err, res, body) {
    cb(body.images.filter(function(image) {
      return (new RegExp(config.droplet.name+'-[0-9]+')).test(image.name);
    }).map(function(image) {
      return image.id;
    })[0]);
  });
};

out.create_from_snapshot = function(cb) {
  out.get_snapshot_id(function(id) {
    config.droplet.image = id;
    dig.dropletsCreate(config.droplet, function(err, res, body) {
      if (res.statusCode === 202) {
        config.droplet.id = body.droplet.id;
        cb(body.droplet.id);
      }
    });
  });
};

out.power_off_droplet = function(id, cb) {
  dig.dropletsRequestAction(id, {type: 'power_off'}, function(err, res, body) {
    cb(body.action.id);
  });
};

out.snapshot_droplet = function(id, cb) {
  dig.dropletsRequestAction(id, {
    type: 'snapshot',
    name: config.droplet.name + '-' + Date.now()
  }, function(err, res, body) {
    cb(body.action.id);
  });
};

out.destroy_droplet = function(id, cb) {
  dig.dropletsDelete(id, function(err, res, body) {
    cb(res.statusCode === 204);
  });
};

module.exports = out;
