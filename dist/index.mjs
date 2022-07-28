// src/index.ts
import {
  defineStore
} from "pinia";
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
  return defineStore(
    store
  );
};
export {
  generateStore
};
