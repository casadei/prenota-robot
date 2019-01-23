#!/usr/bin/env node

'use strict';

const Navigator = require('./navigator');
const settings = require('../config/settings');
const account = require('../config/account');

(async() => {
  try {
    const log = console.log;

    console.log = (s) => {
      log(new Date().toISOString() + ':', s);
    }

    const navigator = await Navigator.create(settings, account);
    await navigator.execute();
    
    return 1;
  } catch (err) {
    console.error(err);
  }
})();
