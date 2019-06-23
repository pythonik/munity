import {Injectable} from '@angular/core';
import {ActionID, IResultOfEffect} from '../../../projects/store/src/lib/store.models';
import {IPost, State} from './post.store';
import {Observable} from 'rxjs';
import {BackendService} from './backend.service';


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
