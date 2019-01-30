'use strict';

const util = require('../util');
const LoggedInState = require('./logged-in-state');

module.exports = class SelectDateState extends LoggedInState {
  async execute(navigator, page, settings) {
    const availableDays = await page.$$('td.calendarCellMed > input, td.calendarCellOpen > input');

    if (availableDays.length == 0) {
      this.logger.warn("There are no available dates in the selected month.");

      /*
        In this case we need to handle two possible situations:
          1) When the robot is looking for slots that will appear through scheduling (i.e midnight of italy)
             it should keep retrying until some date appear or a time limit is reached;
          2) When the robot is looking for suddenly opened slots, it should navigate through the calendar and
             interrupt if not found any available dates;
      */

      const waitFor = Math.max(
        Math.min(util.waitingTimespan(settings), settings.maxWaitingTime),
        settings.minWaitingTime
      );

      this.logger.info(`Waiting for ${waitFor / 1000} seconds to try again.`);

      return new Promise(async(resolve) => {
        setTimeout(resolve, waitFor);
      }).then(async () => {
        await this.navigate(navigator, page, settings, page.reload(), false);
        return navigator.changeState(navigator.states.selectDateState);
      });
    }

    const selectedDay = util.sample(availableDays);

    const month = await page.evaluate(() => document.querySelector('tr.calTitolo > th > span').textContent);
    const day = await page.evaluate((el) => el.value, selectedDay);

    this.logger.info(`Selecting an available in ${day} of ${month}.`);
    await this.navigate(navigator, page, settings, selectedDay.click());

    return navigator.changeState(navigator.states.selectTimeState);
  }
}
