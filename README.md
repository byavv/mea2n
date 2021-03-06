[![CircleCI][circle-image]][circle-url]
[![Build Status][travis-image]][travis-url]

[![Dependency Status][david-image]][david-url]
[![devDependency Status][david-dev-image]][david-dev-url]


# MEAN (angular2.rc4)

#### What we've got here

* Typescript environment.
* JWT-based authentication (naive, but ready to scale).
* Server rendering via [angular2-universal](https://github.com/angular/universal).
* Bootstrap 4.

#### Features:

* Users management and authentication sample
* Complete angular2 workflow

## Requirements
* [MongoDb](https://www.mongodb.org/)
* [Redis](http://redis.io/)

## Quick start

```bash

# clone the repo
$ git clone https://github.com/byavv/mea2n.git 

# change into the repo directory
$ cd mea2n

# install 
$ npm install

```
## NOTE!

1. Register [new github application](https://github.com/settings/applications/new) and fill secrets in 
"config.json" to get github authentication functionality.
2. Fill sender email data in "config.json" to be able to send reset password emails.

## Build
Development build (by default):
```bash
$ gulp build
```
Production build:
```bash
$ gulp build --env production                   
```
Build client:
```bash
$ gulp build:client (--env production)
```
Build server:
```bash
$ gulp build:server
```
## Serve/watch
Builds all and starts server:
```bash
$ gulp
```
## Testing
```bash

$ gulp test
$ gulp test:client
$ gulp test:server    
$ gulp test:e2e

 ```


[david-image]: https://david-dm.org/byavv/mea2n.svg
[david-url]: https://david-dm.org/byavv/mea2n
[david-dev-image]: https://david-dm.org/byavv/mea2n/dev-status.svg
[david-dev-url]: https://david-dm.org/byavv/mea2n#info=devDependencies
[circle-image]: https://circleci.com/gh/byavv/mea2n.svg?style=shield
[circle-url]: https://circleci.com/gh/byavv/mea2n
[travis-image]: https://travis-ci.org/byavv/mea2n.svg?branch=master
[travis-url]: https://travis-ci.org/byavv/mea2n
