/**
 * Created by Vadim on 12/4/15.
 */
'use strict';
var winston = require('winston');
var path = require('path');
var fs = require('fs');
var LOG_FOLDER = 'logs';

//clean
winston.remove(winston.transports.Console);

try {
    fs.mkdirSync(path.join(process.cwd(), LOG_FOLDER));
} catch (e) {
    if (e.code != 'EEXIST') throw e;
}

function formatter(options) {
    var m = new Date();
    var dateString =
        m.getUTCFullYear() + '-' +
        ('0' + (m.getUTCMonth() + 1)).slice(-2) + '-' +
        ('0' + m.getUTCDate()).slice(-2) + ' ' +
        ('0' + m.getUTCHours()).slice(-2) + ':' +
        ('0' + m.getUTCMinutes()).slice(-2) + ':' +
        ('0' + m.getUTCSeconds()).slice(-2);
    return dateString + ' ' + options.level.toUpperCase() + ' ' + (undefined !== options.message ? options.message : '') + (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '' );
}

var config = {
    exitOnError: false,
    level: process.env.NODE_DEBUG_LEVEL || 'debug',
    levels: {
        info: 0,
        warn: 1,
        error: 2,
        debug: 3,

    },
    colors: {
        info: 'green',
        debug: 'cyan',
        warn: 'yellow',
        error: 'red'
    },
    // Production transports
    transports: [
        // Info log
        new winston.transports.File({
            name: 'info.log',
            filename: path.join(process.cwd(), LOG_FOLDER, 'info.log'),
            level: 'info',
            json: false,
            formatter: formatter,
            zippedArchive: true,
            maxFiles: 20,
            maxsize: 2 * 1024 * 1024 // 2mb
        }),
        // Error log
        new winston.transports.File({
            name: 'error.log',
            filename: path.join(process.cwd(), LOG_FOLDER, 'error.log'),
            level: 'error',
            json: false,
            formatter: formatter,
            zippedArchive: true,
            maxFiles: 20,
            maxsize: 2 * 1024 * 1024 // 2mb
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({
            name: 'exceptions.log',
            formatter: formatter,
            json: false,
            filename: path.join(process.cwd(), LOG_FOLDER, 'exceptions.log'),
            maxFiles: 20,
            maxsize: 2 * 1024 * 1024 // 2mb
        })
    ]
};

//debug file
if (config.level == 'debug') {
    config.transports.push(
        // Debug log
        new winston.transports.File({
            name: 'debug.log',
            level: 'debug',
            json: false,
            formatter: formatter,
            filename: path.join(process.cwd(), LOG_FOLDER, 'debug.log'),
            zippedArchive: true,
            maxFiles: 20,
            maxsize: 20 * 1024 * 1024 // 20mb
        })
    );
}

//console
if (process.env.NODE_ENV != 'production') {
    config.transports.push(
        //Console
        new (winston.transports.Console)({
            colorize: 'all'
        })
    );
}

/*************************************************************************
 SINGLETON CLASS DEFINITION
 *************************************************************************/
var instance = null;

/**
 * Singleton getInstance definition
 * @return Logger class
 */
function getInstance() {
    if (instance === null) {
        instance = new winston.Logger(config);
    }
    return instance;
}

module.exports = getInstance();