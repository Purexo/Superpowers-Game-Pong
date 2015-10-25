!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.SupAPI=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
exports.contexts = {};
function registerPlugin(contextName, pluginName, plugin) {
    if (exports.contexts[contextName] == null)
        exports.contexts[contextName] = { plugins: {} };
    if (exports.contexts[contextName].plugins[pluginName] != null)
        console.error("SupAPI.registerPlugin: Tried to register two or more plugins named \"" + pluginName + "\" in context \"" + contextName + "\"");
    if (plugin.exposeActorComponent != null) {
        if (plugin.exposeActorComponent.propertyName == null)
            console.error("SupAPI.registerPlugin: Missing actor component property name in plugin \"" + pluginName + "\" in context \"" + contextName + "\"");
        if (plugin.exposeActorComponent.className == null)
            console.error("SupAPI.registerPlugin: Missing actor component class name in plugin \"" + pluginName + "\" in context \"" + contextName + "\"");
    }
    exports.contexts[contextName].plugins[pluginName] = plugin;
}
exports.registerPlugin = registerPlugin;

},{}]},{},[1])(1)
});