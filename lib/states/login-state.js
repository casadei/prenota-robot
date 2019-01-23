'use strict';

const util = require('../util');

module.exports = class LoginState {
  async execute(navigator, page, settings, account) {    
    const captcha = navigator.captchaPromise.catch(async(err) => {
        console.log("Error trying to solve the captcha. Trying again.");
        await util.retryable(page, settings, async() => page.reload());
        return navigator.changeState(navigator.states.loginState)
    });
    
    await page.evaluate(async() => {
      document.querySelector('input#UserName').value = '';
      document.querySelector('input#Password').value = '';
      document.querySelector('input#loginCaptcha').value = '';
    });

    await Promise.all([
      await page.type('input#UserName', account.username),
      await page.type('input#Password', account.password),
      await page.type('input#loginCaptcha', (await captcha).text)
    ]);

    console.log('Clicking at Login button.');
    await page.click('#BtnConfermaL');
    await util.retryable(page, settings, async() => page.waitForNavigation());

    if (page.url() == 'https://prenotaonline.esteri.it/acc_Prenota.aspx') {
      console.log('Logged in.');
      return navigator.changeState(navigator.states.selectDepartmentState);
    } 

    const failureText = await page.evaluate(() => {
      const el = document.querySelector('#FailureText') 
      return el ? el.textContent : null;
    });
    
    if (failureText == settings.messages.invalidCaptcha) {
      console.log('Invalid captcha. Trying again.');
      return navigator.changeState(navigator.states.loginState);
    } else if (failureText.startsWith(settings.messages.invalidPassword) || failureText.endsWith(settings.messages.invalidUsername)) {
      console.log(`Aborting: invalid credentials (${failureText})`);
      return navigator.changeState(navigator.states.nullState);
    } 
    
    throw 'UnknownScenario';
  }
}