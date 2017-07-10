import { Injectable } from '@angular/core';
import { AuthService } from '../../security/auth.service';

@Injectable()
export class HomeMenuService {

    homeMenu = {
        text: 'Home',
        link: '/',
        icon: 'icon-home',
        role: 'Guest'
    };
}