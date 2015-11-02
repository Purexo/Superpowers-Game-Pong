(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Light = require("./Light");
var lightSettingsResource = require("./lightSettingsResource");
SupRuntime.registerPlugin("Light", Light);
SupRuntime.registerResource("lightSettings", lightSettingsResource);

},{"./Light":2,"./lightSettingsResource":3}],2:[function(require,module,exports){
var THREE = SupEngine.THREE;
function init(player, callback) {
    switch (player.resources.lightSettings.shadowMapType) {
        case "basic":
            player.gameInstance.threeRenderer.shadowMap.type = THREE.BasicShadowMap;
            break;
        case "pcf":
            player.gameInstance.threeRenderer.shadowMap.type = THREE.PCFShadowMap;
            break;
        case "pcfSoft":
            player.gameInstance.threeRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
            break;
    }
    callback();
}
exports.init = init;
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

},{}],3:[function(require,module,exports){
function loadResource(player, resourceName, callback) {
    console.log("load light");
    player.getAssetData("resources/" + resourceName + "/resource.json", "json", function (err, data) {
        if (err != null) {
            callback(err);
            return;
        }
        callback(null, data);
        console.log("light loaded");
    });
}
exports.loadResource = loadResource;

},{}]},{},[1]);
