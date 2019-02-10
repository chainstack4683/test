# Chainstack Test Assignment. Server #

## User Stories ##

* As a platform user, I need to authenticate with an email address and password.
* As a platform user, I need be able to create, list and delete resources.
* As a platform user, I should not be able to access resources owned by other users.
* As a platform user, I should not be able to create a new resource if the quota is exceeded.
* As a platform administrator, I should be able to create, list and delete users and their resources.
* As a platform administrator, I should be able to set the quota for any user.

## Run ##

* To run locally simply run: `node server` or `npm start`.
* If you prefer to run via Docker, the Dockerfile is provided for your convinience.

## Run unittests ##

* Run `npm test` to run tests using [Mocha](https://mochajs.org/).

