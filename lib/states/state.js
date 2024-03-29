'use strict';

const promiseRetry = require('promise-retry');

/*
  Known errors:
  ERR_CONNECTION_RESET
  CaptchaNotYetAvailable
  TimeoutError
*/

module.exports = class State {
  constructor(logger) {
    this.logger = logger;
  }

  async goto(page, settings, url) {
    return promiseRetry(settings.browser.retryOptions, async(retry, attempt) => {
      this.logger.info(`Opening url ${url}. Attempt number ${attempt}`);

      return page.goto(url, settings.browser.navigationOptions)
        .then(async(response) => {
          const body = response ? (await response.text()) : null;

          if (body == null || body == '<html><head></head><body></body></html>')
            throw 'InvalidResponse';

          return response;
        })
        .catch(async(err) => {
          this.logger.error({ message: err, meta: { stack: err.stack } });

          retry(err);
      });
    }).catch((err) => {
      throw 'ExhaustedRetryAttempts';
    });
  }

  async navigate(navigator, page, settings, action, waitForNavigation = true) {
    await action;

    return promiseRetry(settings.browser.retryOptions, async(retry, attempt) => {
      this.logger.info(`Making a request to the server. Attempt number ${attempt}`);

      const retryAction = waitForNavigation && attempt == 1
        ? page.waitForNavigation(settings.browser.navigationOptions)
        : page.reload(settings.browser.navigationOptions);

      return retryAction
        .then(async(response) => {
          const body = response ? (await response.text()) : null;

          if (body == null || body == '<html><head></head><body></body></html>')
            throw 'InvalidResponse';

          return response;
        })
        .catch(async(err) => {
          this.logger.error({ message: err, meta: { stack: err.stack } });

          await navigator.captchaPromise;
          retry(err);
        });
    }).catch((err) => {
      throw 'ExhaustedRetryAttempts';
    });
  }

  async elementContent(page, selector, defaultValue = null) {
    return page.evaluate(async(selector, defaultValue) => {
      const el = document.querySelector(selector);
      return el ? el.textContent.trim() : defaultValue;
    }, selector, defaultValue);
  }
}
