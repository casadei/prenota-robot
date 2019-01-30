var fs = require('fs');
const fsPromise = require('fs').promises;

module.exports = class FullDetailsTracker {
  constructor(logger, guid, directory) {
    this.logger = logger;
    this.guid = guid;
    this.directory = directory;
  }

  async trackStateChange(page, previousState, currentState) {
    return this.track(page, `${previousState.constructor.name}-to-${currentState.constructor.name}`);
  }

  async trackError(page, err) {
    this.logger.error(err);

    return this.track(page, `error`);
  }

  async track(page, filename) {
    filename = `${this.directory}/${new Date().getTime()}-${filename}`;

    const html = fsPromise.writeFile(`${filename}.html`, await page.content());
    const pdf = page.pdf({ path: `${filename}.pdf`, format: 'letter' }).catch(this.logger.error);

    return Promise.all([html, pdf]);
  }

  static create(logger, settings, guid) {
    const sessionDir = `${settings.trackPath}/${new Date().getTime()}-${guid}`;

    if (!fs.existsSync(sessionDir)) {
      fs.mkdirSync(sessionDir);
    }

    logger.info(`Storing tracking data in ${sessionDir}`);
    return new FullDetailsTracker(logger, guid, sessionDir);
  }
}
