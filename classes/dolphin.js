/**
 * Created by Vadim on 12/3/15.
 */
'use strict';

var ModuleUtil = require('dolphin-core-utils').Module;
var Logger = require('dolphin-logger');
var Q = require('q');
var container = require('dependable').container();

/**
 * Main loader
 * @constructor
 */
function Dolphin() {
    Dolphin.Singleton = this;
    this.modules = {};
    this.container = container;
}

/**
 * Run all modules
 * @return null
 */
Dolphin.prototype.run = function () {
    return ModuleUtil.findModules().then(function (files) {
        return this.enableModules(files);
    }.bind(this));
};

/**
 * Enable all modules which were found
 * @param files
 */
Dolphin.prototype.enableModules = function (files) {
    files.forEach(function (file) {
        try {
            require(file.file);
        } catch (err) {
            Logger.error(err);
        }
    });

    var i;
    var module;
    //init factories
    for (i in this.modules) {
        module = this.modules[i];
        try {
            module.resolveFactories();// load
        } catch (err) {
            Logger.error(err);
        }
    }

    //configure modules
    for (i in this.modules) {
        module = this.modules[i];
        try {
            module.resolveConfigurationFactory();// load
        } catch (err) {
            Logger.error(err);
        }
    }

    //exec modules
    for (i in this.modules) {
        module = this.modules[i];
        try {
            module.resolveRun();// load
        } catch (err) {
            Logger.error(err);
        }
    }
    return Q.resolve();
};

/**
 * Resolve any objects in memory
 * @param callback
 */
Dolphin.prototype.resolveObjects = function (callback) {
    try {
        return this.container.resolve(callback);
    } catch (e) {
        Logger.error('Dolphin.prototype.resolveObjects:', e);
        throw new Error('Module not found');
    }
    return null;
};

/**
 * Cron mode
 * @param callback
 */
Dolphin.prototype.isCronMode = function () {
    return process.env.CRON_MODE !== undefined;
};

/**
 * Cron mode
 * @param callback
 */
Dolphin.prototype.isProductionMode = function () {
    return process.env.NODE_ENV == 'production';
};

/*************************************************************************
 SINGLETON CLASS DEFINITION
 *************************************************************************/
Dolphin.instance = null;

/**
 * Singleton getInstance definition
 * @return Dolphin class
 */
Dolphin.getInstance = function () {
    if (this.instance === null) {
        this.instance = new Dolphin();
    }
    return this.instance;
};

module.exports = Dolphin.getInstance();