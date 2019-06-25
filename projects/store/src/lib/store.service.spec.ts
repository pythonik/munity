import {Munity} from './store.service';
import {IStoreConfig} from './store.models';

interface IPost {
    userId: number;
    id: number;
    title: string;
    body: string;
}


interface IStateModel {
    posts: IPost[];
}


class TestStore extends Munity<IStateModel> {
    constructor(config: IStoreConfig<IStateModel>) {
        super(config);
    }
}

const getTestPostConstant = () => ({
    userId: 2,
    id: 1,
    title: 'TITLE',
    body: 'BODY',
});
describe('Store', () => {


    it('constructor throws error if config is illegal', () => {
        expect(() => new TestStore({} as IStoreConfig<IStateModel>)).toThrow();
        expect(() => new TestStore(null)).toThrow();
    });

    it('constructor sets default state', () => {
        const initState = {
            posts: []
        };
        const store = new TestStore({
            init: initState,
            mutations: {}
        });
        const current = store.snapshot();
        expect(current).toEqual(initState);
    });

    it('modify reference of init state does not change store', () => {
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
