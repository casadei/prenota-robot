'use strict';

const util = require('../util');

module.exports = class SelectTimeState {
  async execute(navigator, page, settings) {
    const table = await page.$('#tblFasce')
    const availableTimes = await table.$$('input');

    if (availableTimes.length == 0) {
      console.log("There are no available times in the selected day.");
      return navigator.changeState(navigator.states.selectDateState);
    }

    const selectedTime = util.sample(availableTimes);

    const label = await page.evaluate(el => {
      const row = el.parentNode.parentNode;
      return row.querySelector('label').innerText;
    }, selectedTime);     
    
    console.log(`Selecting time ${label}.`)

    await selectedTime.click();
    await util.retryable(page, settings, async() => page.waitForNavigation());

    return navigator.changeState(navigator.states.confirmScheduleState);
  }
}
