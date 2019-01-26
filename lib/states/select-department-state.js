'use strict';

const LoggedInState = require('./logged-in-state');

module.exports = class SelectDepartmentState extends LoggedInState {
  async execute(navigator, page, settings, account) {
    //Sessione scaduta o utente non riconosciuto.

    console.log('Selecting the department.');

    const label = settings.consulates[account.consulate].departments[account.department].label;

    console.log(`Selecting department: ${label}`);
    await this.navigate(navigator, page, settings, page.click(`input[value="${label}"]`));

    return navigator.changeState(navigator.states.fillDepartmentFormState);
  }
}
