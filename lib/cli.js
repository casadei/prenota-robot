#!/usr/bin/env node

'use strict';

require('dotenv').config()

const Navigator = require('./navigator');
const Tracker = require('./trackers/full-details-tracker');
const settings = require('../config/settings');
const account = require('../config/account');
const uuidv5 = require('uuid/v4');
const winston = require('winston');

(async() => {
  const logger = winston.createLogger({
    level: settings.logLevel,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
      winston.format.errors(),
      winston.format.printf(info => {
        const base = `[${info.timestamp}] ${info.level}: ${info.message}`
        return !info.meta ? base : base + ` ${JSON.stringify(info.meta)}`;
      })
    ),
    transports: [
      new winston.transports.Console()
    ]
  });

  try {
    const tracker = await Tracker.create(logger, settings, uuidv5());
    const navigator = await Navigator.create(logger, settings, account, tracker);

    await navigator.execute();

    return 1;
  } catch (err) {
    logger.error(err);
  }
})();
