'use strict';

module.exports = function(type) {
  if (!type) {
    throw new Error('type is required');
  }

  return {
    assign: type,
    method: function(req, reply) {
      req.getSession(function(err, session) {
        if (err) {
          throw err;
        }

        var messages = session && session.flash && session.flash[type];

        if (messages) {
          delete session.flash[type];

          reply.setSession(session, function() {});
        }

        reply(messages);
      });
    }
  };
};
