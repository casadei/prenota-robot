module.exports = {
  debugMode: true,
  logLevel: 'debug',

  aws: {
    bucket: process.env.AWS_BUCKET,
    key: process.env.AWS_KEY,
    secret: process.env.AWS_SECRET,
    region: 'eu-west-3',
    captchaSolvedCorrectlySqs: 'https://sqs.eu-west-3.amazonaws.com/565384488892/correctCaptchas',
    captchaSolvedIncorrectlySqs: 'https://sqs.eu-west-3.amazonaws.com/565384488892/incorrectCaptchas'
  },

  browser: {
    launchOptions: {
      headless: true,
      ignoreHTTPSErrors: true,
      args: [ '--ignore-certificate-errors' ]
    },

    navigationOptions: {
      timeout: 5000,
      waitUntil: 'load'
    },

    retryOptions: {
      minTimeout: 1500,
      factor: 1
    }
  },

  messages: {
    invalidCaptcha: 'Código de confirmação errado',
    invalidUsername: 'Utente inexistente',
    invalidPassword: 'Password incorreta',
  },

  captcha: {
    uri: 'http://api.dbcapi.me/api/captcha',
    user: process.env.DH_CAPTCHA_USER,
    password: process.env.DH_CAPTCHA_PASSWORD,
    retryOptions: {
      retries: 30,
      factor: 1,
      minTimeout: 1500
    }
  },

  waitUntil: '22:59:55',
  maxWaitingTime: 300000,
  minWaitingTime: 0,

  consulates: {
    beloHorizonte: {
      code: 100068,
      departments: {
        buttons: {
          confirm: '#ctl00_ContentPlaceHolder1_acc_datiAddizionali1_btnContinua',
          cancel: '#ctl00_ContentPlaceHolder1_acc_datiAddizionali1_btnAnnulla'
        },

        passports: {
          label: 'PASSAPORTES',
          fields: ['#ctl00_ContentPlaceHolder1_acc_datiAddizionali1_txtNote']
        },

        citizenship: {
          label: 'CIDADANIA POR DESCENDENCIA',
          fields: [
            '#ctl00_ContentPlaceHolder1_acc_datiAddizionali1_mycontrol1',
            '#ctl00_ContentPlaceHolder1_acc_datiAddizionali1_mycontrol2',
            '#ctl00_ContentPlaceHolder1_acc_datiAddizionali1_txtNote'
          ]
        },

        visas: {
          label: 'VISTOS',
          fields: ['#ctl00_ContentPlaceHolder1_acc_datiAddizionali1_txtNote']
        }
      }
    }
  }
};
