import {Component,Injectable} from '@angular/core';

/*
@Component({
  selector: 'base',
  templateUrl: 'app//base/base.html',
  styleUrls: ['app//base/base.css'],
  providers: [],
  directives: [],
  pipes: []
})
*/
@Injectable()
export class Base {
  static ONE_DEG = Math.PI / 180.0;

  constructor() {}

}
