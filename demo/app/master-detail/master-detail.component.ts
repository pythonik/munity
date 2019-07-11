import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';


import {Observable} from 'rxjs';
import {IPost, PostStore, State} from '../service/post.store';
import {SideEffectOfLoadPost} from '../service/loadpost.effect';



@Component({
    selector: 'app-master-detail',
    templateUrl: './master-detail.component.html',
    styleUrls: ['./master-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [PostStore]
})
export class MasterDetailComponent implements OnInit {
    private post$: Observable<IPost[]>;
    private count$: Observable<number>;

    constructor(private readonly store: PostStore, private side: SideEffectOfLoadPost) {
    }

    ngOnInit(): void {
        this.post$ = this.store.take<IPost[], IPost[]>(this.side);
        this.count$ = this.store.select<number>((current: State) => current.posts.length);
    }


}
