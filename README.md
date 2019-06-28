[![Coverage Status](https://coveralls.io/repos/github/pythonik/munity/badge.svg?branch=master)](https://coveralls.io/github/pythonik/munity?branch=master)
[![Build Status](https://travis-ci.com/pythonik/munity.svg?branch=master)](https://travis-ci.com/pythonik/munity)
# ![](./icon.png) Munity 

Munity is an opinionated Angular state management library based on [Immer.js](https://github.com/immerjs/immer). This library is heavily inspired by [ngrx](), [redux-observable]().   
It is currently **WORK IN PROGRESS**, but It is fully functional.

To run the sample application
```npm install``` , then ```ng serve```


## Concepts
* *Effect* is an asynchronous operation with state mutation.
* *Mutation* is a function takes the current state, payload as input and mutate the state in its body.

### Select
To read the content of the store as Rx.js observable
```ts
interface StateModel {
    posts:IPost[];
    loading: false
}
// select substate
stateChange = this.store.select((current)=>{current.posts});
// select entire store
stateChange = this.store.select();
```
To just read the current value
```ts
interface StateModel {
    posts:IPost[];
    loading: false
}
// select substate
current = this.store.snapshot((current)=>{current.posts});
// select entire store
current = this.store.snapshot();
```

### Effect
To make an effect just implement the ```Effect``` interface, and provide async operation in task function. Implement ```IResultOfEffect``` to provide a selector function to retrieve the result of state mutation
```ts
@Injectable({providedIn: 'root'})
export class SideEffectOfLoadPost implements IResultOfEffect<IPost[], State, IPost[]> {
    readonly action: ActionID = 'SET_POSTS';

    constructor(private readonly api: BackendService) {

    }

    selector(state: State) {
        return state.posts;
    }

    task(): Observable<IPost[]> {
        return this.api.getPostList();
    }

}
```

### Mutation
Mutation is just a function placed in store config object, perform state directly on current state.
```ts
const postStoreConfig: IStoreConfig<State> = {
    init: {posts: [], name: '', selected: null},
    mutations: {
        SET_POSTS: (current: State, payload: IPost[]) => {
            current.posts = payload;
        },
        SET_SELECTED: (current: State, payload: IPost) => {
            current.selected = payload;
        }
    }
};
```
