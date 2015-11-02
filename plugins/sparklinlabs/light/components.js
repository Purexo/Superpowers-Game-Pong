(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Light_1 = require("./Light");
var LightMarker_1 = require("./LightMarker");
SupEngine.registerComponentClass("Light", Light_1.default);
SupEngine.registerEditorComponentClass("LightMarker", LightMarker_1.default);

},{"./Light":2,"./LightMarker":3}],2:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE = SupEngine.THREE;
var LightUpdater_1 = require("./LightUpdater");
var Light = (function (_super) {
    __extends(Light, _super);
    function Light(actor) {
        _super.call(this, actor, "Light");
        this.color = 0xffffff;
        this.intensity = 1;
        this.distance = 0;
        this.angle = Math.PI / 3;
        this.target = new THREE.Vector3(0, 0, 0);
        this.castShadow = false;
        this.shadowMapWidth = 512;
        this.shadowMapHeight = 512;
        this.shadowBias = 0;
        this.shadowDarkness = 0.5;
        this.shadowCameraNear = 0.1;
        this.shadowCameraFar = 100;
        this.shadowCameraFov = 50;
        this.shadowCameraLeft = -100;
        this.shadowCameraRight = 100;
        this.shadowCameraTop = 100;
        this.shadowCameraBottom = -100;
        this.actor.gameInstance.threeRenderer.shadowMap.enabled = true;
    }
    Light.prototype.setType = function (type) {
        if (this.light != null)
            this.actor.threeObject.remove(this.light);
        this.type = type;
        switch (type) {
            case "ambient":
                this.light = new THREE.AmbientLight(this.color);
                break;
            case "point":
                this.light = new THREE.PointLight(this.color, this.intensity, this.distance);
                break;
            case "spot":
                var spotLight = new THREE.SpotLight(this.color, this.intensity, this.distance, this.angle * Math.PI / 180);
                spotLight.target.position.copy(this.target);
                spotLight.target.updateMatrixWorld(false);
                spotLight.shadowCameraNear = 0.1;
                spotLight.shadowCamera = new THREE.PerspectiveCamera(spotLight.shadowCameraFov, spotLight.shadowMapWidth / spotLight.shadowMapHeight, spotLight.shadowCameraNear, spotLight.shadowCameraFar);
                this.light = spotLight;
                this.setCastShadow(this.castShadow);
                break;
            case "directional":
                var directionalLight = new THREE.DirectionalLight(this.color, this.intensity);
                directionalLight.target.position.copy(this.target);
                directionalLight.target.updateMatrixWorld(false);
                directionalLight.shadowMapWidth = this.shadowMapWidth;
                directionalLight.shadowMapHeight = this.shadowMapHeight;
                directionalLight.shadowBias = this.shadowBias;
                directionalLight.shadowDarkness = this.shadowDarkness;
                directionalLight.shadowCameraNear = this.shadowCameraNear;
                directionalLight.shadowCameraFar = this.shadowCameraFar;
                directionalLight.shadowCameraLeft = this.shadowCameraLeft;
                directionalLight.shadowCameraRight = this.shadowCameraRight;
                directionalLight.shadowCameraTop = this.shadowCameraTop;
                directionalLight.shadowCameraBottom = this.shadowCameraBottom;
                directionalLight.shadowCamera = new THREE.OrthographicCamera(directionalLight.shadowCameraLeft, directionalLight.shadowCameraRight, directionalLight.shadowCameraTop, directionalLight.shadowCameraBottom, directionalLight.shadowCameraNear, directionalLight.shadowCameraFar);
                this.light = directionalLight;
                this.setCastShadow(this.castShadow);
                break;
        }
        this.actor.threeObject.add(this.light);
        this.light.updateMatrixWorld(false);
        this.actor.gameInstance.threeScene.traverse(function (object) {
            var material = object.material;
            if (material != null)
                material.needsUpdate = true;
        });
    };
    Light.prototype.setColor = function (color) {
        this.color = color;
        this.light.color.setHex(this.color);
    };
    Light.prototype.setIntensity = function (intensity) {
        this.intensity = intensity;
        if (this.type !== "ambient")
            this.light.intensity = intensity;
    };
    Light.prototype.setDistance = function (distance) {
        this.distance = distance;
        if (this.type === "point" || this.type === "spot")
            this.light.distance = distance;
    };
    Light.prototype.setAngle = function (angle) {
        this.angle = angle;
        if (this.type === "spot")
            this.light.angle = this.angle * Math.PI / 180;
    };
    Light.prototype.setTarget = function (x, y, z) {
        if (x != null)
            this.target.setX(x);
        if (y != null)
            this.target.setY(y);
        if (z != null)
            this.target.setZ(z);
        if (this.type === "spot" || this.type === "directional") {
            this.light.target.position.copy(this.target);
            this.light.target.updateMatrixWorld(true);
        }
    };
    Light.prototype.setCastShadow = function (castShadow) {
        this.castShadow = castShadow;
        if (this.type !== "spot" && this.type !== "directional")
            return;
        this.light.castShadow = this.castShadow;
        this.actor.gameInstance.threeScene.traverse(function (object) {
            var material = object.material;
            if (material != null)
                material.needsUpdate = true;
        });
    };
    Light.prototype.setShadowMapSize = function (width, height) {
        if (width != null)
            this.shadowMapWidth = width;
        if (height != null)
            this.shadowMapHeight = height;
        if (this.type !== "spot" && this.type !== "directional")
            return;
        this.light.shadowMapWidth = this.shadowMapWidth;
        this.light.shadowMapHeight = this.shadowMapHeight;
        this.setType(this.type);
    };
    Light.prototype.setShadowBias = function (bias) {
        this.shadowBias = bias;
        if (this.type !== "spot" && this.type !== "directional")
            return;
        this.light.shadowBias = this.shadowBias;
    };
    Light.prototype.setShadowDarkness = function (darkness) {
        this.shadowDarkness = darkness;
        if (this.type !== "spot" && this.type !== "directional")
            return;
        this.light.shadowDarkness = this.shadowDarkness;
    };
    Light.prototype.setShadowCameraNearPlane = function (near) {
        this.shadowCameraNear = near;
        if (this.type !== "spot" && this.type !== "directional")
            return;
        this.light.shadowCameraNear = this.shadowCameraNear;
        var camera = this.light.shadowCamera;
        camera.near = this.shadowCameraNear;
        camera.updateProjectionMatrix();
    };
    Light.prototype.setShadowCameraFarPlane = function (far) {
        this.shadowCameraFar = far;
        if (this.type !== "spot" && this.type !== "directional")
            return;
        this.light.shadowCameraFar = this.shadowCameraFar;
        var camera = this.light.shadowCamera;
        camera.far = this.shadowCameraFar;
        camera.updateProjectionMatrix();
    };
    Light.prototype.setShadowCameraFov = function (fov) {
        this.shadowCameraFov = fov;
        if (this.type !== "spot")
            return;
        this.light.shadowCameraFov = this.shadowCameraFov;
        var camera = this.light.shadowCamera;
        camera.fov = this.shadowCameraFov;
        camera.updateProjectionMatrix();
    };
    Light.prototype.setShadowCameraSize = function (top, bottom, left, right) {
        if (top != null)
            this.shadowCameraTop = top;
        if (bottom != null)
            this.shadowCameraBottom = bottom;
        if (left != null)
            this.shadowCameraLeft = left;
        if (right != null)
            this.shadowCameraRight = right;
        if (this.type !== "directional")
            return;
        this.light.shadowCameraTop = this.shadowCameraTop;
        this.light.shadowCameraBottom = this.shadowCameraBottom;
        this.light.shadowCameraLeft = this.shadowCameraLeft;
        this.light.shadowCameraRight = this.shadowCameraRight;
        var camera = this.light.shadowCamera;
        camera.top = this.shadowCameraTop;
        camera.bottom = this.shadowCameraBottom;
        camera.left = this.shadowCameraLeft;
        camera.right = this.shadowCameraRight;
        camera.updateProjectionMatrix();
    };
    Light.prototype._destroy = function () {
        this.actor.threeObject.remove(this.light);
        if (this.castShadow) {
            this.actor.gameInstance.threeScene.traverse(function (object) {
                var material = object.material;
                if (material != null)
                    material.needsUpdate = true;
            });
        }
        _super.prototype._destroy.call(this);
    };
    Light.prototype.setIsLayerActive = function (active) { this.light.visible = active; };
    Light.Updater = LightUpdater_1.default;
    return Light;
})(SupEngine.ActorComponent);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Light;

},{"./LightUpdater":4}],3:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE = SupEngine.THREE;
var Light_1 = require("./Light");
var LightMarker = (function (_super) {
    __extends(LightMarker, _super);
    function LightMarker() {
        _super.apply(this, arguments);
    }
    LightMarker.prototype.setType = function (type) {
        if (this.lightMarker != null)
            this.actor.gameInstance.threeScene.remove(this.lightMarker);
        if (this.cameraHelper != null) {
            console.log("remove light");
            this.actor.gameInstance.threeScene.remove(this.cameraHelper);
            this.cameraHelper = null;
        }
        _super.prototype.setType.call(this, type);
        switch (type) {
            case "ambient":
                this.lightMarker = null;
                break;
            case "point":
                this.lightMarker = new THREE.PointLightHelper(this.light, 1);
                break;
            case "spot":
                this.lightMarker = new THREE.SpotLightHelper(this.light, 1, 1);
                //if (this.castShadow) this.cameraHelper = new THREE.CameraHelper((<THREE.SpotLight>this.light).shadowCamera);
                break;
            case "directional":
                this.lightMarker = new THREE.DirectionalLightHelper(this.light, 1);
                //if (this.castShadow) this.cameraHelper = new THREE.CameraHelper((<THREE.DirectionalLight>this.light).shadowCamera);
                break;
        }
        if (this.lightMarker != null) {
            this.actor.gameInstance.threeScene.add(this.lightMarker);
            this.lightMarker.updateMatrixWorld(true);
        }
        //console.log(this.cameraHelper);
        //if (type === "spot" && this.cameraHelper != null && this.castShadow) this.actor.gameInstance.threeScene.add(this.cameraHelper);
    };
    LightMarker.prototype.setColor = function (color) {
        _super.prototype.setColor.call(this, color);
        if (this.lightMarker != null)
            this.lightMarker.update();
    };
    LightMarker.prototype.setIntensity = function (intensity) {
        _super.prototype.setIntensity.call(this, intensity);
        if (this.lightMarker != null)
            this.lightMarker.update();
    };
    LightMarker.prototype.setDistance = function (distance) {
        _super.prototype.setDistance.call(this, distance);
        if (this.lightMarker != null)
            this.lightMarker.update();
    };
    LightMarker.prototype.setAngle = function (angle) {
        _super.prototype.setAngle.call(this, angle);
        if (this.lightMarker != null)
            this.lightMarker.update();
    };
    LightMarker.prototype.setTarget = function (x, y, z) {
        _super.prototype.setTarget.call(this, x, y, z);
        if (this.lightMarker != null)
            this.lightMarker.update();
    };
    LightMarker.prototype.setCastShadow = function (castShadow) {
        _super.prototype.setCastShadow.call(this, castShadow);
        if (castShadow) {
            this.cameraHelper = new THREE.CameraHelper(this.light.shadowCamera);
            this.actor.gameInstance.threeScene.add(this.cameraHelper);
        }
        else {
            this.actor.gameInstance.threeScene.remove(this.cameraHelper);
            this.cameraHelper = null;
        }
    };
    LightMarker.prototype.setShadowCameraNearPlane = function (near) {
        _super.prototype.setShadowCameraNearPlane.call(this, near);
        if (this.cameraHelper != null)
            this.cameraHelper.update();
    };
    LightMarker.prototype.setShadowCameraFarPlane = function (far) {
        _super.prototype.setShadowCameraFarPlane.call(this, far);
        if (this.cameraHelper != null)
            this.cameraHelper.update();
    };
    LightMarker.prototype.setShadowCameraFov = function (fov) {
        _super.prototype.setShadowCameraFov.call(this, fov);
        if (this.cameraHelper != null)
            this.cameraHelper.update();
    };
    LightMarker.prototype.setShadowCameraSize = function (top, bottom, left, right) {
        _super.prototype.setShadowCameraSize.call(this, top, bottom, left, right);
        if (this.cameraHelper != null)
            this.cameraHelper.update();
    };
    LightMarker.prototype.update = function () {
        // TODO: Only do that when the transform has changed
        if (this.lightMarker != null) {
            this.lightMarker.updateMatrixWorld(true);
            this.lightMarker.update();
        }
        this.actor.gameInstance.threeScene.updateMatrixWorld(false);
    };
    LightMarker.prototype._destroy = function () {
        if (this.lightMarker != null)
            this.actor.gameInstance.threeScene.remove(this.lightMarker);
        if (this.cameraHelper != null)
            this.actor.gameInstance.threeScene.remove(this.cameraHelper);
        _super.prototype._destroy.call(this);
    };
    return LightMarker;
})(Light_1.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LightMarker;

},{"./Light":2}],4:[function(require,module,exports){
var THREE = SupEngine.THREE;
var LightUpdater = (function () {
    function LightUpdater(projectClient, light, config) {
        this.lightSettingsSubscriber = {
            onResourceReceived: this._onLightResourceRecevied.bind(this),
            onResourceEdited: this._onLightResourceEdited.bind(this)
        };
        this.projectClient = projectClient;
        this.light = light;
        this.light.color = parseInt(config.color, 16);
        this.light.intensity = config.intensity;
        this.light.distance = config.distance;
        this.light.angle = config.angle;
        this.light.target.set(config.target.x, config.target.y, config.target.z);
        this.light.castShadow = config.castShadow;
        this.light.shadowMapWidth = config.shadowMapSize.width;
        this.light.shadowMapHeight = config.shadowMapSize.height;
        this.light.shadowBias = config.shadowBias;
        this.light.shadowDarkness = config.shadowDarkness;
        this.light.shadowCameraNear = config.shadowCameraNearPlane;
        this.light.shadowCameraFar = config.shadowCameraFarPlane;
        this.light.shadowCameraFov = config.shadowCameraFov;
        this.light.shadowCameraLeft = config.shadowCameraSize.left;
        this.light.shadowCameraRight = config.shadowCameraSize.right;
        this.light.shadowCameraTop = config.shadowCameraSize.top;
        this.light.shadowCameraBottom = config.shadowCameraSize.bottom;
        this.light.setType(config.type);
        this.projectClient.subResource("lightSettings", this.lightSettingsSubscriber);
    }
    LightUpdater.prototype.destroy = function () {
        this.projectClient.unsubResource("lightSettings", this.lightSettingsSubscriber);
    };
    LightUpdater.prototype.config_setProperty = function (path, value) {
        switch (path) {
            case "type":
                this.light.setType(value);
                break;
            case "color":
                this.light.setColor(parseInt(value, 16));
                break;
            case "intensity":
                this.light.setIntensity(value);
                break;
            case "distance":
                this.light.setDistance(value);
                break;
            case "angle":
                this.light.setAngle(value);
                break;
            case "target.x":
                this.light.setTarget(value, null, null);
                break;
            case "target.y":
                this.light.setTarget(null, value, null);
                break;
            case "target.z":
                this.light.setTarget(null, null, value);
                break;
            case "castShadow":
                this.light.setCastShadow(value);
                break;
            case "shadowMapSize.width":
                this.light.setShadowMapSize(value, null);
                break;
            case "shadowMapSize.height":
                this.light.setShadowMapSize(null, value);
                break;
            case "shadowBias":
                this.light.setShadowBias(value);
                break;
            case "shadowDarkness":
                this.light.setShadowDarkness(value);
                break;
            case "shadowCameraNearPlane":
                this.light.setShadowCameraNearPlane(value);
                break;
            case "shadowCameraFarPlane":
                this.light.setShadowCameraFarPlane(value);
                break;
            case "shadowCameraFov":
                this.light.setShadowCameraFov(value);
                break;
            case "shadowCameraSize.top":
                this.light.setShadowCameraSize(value, null, null, null);
                break;
            case "shadowCameraSize.bottom":
                this.light.setShadowCameraSize(null, value, null, null);
                break;
            case "shadowCameraSize.left":
                this.light.setShadowCameraSize(null, null, value, null);
                break;
            case "shadowCameraSize.right":
                this.light.setShadowCameraSize(null, null, null, value);
                break;
        }
    };
    LightUpdater.prototype._updateLightShadowMap = function () {
        switch (this.lightSettings.pub.shadowMapType) {
            case "basic":
                this.light.actor.gameInstance.threeRenderer.shadowMap.type = THREE.BasicShadowMap;
                break;
            case "pcf":
                this.light.actor.gameInstance.threeRenderer.shadowMap.type = THREE.PCFShadowMap;
                break;
            case "pcfSoft":
                this.light.actor.gameInstance.threeRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
                break;
        }
        this.light.actor.gameInstance.threeScene.traverse(function (object) {
            var material = object.material;
            if (material != null)
                material.needsUpdate = true;
        });
    };
    LightUpdater.prototype._onLightResourceRecevied = function (resourceId, resource) {
        this.lightSettings = resource;
        this._updateLightShadowMap();
    };
    LightUpdater.prototype._onLightResourceEdited = function (resourceId, command, propertyName) {
        if (command === "setProperty" && propertyName === "shadowMapType")
            this._updateLightShadowMap();
    };
    return LightUpdater;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LightUpdater;

},{}]},{},[1]);
