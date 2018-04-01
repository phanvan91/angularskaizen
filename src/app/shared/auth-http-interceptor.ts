import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthHttpInterceptor {
  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('sstoken');
    if (token) {
      const authReq = req.clone({ headers: req.headers
          .set('Authorization', 'Bearer ' + JSON.parse(token).access_token)
      });


      return next.handle(authReq)
        .catch((error, caught) => {
          console.log('Error Occurred');
          console.log(error);
          return Observable.throw(error);
        }) as any;
    } else {
      return next.handle(req);
    }

  }
}
