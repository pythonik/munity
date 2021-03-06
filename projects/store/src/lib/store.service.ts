import {IAction, IEffect, IMutationMap, IResultOfEffect, IStoreConfig} from './store.models';
import {BehaviorSubject, Observable} from 'rxjs';
import {distinctUntilChanged, first, flatMap, map, tap} from 'rxjs/operators';
import produce from 'immer';
import {ACTION_NOT_DEFINED, DISPATCH_IS_NOT_ALLOWED_SUBSCRIBER} from './store.constants';


const fastDeepClone = (arg) => JSON.parse(JSON.stringify(arg));

export abstract class Munity<S> {
    private readonly actionMap: IMutationMap<S>;
    private readonly store: BehaviorSubject<S>;
    private isDispatching = false;


    protected constructor(private readonly config: IStoreConfig<S>) {
        if (!config || !config.init || !config.mutations) {
            throw new Error('store config can not be empty or null');
        }
        this.actionMap = config.mutations;
        this.store = new BehaviorSubject(fastDeepClone(config.init));
    }

    take<T, R>(effect: IResultOfEffect<T, S, R>): Observable<R> {
        return effect.task().pipe(first(), flatMap((taskResult: T) => {
            this.dispatch({name: effect.action, payload: taskResult});
            return this.store.asObservable().pipe(map((state: S) => effect.selector(state)), distinctUntilChanged());
        }));
    }

    do<T>(effect: IEffect<T, S>, run?: boolean): void | Observable<T> {
        const task = effect.task().pipe(first(),
            tap((taskResult: T) => this.dispatch({name: effect.action, payload: taskResult})));
        if (run) {
            task.subscribe();
        } else {
            return task;
        }
    }

    snapshot(): S;
    snapshot<R>(selector: (current: S) => R): R;
    snapshot<R>(selector?: (current: S) => R): R | S {
        let result: R | S;
        if (selector) {
            result = selector(this.store.getValue());
        } else {
            result = this.store.getValue();
        }
        return fastDeepClone(result);
    }

    select(): Observable<S> ;
    select<R>(selector: (current: S) => R): Observable<R>;
    select<R>(selector?: (current: S) => R): Observable<R | S> {
        if (selector) {
            return this.store.asObservable().pipe(map((current: S) => selector(current)), distinctUntilChanged());
        }
        return this.store.asObservable().pipe(distinctUntilChanged());
    }

    dispatch(action: IAction): void {
        if (this.isDispatching) {
            throw new Error(DISPATCH_IS_NOT_ALLOWED_SUBSCRIBER);
        }

        if (!this.actionMap[action.name]) {
            throw new Error(ACTION_NOT_DEFINED);
        }
        this.isDispatching = true;
        try {
            const next: S = this.mutate(this.store.getValue(), action);
            this.setState(next);
        } finally {
            this.isDispatching = false;
        }

    }

    private setState(next: S) {
        this.store.next(next);
    }

    private mutate(current: S, action: IAction): S {
        const mutator = this.actionMap[action.name];
        const producer = produce(mutator);
        return producer(current as any, action.payload);

    }

    destroy() {
        this.store.complete();
    }

}
