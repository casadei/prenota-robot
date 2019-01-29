# Set up instructions

## Dependencies

Install all the dependencies executing::

```console
$ npm install
$ sudo npm link
```

## Settings

### Death by captcha credentials

Set death by captcha credentials in `.env` like the example below:

```console
DH_CAPTCHA_USER=DeathByCaptchaUsername
DH_CAPTCHA_PASSWORD=DeathByCaptchaPassword
```

### Tracking files

Set in `./config/settings.js` the directory where the tracking files are going to be stored:

```javascript
{
  ...,
  trackPath: `/tmp`,
  ...
}
```

### Account Details

Set prenota data in `./config/account.js` like the example below:

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
