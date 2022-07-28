import {
  defineStore,
  PiniaCustomProperties,
  _StoreWithGetters,
  _StoreWithState,
  type DefineStoreOptions,
  type StateTree,
  type StoreDefinition,
  type _GettersTree,
} from "pinia";
import { UnwrapRef } from "vue";

type Key = string | number | symbol;
// type Item = Record<Key, unknown>;
type Item = { id: Key; [key: Key]: unknown }
type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;
type PickArrayKeys<T> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends unknown[] ? K : never;
  }[keyof T]
>;

type GenerateActions<T, S> = T & {
  [K in keyof S as `${string & K}Reset`]: () => S[K];
} & {
  [K in keyof PickArrayKeys<S> as `${string & K}Add`]: (
    item: ArrayElement<S[K]> | S[K],
    uniqueKey?: ArrayElement<S[K]> extends object ? keyof ArrayElement<S[K]> : never
  ) => S[K];
} & {
  [K in keyof PickArrayKeys<S> as `${string & K}Remove`]: (
    search: Key | Key[] | Partial<ArrayElement<S[K]>>,
    uniqueKey?: ArrayElement<S[K]> extends object ? keyof ArrayElement<S[K]> : never
  ) => S[K];
} & {
  [K in keyof PickArrayKeys<S> as `${string & K}Find`]: (
    search: Key | Key[] | Partial<ArrayElement<S[K]>>,
    uniqueKey?: ArrayElement<S[K]> extends object ? keyof ArrayElement<S[K]> : never
  ) => ArrayElement<S[K]> | undefined;
} & {
  [K in keyof PickArrayKeys<S> as `${string & K}FindMany`]: (
    search: Key | Key[] | Partial<ArrayElement<S[K]>>,
    uniqueKey?: ArrayElement<S[K]> extends object ? keyof ArrayElement<S[K]> : never
  ) => S[K];
};
type ActionType<Id extends string, S, G, A> = A & ThisType<A & UnwrapRef<S> & _StoreWithState<Id, S, G, A> & _StoreWithGetters<G> & PiniaCustomProperties & GenerateActions<A, S>>

const isPrimitive = (value: unknown) =>
  value === null ||
  value === undefined ||
  typeof value === "string" ||
  typeof value === "number" ||
  typeof value === "boolean";

export const generateStore = <
  Id extends string,
  S extends StateTree = {},
  G extends _GettersTree<S> = {},
  A = {}
>(
  store: DefineStoreOptions<Id, S, G, ActionType<Id, S, G, A>>
): StoreDefinition<Id, S, G, GenerateActions<A, S>> => {
  const generatedActions = Object.entries(store.state?.() ?? []).reduce(
    (a: Record<Key, unknown>, [key, value]) => {
      /**
       * itemReset method
       */
      a[`${key}Reset`] = function () {
        this[key] = store.state?.()[key];
        return this[key];
      };
      if (Array.isArray(value)) {
        /**
         * listAdd method
         */
        a[`${key}Add`] = function (
          this: { [key: Key]: Item[] },
          item: Item | Item[],
          uniqueKey = 'id'
        ) {
          const items = Array.isArray(item) ? item : [item];
          const array = this[key];
          items.forEach((newItem) => {
            const existingIndex = array.findIndex(
              (savedItem) => savedItem[uniqueKey] === newItem[uniqueKey]
            );
            if (existingIndex >= 0) array.splice(existingIndex, 1, newItem);
            else array.push(newItem);
          });
          return this[key];
        };
        /**
         * listRemove method
         */
        a[`${key}Remove`] = function (
          this: { [key: Key]: Item[] },
          search: Key | Key[] | Item,
          uniqueKey: 'id'
        ) {
          if (isPrimitive(search)) {
            this[key] = this[key].filter((el) => el.id !== search);
          } else if (Array.isArray(search)) {
            this[key] = this[key].filter((el) => !search.includes(el[uniqueKey]));
          } else if (typeof search === "object") {
            const searchEntries = Object.entries(search);
            this[key] = this[key].filter(
              (el) => !searchEntries.every(([key, value]) => el[key] === value)
            );
          }
          return this[key];
        };
        /**
         * listFind
         */
        a[`${key}Find`] = function (
          this: { [key: Key]: Item[] },
          search: Key | Key[] | Item,
          uniqueKey: 'id'
        ) {
          if (isPrimitive(search)) {
            return this[key].find((el) => el.id === search);
          } else if (Array.isArray(search)) {
            return this[key].find((el) => search.includes(el[uniqueKey]));
          } else if (typeof search === "object") {
            const searchEntries = Object.entries(search);
            return this[key].find((el) =>
              searchEntries.every(([key, value]) => el[key] === value)
            );
          }
          return undefined;
        };
        /**
         * listFindMany
         */
        a[`${key}FindMany`] = function (
          this: { [key: Key]: Item[] },
          search: Key | Key[] | Item,
          uniqueKey: 'id'
        ) {
          if (isPrimitive(search)) {
            return this[key].filter((el) => el.id === search);
          } else if (Array.isArray(search)) {
            return this[key].filter((el) => search.includes(el[uniqueKey]));
          } else if (typeof search === "object") {
            const searchEntries = Object.entries(search);
            return this[key].filter((el) =>
              searchEntries.every(([key, value]) => el[key] === value)
            );
          }
          return [];
        };
      }
      return a;
    },
    {}
  ) as GenerateActions<A, S>;

  store.actions = { ...store.actions, ...generatedActions };

  return defineStore(
    store as unknown as DefineStoreOptions<Id, S, G, GenerateActions<A, S>>
  );
};
