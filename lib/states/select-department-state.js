'use strict';

const LoggedInState = require('./logged-in-state');

module.exports = class SelectDepartmentState extends LoggedInState {
  async execute(navigator, page, settings, account) {
    const label = settings.consulates[account.consulate].departments[account.department].label;
    this.logger.info(`Selecting department: ${label}`);

    await this.navigate(navigator, page, settings, page.click(`input[value="${label}"]`));

    return navigator.changeState(navigator.states.fillDepartmentFormState);
  }
}
