import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import {AuthService} from './auth.service';

@Injectable()
export class ToChucResolverService implements Resolve<object> {

  constructor(private auth: AuthService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.auth.getToChuc();
  }

}
