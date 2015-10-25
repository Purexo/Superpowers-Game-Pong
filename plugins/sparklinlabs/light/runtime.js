(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Light = require("./Light");
SupRuntime.registerPlugin("Light", Light);

},{"./Light":2}],2:[function(require,module,exports){
function setupComponent(player, component, config) {
    component.__outer.type = ["ambient", "point", "spot", "directional"].indexOf(config.type);
    component.color = parseInt(config.color, 16);
    component.intensity = config.intensity;
    component.distance = config.distance;
    component.angle = config.angle;
    component.target.set(config.target.x, config.target.y, config.target.z);
    component.castShadow = config.castShadow;
    component.shadowMapWidth = config.shadowMapSize.width;
    component.shadowMapHeight = config.shadowMapSize.height;
    component.shadowBias = config.shadowBias;
    component.shadowDarkness = config.shadowDarkness;
    component.shadowCameraNear = config.shadowCameraNearPlane;
    component.shadowCameraFar = config.shadowCameraFarPlane;
    component.shadowCameraFov = config.shadowCameraFov;
    component.shadowCameraLeft = config.shadowCameraSize.left;
    component.shadowCameraRight = config.shadowCameraSize.right;
    component.shadowCameraTop = config.shadowCameraSize.top;
    component.shadowCameraBottom = config.shadowCameraSize.bottom;
    component.setType(config.type);
}
exports.setupComponent = setupComponent;

},{}]},{},[1]);
