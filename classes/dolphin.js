/**
 * Created by Vadim on 12/3/15.
 */
'use strict';

var Module = require('./static/module');
var Q = require('q');
var path = require('path');
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
Dolphin.prototype.run = function (options) {
    return Module.findModules().then(function (files) {
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
            Dolphin.Singleton.Logger.error(err);
        }
    });

    var i;
    //init factories
    for (var i in this.modules) {
        var module = this.modules[i];
        try {
            module.resolveFactories();// load
        } catch (err) {
            Dolphin.Singleton.Logger.error(err);
        }
    }

    //configure modules
    for (i in this.modules) {
        var module = this.modules[i];
        try {
            module.resolveConfigurationFactory();// load
        } catch (err) {
            Dolphin.Singleton.Logger.error(err);
        }
    }

    //exec modules
    for (i in this.modules) {
        var module = this.modules[i];
        try {
            module.resolveRun();// load
        } catch (err) {
            Dolphin.Singleton.Logger.error(err);
        }
    }
    return Q.resolve();
};

/**
 * Resolve any objects in memory
 * @param callback
 */
Dolphin.prototype.resolveObjects = function (callback) {
    this.container.resolve(callback);
}

//include Module logic
require('./module')(Dolphin);

//include singleton Module
Dolphin.prototype.Logger = require('./logger');

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
}

module.exports = Dolphin.getInstance();