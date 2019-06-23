import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IPost} from './post.store';
import {Observable} from 'rxjs';
import {delay} from 'rxjs/operators';

const URL = 'https://jsonplaceholder.typicode.com/posts';

@Injectable({providedIn: 'root'})
export class BackendService {

    constructor(private readonly httpClient: HttpClient) {

    }

    getPostList(): Observable<IPost[]> {
        return this.httpClient.get<IPost[]>(URL).pipe(delay(3000));
    }

    createPost(post: IPost): Observable<IPost> {
        return this.httpClient.post<IPost>(URL, post);
    }

}
