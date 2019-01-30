var fs = require('fs');
const fsPromise = require('fs').promises;

module.exports = class FullDetailsTracker {
  constructor(logger, settings, s3, guid, path) {
    this.logger = logger;
    this.settings = settings;
    this.s3 = s3;
    this.guid = guid;
    this.path = path;
  }

  async trackStateChange(page, previousState, currentState) {
    return this.track(page, `${previousState.constructor.name}-to-${currentState.constructor.name}`);
  }

  async trackError(page, err) {
    return this.track(page, `error`);
  }

  async track(page, filename) {
    filename = `${this.path}/${new Date().getTime()}-${filename}`;

    this.putObject(`${filename}.html`, await page.content());
    this.putObject(`${filename}.pdf`, await page.pdf({ format: 'letter' }))
  }

  async putObject(key, body) {
    const params = {
      Bucket: this.settings.aws.bucket,
      Key: key,
      Body: body
    };

    return this.s3.putObject(params).promise()
      .then((data) => {
        this.logger.info('Tracking file has been successfully uploaded to S3');
      })
      .catch((err) => {
        this.logger.error({ message: 'Could not save file to S3.', meta: { stack: err.stack } });
      }
    );
  }

  static create(logger, settings, s3, guid) {
    const path = `tracking/${guid}`;

    logger.info(`Storing tracking data in s3://${settings.aws.bucket}/${path}`);
    return new FullDetailsTracker(logger, settings, s3, guid, path);
  }
}
