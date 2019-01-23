'use strict';

const util = require('../util');

module.exports = class SelectDateState {
  async execute(navigator, page, settings) {
    const availableDays = await page.$$('td.calendarCellMed > input, td.calendarCellOpen > input');

    if (availableDays.length == 0) {
      console.log("There are no available dates in the selected month.");

      /*
        In this case we need to handle two possible situations:
          1) When the robot is looking for slots that will appear through scheduling (i.e midnight of italy)
             it should keep retrying until some date appear or a time limit is reached;
          2) When the robot is looking for suddenly opened slots, it should navigate through the calendar and 
             interrupt if not found any available dates;
      */
     
      const waitFor = Math.max(Math.min(util.waitingTimespan(settings), settings.maxWaitingTime), settings.minWaitingTime);
      console.log(`Waiting for ${waitFor / 1000} seconds to try again.`);

      return new Promise(async(resolve) => {
        setTimeout(resolve, waitFor);
      }).then(async () => {
        await util.retryable(page, settings, async() => page.reload());
        return navigator.changeState(navigator.states.selectDateState);
      });
    } 
    
    const selectedDay = util.sample(availableDays);

    const month = await page.evaluate(() => document.querySelector('tr.calTitolo > th > span').textContent);
    const day = await page.evaluate((el) => el.value, selectedDay);  
    
    console.log(`Selecting an available in ${day} of ${month}.`);

    await selectedDay.click();
    await util.retryable(page, settings, async() => page.waitForNavigation());

    return navigator.changeState(navigator.states.selectTimeState);
  }
}