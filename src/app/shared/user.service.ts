import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class UserService {

  private allUserUrl = environment.server_url + '/api/v1/user/all';
  private createUserUrl = environment.server_url + '/api/v1/user/create';
  private updateUserUrl = environment.server_url + '/api/v1/user/update';
  private deleteUserUrl = environment.server_url + '/api/v1/user/delete';
  private searchUserUrl = environment.server_url + '/api/v1/user/search';
  public searchNhanVienUrl = environment.server_url + '/api/v1/user/search-nhan-vien';
    public paginationUrl = environment.server_url + '/api/v1/user/pagination';


  private userSource = new BehaviorSubject({});
  userInfo = this.userSource.asObservable();

  constructor(private http: HttpClient) { }


    public pagination(page, trung_tam_id, tram_id) {
        return this.http.get(this.paginationUrl, {
            params: {
                page: page,
                trung_tam_id: trung_tam_id,
                tram_id: tram_id
            }
        });
    }
  setUserSource(data) {
    return this.userSource.next(data);
  }
  public getUsers(type, tram_bao_hanh_id) {
        return this.http.get(this.searchUserUrl, {
            params: {
                type: type,
                tram_bao_hanh_id: tram_bao_hanh_id
            }
        });    }
  public all(toChucId) {
    return this.http.get(this.allUserUrl, {
      params: {
        to_chuc_id: toChucId
      }
    });
  }

  public create(data) {
    return this.http.post(this.createUserUrl, data);
  }

  public update(data) {
    return this.http.put(this.updateUserUrl, data);
  }

  public delete(data) {
    return this.http.request('DELETE', this.deleteUserUrl, { body: data });
  }
}
