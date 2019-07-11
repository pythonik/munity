import {Injectable} from '@angular/core';
import {Munity} from '../../../projects/store/src/lib/store.service';
import {IStoreConfig} from '../../../projects/store/src/lib/store.models';

export interface IPost {
    userId: number;
    id: number;
    title: string;
    body: string;
}


export interface State {
    posts: IPost[];
    name: string;
    selected: IPost;
}

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

@Injectable()
export class PostStore extends Munity<State> {
    constructor() {
        super(postStoreConfig);
    }

}
