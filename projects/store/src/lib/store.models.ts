import {Observable} from 'rxjs';

export interface IMutationMap<S> {
    [m: string]: (current: S, payload) => void;
}

export interface IStoreConfig<S> {
    init: S;
    mutations: IMutationMap<S>;
}


export type ActionID = string;

export interface IAction {
    readonly name: string;
    readonly payload: any;
}

export interface IEffect<T, S> {
    readonly action: ActionID;

    task(): Observable<T>;
}

export interface IResultOfEffect<T, S, R> extends IEffect<T, S> {
    selector(state: S): R;
}


