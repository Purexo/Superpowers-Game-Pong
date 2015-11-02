(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

SupAPI.registerPlugin("typescript", "Sup.Font", {
    code: "namespace Sup {\n  let canvas = window.document.createElement(\"canvas\");\n  canvas.width = 1; canvas.height = 1;\n\n  export class Font extends Asset {\n    getTextWidth(text) {\n      if (this.__inner.isBitmap) {\n        return text.length * this.__inner.gridWidth / this.__inner.pixelsPerUnit;\n      } else {\n        let ctx = canvas.getContext(\"2d\");\n        ctx.font = `${this.__inner.size}px ${this.__inner.name}`;\n        return ctx.measureText(text).width / this.__inner.pixelsPerUnit;\n      }\n    }\n  }\n}\n",
    defs: "declare namespace Sup {\n  class Font extends Asset {\n    getTextWidth(text: string): number;\n  }\n}\n",
});
SupAPI.registerPlugin("typescript", "TextRenderer", {
    code: "namespace Sup {\r\n  export class TextRenderer extends Sup.ActorComponent {\r\n    constructor(actor: Actor, text: string|number, pathOrAsset: string|Font, options: any={}) {\r\n      super(actor);\r\n      this.__inner = new SupEngine.componentClasses.TextRenderer(this.actor.__inner);\r\n\r\n      if (options.color != null) options.color = options.color.getHexString();\r\n      this.__inner.setOptions(options);\r\n      if (text != null) this.__inner.setText(`${text}`);\r\n      if (pathOrAsset != null) this.setFont(pathOrAsset);\r\n\r\n      this.__inner.__outer = this;\r\n      this.actor.textRenderer = this;\r\n    }\r\n    destroy() {\r\n      this.actor.textRenderer = null;\r\n      super.destroy();\r\n    }\r\n\r\n    getFont() { return this.__inner.font.__outer; }\r\n    setFont(pathOrAsset: string|Font) {\r\n      let fontAsset = (typeof pathOrAsset === \"string\") ? get(pathOrAsset, Font) : <Font>pathOrAsset;\r\n      this.__inner.setFont(fontAsset.__inner);\r\n      return this;\r\n    }\r\n    getText() { return this.__inner.text; }\r\n    setText(text: string|number) {\r\n      this.__inner.setText(`${text}`);\r\n      return this;\r\n    }\r\n    getColor() {\r\n      var color = (this.__inner.options.color != null) ? this.__inner.options.color : this.__inner.font.color;\r\n      return new Sup.Color(1, 1, 1).setHex(parseInt(color, 16));\r\n    }\r\n    setColor(color) {\r\n      var options = this.__inner.options;\r\n      options.color = color.getHexString();\r\n      this.__inner.setOptions(options);\r\n      return this;\r\n    }\r\n    getAlignment() { return this.__inner.options.alignment; }\r\n    setAlignment(alignment) {\r\n      var options = this.__inner.options;\r\n      options.alignment = alignment;\r\n      this.__inner.setOptions(options);\r\n      return this;\r\n    }\r\n    getVerticalAlignment() { return this.__inner.options.verticalAlignment; }\r\n    setVerticalAlignment(verticalAlignment) {\r\n      var options = this.__inner.options;\r\n      options.verticalAlignment = verticalAlignment;\r\n      this.__inner.setOptions(options);\r\n      return this;\r\n    }\r\n    getSize() {\r\n      var size = (this.__inner.options.size != null) ? this.__inner.options.size : this.__inner.font.size;\r\n      return size;\r\n    }\r\n    setSize(size) {\r\n      var options = this.__inner.options;\r\n      options.size = size;\r\n      this.__inner.setOptions(options);\r\n      return this;\r\n    }\r\n    getOpacity() { return this.__inner.opacity; }\r\n    setOpacity(opacity) {\r\n      this.__inner.setOpacity(opacity);\r\n      return this;\r\n    }\r\n  }\r\n}\r\n",
    defs: "declare namespace Sup {\r\n  class TextRenderer extends ActorComponent {\r\n    constructor(actor: Actor, text?: string|number, pathOrAsset?: string|Font, options?: {alignment?: string; verticalAlignment?: string; size?: number; color?: Color;});\r\n\r\n    getFont(): Font;\r\n    setFont(pathOrAsset: string|Font): TextRenderer;\r\n    getText(): string;\r\n    setText(text: string|number): TextRenderer;\r\n    getColor(): Color;\r\n    setColor(color: Color): TextRenderer;\r\n    getAlignment(): string;\r\n    setAlignment(alignment: string): TextRenderer;\r\n    getVerticalAlignment(): string;\r\n    setVerticalAlignment(verticalAlignment: string): TextRenderer;\r\n    getSize(): number;\r\n    setSize(size: number): TextRenderer;\r\n    getOpacity(): number;\r\n    setOpacity(opacity: number): TextRenderer;\r\n  }\r\n}\r\n",
    exposeActorComponent: { propertyName: "textRenderer", className: "Sup.TextRenderer" }
});

},{}]},{},[1]);
