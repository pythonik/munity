import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {DetailComponent} from './detail/detail.component';
import {MasterComponent} from './master/master.component';
import {MasterDetailComponent} from './master-detail/master-detail.component';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
    declarations: [
        AppComponent, DetailComponent, MasterComponent, MasterDetailComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
