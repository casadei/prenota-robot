'use strict';

const util = require('./util');
const states = require('./states');
const puppeteer = require('puppeteer');
const EventEmitter = require('events');

module.exports = class Navigator extends EventEmitter {
  constructor(logger, browser, page, settings, account, tracker) {
    super();

    this.states = {
      nullState: new states.NullState(logger),
      visitLandingState: new states.VisitLandingState(logger),
      loginState: new states.LoginState(logger),
      selectDepartmentState: new states.SelectDepartmentState(logger),
      fillDepartmentFormState: new states.FillDepartmentFormState(logger),
      selectDateState: new states.SelectDateState(logger),
      selectTimeState: new states.SelectTimeState(logger),
      confirmSchedulingState: new states.ConfirmSchedulingState(logger),
      billingState: new states.BillingState(logger)
    };

    this.logger = logger;
    this.browser = browser;
    this.page = page;
    this.settings = settings;
    this.account = account;
    this.tracker = tracker;
    this.state = this.states.nullState;
    this.stateTransitions = [];
    this.captchaPromise = null;
  }

  async execute() {
    this.logger.info('Initializing navigator robot');

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
        this.captchaPromise = response.buffer();
      }
    });

    const tracker = this.tracker;
    await this.changeState(this.states.visitLandingState).catch(async(err) => {
      this.logger.error({ message: err, meta: { stack: err.stack } });
      await tracker.trackError(this.page, err);
    });

    await this.captchaPromise;

    this.logger.info('Navigator robot finished.');
    await this.browser.close();
  }

  async changeState(newState) {
    const previousState = this.state;

    this.logger.info(`Changing state from ${this.state.constructor.name} to ${newState.constructor.name}.`);

    this.state = newState;
    this.stateTransitions.push(newState.constructor.name);

    await this.tracker.trackStateChange(this.page, previousState, this.state);
    await this.state.execute(this, this.page, this.settings, this.account);
  }

  async handleCaptcha(state) {
    return this.captchaPromise
      .then(async(buffer) => util.resolveCaptcha(this.logger, this.settings, buffer))
      .catch(async(err) => {
        this.logger.info("Error trying to solve the captcha. Trying again.");
        this.logger.error({ message: err, meta: { stack: err.stack } });

        await state.navigate(this, this.page, this.settings, Promise.resolve(), false);
        return this.changeState(state);
    });
  }

  static async create(logger, settings, account, tracker) {
    const browser = await puppeteer.launch(settings.browser.launchOptions);
    const page = await browser.newPage();

    return new Navigator(logger, browser, page, settings, account, tracker);
  }
}
