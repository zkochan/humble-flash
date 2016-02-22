# humble-flash

Flash message plugin for [humble-session](https://github.com/zkochan/humble-session) and [hapi](http://hapijs.com/).

[![Dependency Status](https://david-dm.org/zkochan/humble-flash/status.svg?style=flat)](https://david-dm.org/zkochan/humble-flash)
[![Build Status](https://travis-ci.org/zkochan/humble-flash.svg?branch=master)](https://travis-ci.org/zkochan/humble-flash)
[![npm version](https://badge.fury.io/js/humble-flash.svg)](http://badge.fury.io/js/humble-flash)


## Installation

```
npm i --save humble-flash
```


## Usage

**Note.** This module requires [humble-session](https://github.com/zkochan/humble-session) to be
registered as well.

**TODO: write usage example**


## API

* [`reply.flash`](#flash)
* [`createPreHandler`](#createPreHandler)


<a name="flash" />
### reply.flash(type, message, cb)

Adds a new flash message of a specified type to the session.

__Arguments__

`type` - String - The type of the flash message.
`message` - String - The text of the message.
`cb(err)` - Function - A function that is called once the flash message was saved
to the session.


<a name="createPreHandler" />
### createPreHandler(type)

Creates a pre-handler that fetches the messages of the specified type from the
session and removes them from it.

__Arguments__

`type` - String - The type of the messages to return.

__Usage__

```js
var humbleFlash = require('humble-flash');

// ...
server.route({
  method: 'GET',
  path: '/',
  config: {
    pre: [humbleFlash.createPreHandler('info')]
  },
  handler: function(request, reply) {
    reply(request.pre.info);
  }
});
```


## License

MIT © [Zoltan Kochan](https://www.kochan.io)
