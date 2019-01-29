var fs = require('fs');
const fsPromise = require('fs').promises;

module.exports = class FullDetailsTracker {
  constructor(guid, directory) {
    this.guid = guid;
    this.directory = directory;
  }

  async trackStateChange(page, previousState, currentState) {
    return this.track(page, `${previousState.constructor.name}-to-${currentState.constructor.name}`);
  }

  async trackError(page, err) {
    console.error(err);

    return this.track(page, `error`);
  }

  async track(page, filename) {
    filename = `${this.directory}/${new Date().getTime()}-${filename}`;

    const html = fsPromise.writeFile(`${filename}.html`, await page.content());
    const pdf = page.pdf({ path: `${filename}.pdf`, format: 'letter' }).catch(console.error);

    return Promise.all([html, pdf]);
  }

  static create(settings, guid) {
    const sessionDir = `${settings.trackPath}/${new Date().getTime()}-${guid}`;

    if (!fs.existsSync(sessionDir)) {
      fs.mkdirSync(sessionDir);
    }

    console.log(`Storing tracking data in ${sessionDir}`);
    return new FullDetailsTracker(guid, sessionDir);
  }
}
