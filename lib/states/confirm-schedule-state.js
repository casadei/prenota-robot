'use strict';

const util = require('../util');

module.exports = class ConfirmScheduleState {
  async execute(navigator, page, settings) {
    const captcha = navigator.captchaPromise.catch(async(err) => {
      console.log("Error trying to solve the captcha. Trying again.");
      await util.retryable(page, settings, async() => page.reload());
      return navigator.changeState(navigator.states.confirmScheduleState)
  });

    await page.evaluate(async() => {
      document.querySelector('input.captchaConf').value = '';
    });

    const captchaResult = await captcha;
    const captchaText = captchaResult.text;

    await page.type('input.captchaConf', settings.debugMode ? captchaText + 'err' : captchaText);

    console.log('Clicking at Confirm button.');
    await page.click('input.btnFinalConf');
    await util.retryable(page, settings, async() => page.waitForNavigation());

    const failureText = await page.evaluate(() => {
      const el = document.querySelector('#ctl00_ContentPlaceHolder1_panelCaptcha > span');
      return el ? el.textContent.trim() : null;
    });

    if (!settings.debugMode && failureText == settings.messages.invalidCaptcha) {
      console.log('Invalid captcha. Trying again.');
      return navigator.changeState(navigator.states.confirmScheduleState)
    }

    //ToDo: figure out how to check the success case;
    //Todo: figure out how to check the slot already taken case;

    throw 'UnknownScenario';
  }
}