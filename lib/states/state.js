'use strict';

const promiseRetry = require('promise-retry');

/*
  Known errors:
  ERR_CONNECTION_RESET
  CaptchaNotYetAvailable
  TimeoutError
*/

module.exports = class State {
  async goto(page, settings, url) {
    return promiseRetry(settings.browser.retryOptions, async(retry, attempt) => {
      console.log(`Opening url ${url}. Attempt number ${attempt}`);

      return page.goto(url, settings.browser.navigationOptions)
        .catch(async(err) => {
          console.error(err);

          retry(err);
      });
    });
  }

  async navigate(navigator, page, settings, action, waitForNavigation = true) {
    await action;

    return promiseRetry(settings.browser.retryOptions, async(retry, attempt) => {
      console.log(`Making a request to the server. Attempt number ${attempt}`);

      const retryAction = waitForNavigation && attempt == 1
        ? page.waitForNavigation(settings.browser.navigationOptions)
        : page.reload(settings.browser.navigationOptions);

      return retryAction
        .catch(async(err) => {
          console.error(err);

          await navigator.captchaPromise;
          retry(err);
        });
    });
  }

  async failureText(page) {
    return page.evaluate(async() => {
      const el = document.querySelector('#FailureText')
      return el ? el.textContent.trim() : '';
    });
  }
}
