'use strict';

var expect = require('chai').expect;
var Hapi = require('hapi');
var humbleFlash = require('../lib');
var humbleSession = require('humble-session');
var simpleSessionStore = require('simple-session-store');

describe('humble-flash', function() {
  it('sets/gets flash messages', function(done) {
    var cookieName = 'sid';
    var server = new Hapi.Server();
    server.connection();

    server.register([{
      register: simpleSessionStore
    }, {
      register: humbleSession,
      options: {
        cookie: cookieName,
        password: 'some-password',
        sessionStoreName: 'simple-session-store'
      }
    }, {
      register: humbleFlash
    }], function(err) {
      expect(err).to.not.exist;

      server.route({
        method: 'GET',
        path: '/set-flash/{msg}',
        config: {
          handler: function(request, reply) {
            reply.flash('info', request.params.msg, function(err) {
              expect(err).to.not.exist;
              return reply(request.params.msg);
            });
          }
        }
      });

      server.route({
        method: 'GET',
        path: '/resource',
        config: {
          pre: [humbleFlash.createPreHandler('info')],
          handler: function(request, reply) {
            expect(request.pre.info[0]).to.eq('valid');
            done();
          }
        }
      });

      server.inject('/set-flash/valid', function(res) {
        expect(res.result).to.equal('valid');
        var header = res.headers['set-cookie'];
        expect(header.length).to.equal(1);
        expect(header[0]).to.contain(cookieName + '=');
        var cookie = header[0].match(/(?:[^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)\s*=\s*(?:([^\x00-\x20\"\,\;\\\x7F]*))/);

        server.inject({
          method: 'GET',
          url: '/resource',
          headers: {
            cookie: cookieName + '=' + cookie[1]
          }
        }, function() {});
      });
    });
  });
});
