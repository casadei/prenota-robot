'use strict';

const states = require('./states');
const util = require('./util');
const puppeteer = require('puppeteer');

module.exports = class Navigator {
  constructor(browser, page, settings, account, tracker) {
    this.states = {
      nullState: new states.NullState(),
      visitLandingState: new states.VisitLandingState(),
      loginState: new states.LoginState(),
      selectDepartmentState: new states.SelectDepartmentState(),
      fillDepartmentFormState: new states.FillDepartmentFormState(),
      selectDateState: new states.SelectDateState(),
      selectTimeState: new states.SelectTimeState(),
      confirmScheduleState: new states.ConfirmScheduleState()
    };

    this.browser = browser;
    this.page = page;
    this.settings = settings;
    this.account = account;
    this.tracker = tracker;
    this.state = this.states.nullState;
    this.captchaPromise = null;
  }

  async execute() {
    console.log('Initializing navigator robot');

    await this.page.setRequestInterception(true);

    this.page.on('request', request => {
      const type = request.resourceType();

      if (type == 'document' || type == 'image' && request.url().includes('captcha/default.aspx')) {
        request.continue();
      } else {
        request.abort();
      }
    });

    this.page.on('response', async(response) => {
      if (response.url().includes('captcha/default.aspx')) {
        this.captchaPromise = util.resolveCaptcha(this.settings, response.buffer());
      }
    });

    const tracker = this.tracker;
    await this.changeState(this.states.visitLandingState).catch(async(err) => {
      await tracker.trackError(this.page, err);
    });

    await this.captchaPromise;

    console.log('Navigator robot finished.');
    await this.browser.close();
  }

  async changeState(newState) {
    const previousState = this.state;
    console.log(`Changing state from ${this.state.constructor.name} to ${newState.constructor.name}.`);

    this.state = newState;

    await this.tracker.trackStateChange(this.page, previousState, this.state);
    await this.state.execute(this, this.page, this.settings, this.account);
  }

  static async create(settings, account, tracker) {
    const browser = await puppeteer.launch(settings.browser.launchOptions);
    const page = await browser.newPage();

    return new Navigator(browser, page, settings, account, tracker);
  }
}
