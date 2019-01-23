module.exports = {
  debugMode: true,

  browser: {
    launchOptions: {
      headless: false,
      ignoreHTTPSErrors: true
    }
  },

  messages: {
    invalidCaptcha: 'Código de confirmação errado',
    invalidUsername: 'Utente inexistente',
    invalidPassword: 'Password incorreta'
  },

  captcha: {
    uri: 'http://api.dbcapi.me/api/captcha',
    user: '<DeadByCaptchaUsername>',
    password: '<DeadByCaptchaPassword>'
  },

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
