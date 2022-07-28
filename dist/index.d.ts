import { StateTree, _GettersTree, DefineStoreOptions, StoreDefinition, _StoreWithState, _StoreWithGetters, PiniaCustomProperties } from 'pinia';
import { UnwrapRef } from 'vue';

declare type Key = string | number | symbol;
declare type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;
declare type PickArrayKeys<T> = Pick<T, {
    [K in keyof T]: T[K] extends unknown[] ? K : never;
}[keyof T]>;
declare type GenerateActions<T, S> = T & {
    [K in keyof S as `${string & K}Reset`]: () => S[K];
} & {
    [K in keyof PickArrayKeys<S> as `${string & K}Add`]: (item: ArrayElement<S[K]> | S[K], identifier?: ArrayElement<S[K]> extends object ? keyof ArrayElement<S[K]> : never) => S[K];
} & {
    [K in keyof PickArrayKeys<S> as `${string & K}Remove`]: (search: Key | Key[] | Partial<ArrayElement<S[K]>>, identifier?: ArrayElement<S[K]> extends object ? keyof ArrayElement<S[K]> : never) => S[K];
} & {
    [K in keyof PickArrayKeys<S> as `${string & K}Find`]: (search: Key | Key[] | Partial<ArrayElement<S[K]>>, identifier?: ArrayElement<S[K]> extends object ? keyof ArrayElement<S[K]> : never) => ArrayElement<S[K]> | undefined;
} & {
    [K in keyof PickArrayKeys<S> as `${string & K}FindMany`]: (search: Key | Key[] | Partial<ArrayElement<S[K]>>, identifier?: ArrayElement<S[K]> extends object ? keyof ArrayElement<S[K]> : never) => S[K];
};
declare type ActionType<Id extends string, S, G, A> = A & ThisType<A & UnwrapRef<S> & _StoreWithState<Id, S, G, A> & _StoreWithGetters<G> & PiniaCustomProperties & GenerateActions<A, S>>;
declare const generateStore: <Id extends string, S extends StateTree = {}, G extends _GettersTree<S> = {}, A = {}>(store: DefineStoreOptions<Id, S, G, ActionType<Id, S, G, A>>) => StoreDefinition<Id, S, G, GenerateActions<A, S>>;

export { generateStore };
