# Set up instructions

## Dependencies

Install all the dependencies executing::

```console
$ npm install
$ sudo npm link
``` 

## Requisites

### Dead by captcha credentials

Set dead by captcha credentials in `./config/settings.js` like the example below:

```javascript
{
  ...,
  captcha: {
    uri: 'http://api.dbcapi.me/api/captcha',
    user: '<DeadByCaptchaUsername>',
    password: '<DeadByCaptchaPassword>'
  },
  ...
}
``` 

### Prenota credentials

Set prenota information in `./config/account.js` like the example below:

```javascript
{
  username: '<PrenotaUsername>',
  password: '<PrenotaPassword>',
  consulate: 'beloHorizonte',
  department: 'visas',
  departmentData: ['']
}
``` 

Important: the current version is only ready to work using accounts belonging to the consulate of `Belo Horizonte`.

## Running

After setting the config files, execute:

```console
$ robot
```
