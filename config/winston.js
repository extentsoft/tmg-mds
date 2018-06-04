var appRoot = require('app-root-path');
var winston = require('winston');

// define the custom settings for each transport (file,console)
var options = {
    file: {
        level: 'info',
        filename: `${appRoot}/logs/app.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, //5MB
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    }
}

// Instantiate new winston logger 
var logger = new winston.Logger({
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false, // dont exit on handled exceptions

})

logger.stream = {
    write: function(message, encoding) {
        logger.info(message);
    },
};

module.exports = logger;