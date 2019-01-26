'use strict';

const State = require('./state');

module.exports = class LoggedInState extends State {
  async navigate(navigator, page, settings, action, waitForNavigation = true) {
    return super.navigate(navigator, page, settings, action, waitForNavigation)
      .then(async() => {
        if (page.url().startsWith('https://prenotaonline.esteri.it/Login.aspx')) {
          console.log('Logged out by session timeout. Moving back to the VisitLandingState');

          return navigator.changeState(navigator.states.visitLandingState);
        }

        const failureText = await this.failureText(page);

        if (failureText && failureText == settings.messages.securityLogout) {
          console.log('Logged out for security reasons. Moving back to the VisitLandingState');

          return navigator.changeState(navigator.states.visitLandingState);
        }
      });
  }
}
