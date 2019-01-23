'use strict';

const util = require('../util');

module.exports = class SelectDepartmentState {
  async execute(navigator, page, settings, account) {
    //Sessione scaduta o utente non riconosciuto.

    console.log('Selecting the department.');

    const label = settings.consulates[account.consulate].departments[account.department].label;

    console.log(`Selecting department: ${label}`);

    await page.click(`input[value="${label}"]`);
    await util.retryable(page, settings, async() => page.waitForNavigation());

    return navigator.changeState(navigator.states.fillDepartmentFormState);
  }
}
