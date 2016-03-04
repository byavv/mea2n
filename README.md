# MEAN Stack (angular2.b8)

####Rewrite of [NG1](https://github.com/byavv/ng-mean) version to Angular2

> Work in progress! A lot of not resolved issues, needed to make it work as designed [#6374](https://github.com/angular/angular/issues/6374), [#4112](https://github.com/angular/angular/issues/4112)

#### What we've got here

* Typescript environment.
* JWT-based authentication (naive, but ready to scale).
* Server rendering via [angular-universal](https://github.com/angular/universal).

## Requirements
* [MongoDb](https://www.mongodb.org/)
* [Redis](http://redis.io/)

## Quick start

```bash
# install globally
npm install --global gulp typescript typings webpack nodemon karma tsd node-gyp

# clone the repo
git clone https://github.com/byavv/mea2n.git 

# change into the repo directory
cd mea2n

# install 
npm install
bower install

# build app
gulp build

# run in dev mode
gulp
```
## NOTE!

1. Register [new github application](https://github.com/settings/applications/new) and fill secrets in 
"config.js" to get github authentication functionality.
2. Fill sender email data in "config.js" to be able to send reset password emails.

## Build
```sh
$ gulp build
```
###Build client bundle:
```sh
$ gulp build:client
```
###Build server bundle:
```sh
$ gulp build:server
```
## Serve/watch
Builds all and starts server:
```sh
$ gulp
```
## Testing
* `$ gulp test`
* `$ gulp test:client`    
* `$ gulp test:server`    
* `$ gulp test:e2e`
       

