module.exports = {
  debugMode: true,
  trackPath: `/tmp`,

  browser: {
    launchOptions: {
      headless: true,
      ignoreHTTPSErrors: true
    },

    navigationOptions: {
      timeout: 15000,
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
    user: '<DeathByCaptchaUsername>',
    password: '<DeathByCaptchaPassword>',
    retryOptions: {
      retries: 20,
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
