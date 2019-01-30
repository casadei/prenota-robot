'use strict';

const LoggedInState = require('./logged-in-state');

module.exports = class FillDepartmentFormState extends LoggedInState {
  async execute(navigator, page, settings, account) {
    const buttons = settings.consulates[account.consulate].departments.buttons
    const fields = settings.consulates[account.consulate].departments[account.department].fields;

    for (let i = 0; i < fields.length; i++) {
      await page.type(fields[i], account.departmentData[i]);
    }

    this.logger.info('Submitting department form.');
    await this.navigate(navigator, page, settings, account, page.click(buttons.confirm))

    return navigator.changeState(navigator.states.selectDateState);
  }
}
