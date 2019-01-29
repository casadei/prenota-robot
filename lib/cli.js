#!/usr/bin/env node

'use strict';

require('dotenv').config()

const Navigator = require('./navigator');
const Tracker = require('./trackers/full-details-tracker');
const settings = require('../config/settings');
const account = require('../config/account');
const uuidv5 = require('uuid/v4');

(async() => {
  try {
    const log = console.log;

    console.log = (s) => {
      log(new Date().toISOString() + ':', s);
    }

    const tracker = await Tracker.create(settings, uuidv5());
    const navigator = await Navigator.create(settings, account, tracker);
    await navigator.execute();

    return 1;
  } catch (err) {
    console.error(err);
  }
})();
