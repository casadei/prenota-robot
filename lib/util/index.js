const promiseRetry = require('promise-retry');
const request=  require('request-promise');

/*
  Known errors:
  ERR_CONNECTION_RESET
  CaptchaNotYetAvailable
  TimeoutError
*/

module.exports = {};

module.exports.resolveCaptcha = async(logger, settings, buffer) => {
  const data = Buffer.from(buffer).toString('base64');

  return promiseRetry(settings.captcha.retryOptions, async(retry, attempt) => {
    logger.info(`Trying to solve a captcha. Attempt number ${attempt}`);

    return request({
      method: 'POST',
      uri: settings.captcha.uri,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
      },
      formData: {
        'username': settings.captcha.user,
        'password': settings.captcha.password,
        'captchafile': `base64:${data}`
      }
    }).catch(async(err) => {
      if (!err || !err.response || err.statusCode != 303) {
        logger.error(err);
        retry();
      }

      const json = JSON.parse(err.response.body);

      if (json.is_correct && json.text != '') {
        return {'text': json.text, 'buffer': buffer}
      } else {
        return module.exports.pollCaptchaAnswer(logger, settings, json, buffer);
      }
    });
  });
};

module.exports.pollCaptchaAnswer = async(logger, settings, json, buffer) => {
  return promiseRetry(settings.captcha.retryOptions, async(retry, attempt) => {
    logger.info(`Polling the captcha ${json.captcha} answer. Attempt number ${attempt}`);

    return request(
      {
        method: 'GET',
        uri: settings.captcha.uri + '/' + json.captcha,
        headers: { 'Accept': 'application/json' }
      })
      .then(async(responseText) => {
        const response = JSON.parse(responseText);

        if (response.is_correct && response.text != '') {
          return { 'text': response.text, 'buffer': buffer };
        } else {
          throw 'CaptchaNotYetAvailable';
        }
      })
      .catch(async(err) => {
        logger.error(err);
        retry();
      });
  });
};

module.exports.sample = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

module.exports.waitingTimespan = (settings) => {
  const now = new Date();
  const waitUntil = new Date();

  const waitUntilArr = settings.waitUntil.split(':');

  waitUntil.setUTCHours(waitUntilArr[0]);
  waitUntil.setUTCMinutes(waitUntilArr[1]);
  waitUntil.setUTCSeconds(waitUntilArr[2]);

  return waitUntil - now;
}
