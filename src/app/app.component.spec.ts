/* tslint:disable:no-unused-variable */

import { TestBed, async} from '@angular/core/testing';
import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';
import { ShellModule } from './shell/shell.module';
import { SharedModule } from './shared/shared.module';
//import { RoutesModule } from './routes/routes.module';
import { APP_BASE_HREF } from '@angular/common';

describe('App: Ng2angle', () => {
    beforeEach(() => {

        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

        TestBed.configureTestingModule({
            declarations: [
                AppComponent
            ],
            imports: [
                CoreModule,
                ShellModule,
                SharedModule,
                //RoutesModule
            ],
            providers: [
                { provide: APP_BASE_HREF, useValue: '/' }
            ]
        });
    });

    it('should create the app', async(() => {
        let fixture = TestBed.createComponent(AppComponent);
        let app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));

});
