/**
 * Created by Vadim on 12/3/15.
 */
'use strict';

module.exports = function (Dolphin) {
    function HttpModule(name, source) {
        Dolphin.prototype.Module.apply(this, [name, source]);
    }

    require('util').inherits(HttpModule, Dolphin.prototype.Module);
    Dolphin.prototype.HttpModule = HttpModule;
};

