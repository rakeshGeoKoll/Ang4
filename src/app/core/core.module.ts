import { NgModule, Optional, SkipSelf } from '@angular/core';
import { SettingsService } from './settings/settings.service';
import { ThemesService } from './themes/themes.service';
import { TranslatorService } from './translator/translator.service';
import { MenuService } from './menu/menu.service';
import { MenuGuardService } from './menu/menu-guard.service';
import { throwIfAlreadyLoaded } from './module-import-guard';
//import { ResultModel } from './models/result-model';

@NgModule({
    imports: [
        //ResultModel,
    ],
    providers: [
        SettingsService,
        ThemesService,
        TranslatorService,
        MenuService,
        MenuGuardService,
    ],
    declarations: [
        //ResultModel,
    ],
    exports: [
        //ResultModel,
    ]
})
export class CoreModule {
    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }
}
