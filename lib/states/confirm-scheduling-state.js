'use strict';

const util = require('../util');
const LoggedInState = require('./logged-in-state');

module.exports = class ConfirmSchedulingState extends LoggedInState {
  async execute(navigator, page, settings) {
    const captcha = navigator.handleCaptcha(this);

    await page.evaluate(async() => {
      document.querySelector('input.captchaConf').value = '';
    });

    const captchaResult = await captcha;
    const captchaText = captchaResult.text.toLowerCase();

    await page.type('input.captchaConf', settings.debugMode ? captchaText + 'err' : captchaText);

    this.logger.info('Clicking at Confirm button.');
    await this.navigate(navigator, page, settings, page.click('input.btnFinalConf'));

    const schedulingCode = await this.elementContent(page, '#ctl00_ContentPlaceHolder1_lblCodiceRichiesta');

    if (schedulingCode != null) {
      this.logger.info("Scheduling Confirmed successfully.");
      return navigator.changeState(navigator.states.billingState);
    }

    const failureText = await this.elementContent(page, '#ctl00_ContentPlaceHolder1_panelCaptcha > span')

    if (settings.debugMode) {
      this.logger.info('Finished the simulation in debug mode.')

      return;
    } else if (failureText == settings.messages.invalidCaptcha) {
      this.logger.info('Invalid captcha. Trying again.');
      await this.navigate(navigator, page, settings, page.reload(), false);

      return navigator.changeState(this);
    } else {
      this.logger.error('Unhandled Scenario, canceling and moving to the SelectDateState');
      await this.navigate(navigator, page, settings, page.click('input.btnFinalBack'));

      return navigator.changeState(navigator.states.selectDateState);
    }
  }
}
