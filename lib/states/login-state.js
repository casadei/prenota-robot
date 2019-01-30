'use strict';

const util = require('../util');
const State = require('./state');

module.exports = class LoginState extends State {
  async execute(navigator, page, settings, account) {
    const captcha = navigator.handleCaptcha(this);

    await page.evaluate(async() => {
      document.querySelector('input#UserName').value = '';
      document.querySelector('input#Password').value = '';
      document.querySelector('input#loginCaptcha').value = '';
    });

    await page.type('input#UserName', account.username);
    await page.type('input#Password', account.password);
    await page.type('input#loginCaptcha', (await captcha).text.toLowerCase());

    console.log('Clicking at Login button.');
    await this.navigate(navigator, page, settings, page.click('#BtnConfermaL'));

    if (page.url() == 'https://prenotaonline.esteri.it/acc_Prenota.aspx') {
      console.log('Logged in.');

      return navigator.changeState(navigator.states.selectDepartmentState);
    }

    const failureText = await this.elementContent(page, '#FailureText', '');

    if (failureText == settings.messages.invalidCaptcha) {
      console.log('Invalid captcha. Trying again.');

      return navigator.changeState(this);
    } else if (failureText.startsWith(settings.messages.invalidPassword) || failureText.endsWith(settings.messages.invalidUsername)) {
      console.log(`Aborting: invalid credentials (${failureText})`);

      return navigator.changeState(navigator.states.nullState);
    }

    throw 'UnknownScenario';
  }
}
