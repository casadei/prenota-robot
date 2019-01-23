'use strict';

const util = require('../util');

module.exports = class VisitLandingState {
  async execute(navigator, page, settings, account) {
    console.log('Opening landing page.');
    await util.retryable(page, settings, async() => page.goto(this.url(settings, account)), false);

    console.log('Clicking at the Existing Account button.');
    await page.click('#BtnLogin');
    await util.retryable(page, settings, async() => page.waitForNavigation());

    /*
      ToDo: check if the login panel have been shown
      I am suspecting they show a page when the rate limit is exceed. 
      This page says that something goes wrong, and we need to go back to the landing page;
      We might need to do that checking after ALL requests;
    */

    return navigator.changeState(navigator.states.loginState);
  }

  url(settings, account) {
    const code = settings.consulates[account.consulate].code;

    return `https://prenotaonline.esteri.it/login.aspx?cidsede=${code}&ReturnUrl=%2facc_Prenota.aspx`
  }
}
