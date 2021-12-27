const PROXY_CONFIG = [
    {
        context: ['/api'],
        //target: 'http://localhost:8000/',
        target: 'https://api-leonoralima.herokuapp.com/',
        secure: true,
        logLevel: 'debug',
    },
    {
        context: ['/storage'],
        //target: 'http://localhost:8000/',
        target: 'https://api-leonoralima.herokuapp.com/',
        secure: true,
        logLevel: 'debug',
    },
];

module.exports = PROXY_CONFIG;
