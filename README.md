
[![CircleCI][circle-image]][circle-url]

[![Dependency Status][david-image]][david-url]


# MEAN (angular2.rc4)

#### What we've got here

* Typescript environment.
* JWT-based authentication (naive, but ready to scale).
* Server rendering via [angular-universal](https://github.com/angular/universal).

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
"config.js" to get github authentication functionality.
2. Fill sender email data in "config.js" to be able to send reset password emails.

## Build
```sh
$ gulp build
```
### for production: 
```sh
$ gulp build --env production                   
```
### Build client bundle:
```sh
$ gulp build:client
```
### Build server bundle:
```sh
$ gulp build:server
```
## Serve/watch
Builds all and starts server:
```sh
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
[circle-image]: https://circleci.com/gh/byavv/mea2n.svg?style=svg
[circle-url]: https://circleci.com/gh/byavv/mea2n