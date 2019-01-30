'use strict';

const util = require('../util');
const State = require('./state');

module.exports = class VisitLandingState extends State {
  async execute(navigator, page, settings, account) {
    this.logger.info('Opening landing page.');
    await this.goto(page, settings, this.url(settings, account));

    this.logger.info('Clicking at the Existing Account button.');
    await this.navigate(navigator, page, settings, page.click('#BtnLogin'));

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
