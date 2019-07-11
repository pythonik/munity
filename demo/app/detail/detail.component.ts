import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

import {Observable} from 'rxjs';
import {IPost, PostStore, State} from '../service/post.store';

@Component({
    selector: 'app-detail',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
    private detail$: Observable<IPost>;


    constructor(private store: PostStore) {
    }

    ngOnInit(): void {
        this.detail$ = this.store.select<IPost>((current: State) => {
            return current.selected;
        });
    }


}
