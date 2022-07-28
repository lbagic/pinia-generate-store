"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  generateStore: () => generateStore
});
module.exports = __toCommonJS(src_exports);
var import_pinia = require("pinia");
var isPrimitive = (value) => value === null || value === void 0 || typeof value === "string" || typeof value === "number" || typeof value === "boolean";
var generateStore = (store) => {
  var _a;
  const generatedActions = Object.entries(((_a = store.state) == null ? void 0 : _a.call(store)) ?? []).reduce(
    (a, [key, value]) => {
      a[`${key}Reset`] = function() {
        var _a2;
        this[key] = (_a2 = store.state) == null ? void 0 : _a2.call(store)[key];
        return this[key];
      };
      if (Array.isArray(value)) {
        a[`${key}Add`] = function(item, identifier = "id") {
          const items = Array.isArray(item) ? item : [item];
          const array = this[key];
          items.forEach((newItem) => {
            const existingIndex = array.findIndex(
              (savedItem) => savedItem[identifier] === newItem[identifier]
            );
            if (existingIndex >= 0)
              array.splice(existingIndex, 1, newItem);
            else
              array.push(newItem);
          });
          return this[key];
        };
        a[`${key}Remove`] = function(search, identifier) {
          if (isPrimitive(search)) {
            this[key] = this[key].filter((el) => el.id !== search);
          } else if (Array.isArray(search)) {
            this[key] = this[key].filter((el) => !search.includes(el[identifier]));
          } else if (typeof search === "object") {
            const searchEntries = Object.entries(search);
            this[key] = this[key].filter(
              (el) => !searchEntries.every(([key2, value2]) => el[key2] === value2)
            );
          }
          return this[key];
        };
        a[`${key}Find`] = function(search, identifier) {
          if (isPrimitive(search)) {
            return this[key].find((el) => el.id === search);
          } else if (Array.isArray(search)) {
            return this[key].find((el) => search.includes(el[identifier]));
          } else if (typeof search === "object") {
            const searchEntries = Object.entries(search);
            return this[key].find(
              (el) => searchEntries.every(([key2, value2]) => el[key2] === value2)
            );
          }
          return void 0;
        };
        a[`${key}FindMany`] = function(search, identifier) {
          if (isPrimitive(search)) {
            return this[key].filter((el) => el.id === search);
          } else if (Array.isArray(search)) {
            return this[key].filter((el) => search.includes(el[identifier]));
          } else if (typeof search === "object") {
            const searchEntries = Object.entries(search);
            return this[key].filter(
              (el) => searchEntries.every(([key2, value2]) => el[key2] === value2)
            );
          }
          return [];
        };
      }
      return a;
    },
    {}
  );
  store.actions = { ...store.actions, ...generatedActions };
  return (0, import_pinia.defineStore)(
    store
  );
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  generateStore
});
