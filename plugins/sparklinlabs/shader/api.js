(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

SupAPI.registerPlugin("typescript", "Sup.Shader", {
    code: "module Sup {\n  export class Shader extends Asset {\n  }\n}\n",
    defs: "declare module Sup {\n  class Shader extends Asset {\n    dummyShaderMember;\n  }\n}\n",
});

},{}]},{},[1]);
