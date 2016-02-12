export var test =  {
    db: "mongodb://localhost/mea2n-ts-test",
    httpPort: process.env.PORT || 3030,
    httpsPort: process.env.HTTPS_PORT || 3443,
    redis: {
        port: 6379,
        host: "localhost",
        url: null
    },
}