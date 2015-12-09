/**
 * Created by Vadim on 12/3/15.
 */
'use strict';

module.exports = function (Dolphin) {

    // private
    function checkName(name) {
        if (Dolphin.Singleton.modules[name] !== undefined) {
            Dolphin.Singleton.Logger.error('Module "' + name + '" has already been registered');
            return false;
        }
        return true;
    }

    //public

    /**
     * Module constructor
     * @param name
     * @constructor
     */
    function Module(name, source) {
        if (!checkName(name)) {
            return;
        }

        this.name = name;
        this.factories = [];
        this.configureFactoryName = null;
        this.runName = null;
        this.source = source;
        Dolphin.Singleton.container.register(this.name, this);
        Dolphin.Singleton.modules[this.name] = this;
    }

    Dolphin.prototype.Module = Module;

    /**
     * Registration a factory
     * @param name
     * @param callback
     * @return undefined
     */
    Module.prototype.factory = function (name, callback) {
        this.factoryName = this.name + name + 'Factory';

        if (!checkName(this.factoryName)) {
            return;
        }

        this.factories.push(this.factoryName);
        Dolphin.Singleton.container.register(this.factoryName, callback);
    };

    /**
     * Method for Dolphin, Resolve all module factories
     * @return undefined
     */
    Module.prototype.resolveFactories = function () {
        for (var i in this.factories) {
            Dolphin.Singleton.container.get(this.factories[i]);
        }
    };

    /**
     * Registration event
     * @param callback
     * @return undefined
     */
    Module.prototype.configureFactories = function (callback) {
        this.configureFactoryName = this.name + 'ConfigureFactory';

        if (!checkName(this.configureFactoryName)) {
            return;
        }

        Dolphin.Singleton.container.register(this.configureFactoryName, callback);
    };

    /**
     * Method for Dolphin, resolve configureFactories
     * @return undefined
     */
    Module.prototype.resolveConfigurationFactory = function () {
        if (!this.configureFactoryName) {
            return;
        }
        Dolphin.Singleton.container.get(this.configureFactoryName);
    };

    /**
     * Registration event, run functions
     * @param callback
     * @return undefined
     */
    Module.prototype.run = function (callback) {
        this.runName = this.name + 'Run';

        if (!checkName(this.runName)) {
            return;
        }

        Dolphin.Singleton.container.register(this.runName, callback);
    };

    /**
     * Resolve all run functions
     * @return undefined
     */
    Module.prototype.resolveRun = function () {
        if (!this.runName) {
            return;
        }
        Dolphin.Singleton.container.get(this.runName);
    };
};

