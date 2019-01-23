'use strict';

const util = require('../util');

module.exports = class FillDepartmentFormState {
  async execute(navigator, page, settings, account) {
    const buttons = settings.consulates[account.consulate].departments.buttons
    const fields = settings.consulates[account.consulate].departments[account.department].fields;

    for (let i = 0; i < fields.length; i++) {
      await page.type(fields[i], account.departmentData[i]);
    }

    await page.click(buttons.confirm);
    await util.retryable(page, settings, async() => page.waitForNavigation());

    return navigator.changeState(navigator.states.selectDateState);
  }
}
