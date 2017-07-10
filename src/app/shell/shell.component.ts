import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './shell.component.html',
  encapsulation: ViewEncapsulation.None // TODO: what is ViewEncapsulation.None ?
})
export class ShellComponent implements OnInit {

    //constructor(private router: Router) { console.log('ShellComponent:ctor'); }
    constructor() { console.log('ShellComponent:ctor'); }
  ngOnInit() {
    console.log('ShellComponent:ngOnInit(0)');
      if (window.location.hash.indexOf('id_token') >= 0) {
        //Redirect to home
        //this.router.navigate(['']);
      }
  }

}
