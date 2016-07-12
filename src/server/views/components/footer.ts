import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-footer',
  template: require('./footer.html'),
  directives: []
})
export class Footer implements OnInit {
  constructor() { }
  seo = {
    title: 'SEO'
  };
  ngOnInit() { }
}