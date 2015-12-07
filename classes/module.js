/**
 * Created by Vadim on 12/3/15.
 */
'use strict';

/**
 * Module constructor
 * @param name
 * @constructor
 */
function Module(name) {
    this.name = name;
}

module.exports = function (Dolphin) {
    Dolphin.prototype.Module = Module;

    /**
     * Registration function with modules
     * @param callback
     */
    Module.prototype.register = function (callback) {
        if (Dolphin.Singleton.modules[this.name] !== undefined) {
            Dolphin.Singleton.Logger.error('Module "' + this.name + '" has already been registered');
            return;
        }

        Dolphin.Singleton.modules[this.name] = this;
        Dolphin.Singleton.container.register(this.name, callback);
    };
};