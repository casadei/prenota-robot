'use strict';

const State = require('./state');

module.exports = class LoggedInState extends State {
  async navigate(navigator, page, settings, action, waitForNavigation = true) {
    return super.navigate(navigator, page, settings, action, waitForNavigation)
      .then(async() => {
        if (page.url().startsWith('https://prenotaonline.esteri.it/Login.aspx')) {
          this.logger.info('Logged out by session timeout. Moving back to the VisitLandingState');

          return navigator.changeState(navigator.states.visitLandingState);
        }
      });
  }
}
