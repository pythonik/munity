import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {IPost, PostStore} from '../service/post.store';

@Component({
    selector: 'app-master',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './master.component.html',
    styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit {

    @Input() posts: IPost[];

    constructor(private readonly store: PostStore) {
    }

    ngOnInit(): void {
    }

    onClick(post: IPost) {
        this.store.dispatch({
            name: 'SET_SELECTED',
            payload: post
        });
    }
}
