#!/usr/bin/env node

'use strict';

require('dotenv').config()

const Navigator = require('./navigator');
const Tracker = require('./trackers/full-details-tracker');
const settings = require('../config/settings');
const account = require('../config/account');
const uuidv5 = require('uuid/v4');
const winston = require('winston');
const CloudWatchTransport = require('winston-aws-cloudwatch');
const AWS = require('aws-sdk');

(async() => {
  AWS.config.update({
    accessKeyId: settings.aws.key,
    secretAccessKey: settings.aws.secret,
    region: settings.aws.region
  });
  const sqs = new AWS.SQS();
  const s3 = new AWS.S3();

  const guid = uuidv5();

  const logger = winston.createLogger({
    level: settings.logLevel,
    transports: [
      new winston.transports.Console(
        {
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
            winston.format.errors(),
            winston.format.printf(info => {
              const base = `[${info.timestamp}] ${info.level}: ${info.message}`
              return !info.meta ? base : base + ` ${JSON.stringify(info.meta)}`;
            })
          ),
       }),
      new CloudWatchTransport({
        logGroupName: 'robot',
        logStreamName: guid,
        createLogGroup: true,
        createLogStream: true,
        submissionInterval: 2000,
        submissionRetryCount: 1,
        batchSize: 20,
        awsConfig: {
          accessKeyId: settings.aws.key,
          secretAccessKey: settings.aws.secret,
          region: settings.aws.region
        }
      })
    ]
  });

  try {
    /*
      ToDo: publish the beginning of the execution
    */

    const tracker = await Tracker.create(logger, settings, s3, guid);
    const navigator = await Navigator.create(logger, settings, account, tracker);

    const sendMessage = (queueUrl, json) => {
      const promise = sqs.sendMessage({
        QueueUrl: queueUrl,
        MessageBody: 'N/A',
        MessageAttributes: {
          'id': { DataType: 'String', StringValue: `${json.id}` },
          'text': { DataType: 'String', StringValue: json.text },
          'buffer': { DataType: 'Binary', BinaryValue: json.buffer }
        }
      }).promise();

      promise
        .then((data) => logger.info(`Message ${data.MessageId} sent to the topic ${queueUrl}`))
        .catch((err) => logger.error({ message: err, meta: { stack: err.stack } }));
    }

    navigator.on('captchaSolvedCorrectly', (captcha) => {
      sendMessage(settings.aws.captchaSolvedCorrectlySqs, captcha);
    });

    navigator.on('captchaSolvedIncorrectly', (captcha) => {
      sendMessage(settings.aws.captchaSolvedIncorrectlySqs, captcha);
    });

    const result = await navigator.execute();

    /*
      ToDo: publish the result (failed, aborted, completed) of the execution
    */

    return 1;
  } catch (err) {
    logger.error({ message: err, meta: { stack: err.stack } });
  }
})();
