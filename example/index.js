'use strict';

var Hapi = require('hapi');
var hapiVtree = require('hapi-vtree');
var humbleSession = require('humble-session');
var humbleFlash = require('../lib');
var h = require('virtual-dom/h');

var server = new Hapi.Server();

server.connection({ port: '7444' });

server.register([{
    register: require('simple-session-store')
  }, {
    register: humbleSession,
    options: {
      password: 'some-pass',
      isSecure: false,
      sessionStoreName: 'simple-session-store'
    }
  }, {
    register: humbleFlash
  }, {
    register: hapiVtree
  }], function(err) {
  if (err) {
    console.log('Failed to start server.');
    return;
  }

  server.route({
    method: 'GET',
    path: '/',
    config: {
      pre: [humbleFlash.createPreHandler('info')]
    },
    handler: function(req, reply) {
      reply.vtree(h('div', [
        h('div', [
          'Flash message: ',
          req.pre.info && req.pre.info[0]
        ]),
        h('form', { method: 'post' }, [
          h('input', { type: 'text', name: 'msg' }),
          h('button', { type: 'submit' }, 'create flash message')
        ])
      ]));
    }
  });

  server.route({
    method: 'POST',
    path: '/',
    handler: function(req, reply) {
      reply.flash('info', req.payload.msg, function() {
        reply.redirect('/');
      });
    }
  });

  server.start(function() {
    console.log('Server running at:', server.info.uri);
  });
});
