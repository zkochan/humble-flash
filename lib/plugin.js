'use strict';

exports.register = function(plugin, opts, next) {
  plugin.decorate('reply', 'flash', function(type, msg, cb) {
    cb = cb || function() {};
    var reply = this;

    if (!type) {
      return cb(new Error('type is required.'));
    }
    if (!msg) {
      throw new Error('msg is required.');
    }

    reply.request.getSession(function(err, session) {
      if (err) {
        return cb(err);
      }

      session.flash = session.flash || {};
      session.flash[type] = session.flash[type] || [];
      session.flash[type].push(msg);

      reply.setSession(session, function(err) {
        if (err) {
          return cb(err);
        }

        cb();
      });
    });
  });

  next();
};

exports.register.attributes = {
  pkg: require('../package.json')
};
