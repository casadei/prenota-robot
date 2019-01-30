'use strict';

const util = require('../util');
const LoggedInState = require('./logged-in-state');

module.exports = class SelectTimeState extends LoggedInState {
  async execute(navigator, page, settings) {
    const table = await page.$('#tblFasce')
    const availableTimes = await table.$$('input');

    if (availableTimes.length == 0) {
      this.logger.warn("There are no available times in the selected day.");
      return navigator.changeState(navigator.states.selectDateState);
    }

    const selectedTime = util.sample(availableTimes);

    const label = await page.evaluate(el => {
      const row = el.parentNode.parentNode;
      return row.querySelector('label').innerText;
    }, selectedTime);

    this.logger.info(`Selecting time ${label}.`)
    await this.navigate(navigator, page, settings, selectedTime.click());

    return navigator.changeState(navigator.states.confirmSchedulingState);
  }
}
