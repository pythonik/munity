import {Munity} from './store.service';
import {IStoreConfig} from './store.models';
import {Observable} from 'rxjs';
import {DISPATCH_IS_NOT_ALLOWED_SUBSCRIBER} from './store.constants';

interface IPost {
    userId: number;
    id: number;
    title: string;
    body: string;
}


interface IStateModel {
    posts: IPost[];
    selected: IPost;
}


class TestStore extends Munity<IStateModel> {
    constructor(config: IStoreConfig<IStateModel>) {
        super(config);
    }
}

const getTestInitState = () => ({
    posts: [
        getTestPostConstant()
    ],
    selected: null
});

const getTestPostConstant = () => ({
    userId: 2,
    id: 1,
    title: 'TITLE',
    body: 'BODY',
});

describe('Store', () => {
    describe('constructor', () => {

        it('throws error if config is illegal', () => {
            expect(() => new TestStore({} as IStoreConfig<IStateModel>)).toThrow();
            expect(() => new TestStore(null)).toThrow();
        });

        it('sets default state', () => {
            const initState = {
                posts: [],
                selected: null
            };
            const store = new TestStore({
                init: initState,
                mutations: {}
            });
            const current = store.snapshot();
            expect(current).toEqual(initState);
        });

        it('deep copy the initial state', () => {
            const initState = {
                posts: []
            } as IStateModel;
            const store = new TestStore({
                init: initState,
                mutations: {}
            });
            initState.posts.push(getTestPostConstant());
            const current = store.snapshot();
            expect(current).toEqual({
                posts: []
            });
        });

    });

    describe('select', () => {
        let store: TestStore;


        beforeEach(
            () => {
                store = new TestStore({
                    init: getTestInitState(),
                    mutations: {}
                });
            }
        );

        it('returns the entire state without selector', () => {
            const entireState: Observable<IStateModel> = store.select();
            entireState.subscribe((data: IStateModel) => {
                expect(data).toHaveProperty('posts');
                expect(data).toHaveProperty('selected');
            });
        });

        it('returns the sub state with selector', () => {
            const subState: Observable<IPost[]> = store.select((state: IStateModel) => state.posts);
            subState.subscribe((state: IPost[]) => {
                expect(state).toHaveLength(1);
            });
        });

        it('returns a new mutable object', () => {
            const entireState: Observable<IPost[]> = store.select((state: IStateModel) => state.posts);
            entireState.subscribe((data: IPost[]) => {
                const original = data[0].title;
                data[0].title = 'changed';
                expect(store.snapshot().posts[0].title).toEqual(original);
            });
        });

    });

    describe('snapshot', () => {
        let store: TestStore;
        beforeEach(
            () => {
                store = new TestStore({
                    init: getTestInitState(),
                    mutations: {}
                });
            }
        );
        it('returns the entire state without selector', () => {
            const entireState: IStateModel = store.snapshot();
            expect(entireState).toHaveProperty('posts');
            expect(entireState).toHaveProperty('selected');
        });
        it('returns the sub state with selector', () => {
            const subState: IPost[] = store.snapshot((state: IStateModel) => state.posts);
            expect(subState).toHaveLength(1);

        });
        it('returns a new mutable object', () => {
            const subState: IPost[] = store.snapshot((state: IStateModel) => state.posts);
            const original = subState[0].title;
            subState[0].title = 'changed';
            expect(store.snapshot().posts[0].title).toEqual(original);
        });
    });

    describe('dispatch', () => {
        const INSERT = 'INSERT';
        let store: TestStore;
        beforeEach(
            () => {
                store = new TestStore({
                    init: getTestInitState(),
                    mutations: {
                        INSERT: (current: IStateModel, payload: IPost) => {
                            current.posts.push(payload);
                        }
                    }
                });
            }
        );

        it('perform state mutation as defined', () => {
            store.dispatch({
                name: INSERT,
                payload: {title: 'new', body: 'new body'}
            });
            const mutated = store.snapshot((state: IStateModel) => state.posts);
            expect(mutated).toHaveLength(2);
        });

        it('throws error if mutation is not defined', () => {
            expect(() => store.dispatch({
                name: 'NOT_DEFINED',
                payload: {title: 'new', body: 'new body'}
            })).toThrow();

        });

        it.only('throws error if attempt to dispatch in middle of state change', (done) => {
            const entireState: Observable<IStateModel> = store.select();
            entireState.subscribe((data: IStateModel) => {
                try {
                    store.dispatch({
                        name: INSERT,
                        payload: {title: 'new', body: 'new body'}
                    });
                } catch (e) {
                    expect(e).toMatchObject(new Error(DISPATCH_IS_NOT_ALLOWED_SUBSCRIBER));
                    done();
                }
            });
        });
    });
});
