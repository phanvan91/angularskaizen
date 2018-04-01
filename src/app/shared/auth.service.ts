import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';

@Injectable()
export class AuthService {

  private loginUrl = environment.server_url + '/api/v1/auth/login';
  private meUrl = environment.server_url + '/api/v1/auth/me';
    private updateAccountUrl = environment.server_url + '/api/v1/auth/updateAccount';


  private credentialsSource = new BehaviorSubject({});
  credentials = this.credentialsSource.asObservable();

  constructor(private http: HttpClient, private route: Router) { }

  setCredentialsSource(data) {
    return this.credentialsSource.next(data);
  }

  public updateAccount(data) {
      return this.http.put(this.updateAccountUrl, data);

  }
    public login(data) {
        return this.http.post(this.loginUrl, data);
    }

  public saveInfo(data) {
    localStorage.setItem('sstoken', JSON.stringify(data));
  }

  public me() {
    return this.http.get(this.meUrl);
  }

  public getToChuc() {
    return this.http.get(environment.server_url + '/api/v1/to-chuc', {
      headers: {
        'Authorization' : 'Bearer ' + JSON.parse(localStorage.getItem('sstoken')).access_token
      }
    }).catch(err => {
        localStorage.removeItem('sstoken');
        this.route.navigate(['auth', 'login']);
        return Observable.throw('Server error');
    });
  }
}
