import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class BangTinhCongSuaChuaService {

  private allBTCSCUrl = environment.server_url + '/api/v1/bang-tinh-cong-sua-chua/all';
  private createBTCSCUrl = environment.server_url + '/api/v1/bang-tinh-cong-sua-chua/create';
  private updateBTCSCUrl = environment.server_url + '/api/v1/bang-tinh-cong-sua-chua/update';
  private deleteBTCSCUrl = environment.server_url + '/api/v1/bang-tinh-cong-sua-chua/delete';
  private filterBangTinhCongSuaChuaUrl = environment.server_url + '/api/v1/bang-tinh-cong-sua-chua/filter';
  private uploadBTCSUrl = environment.server_url + '/api/v1/bang-tinh-cong-sua-chua/upload';
    private paginationUrl = environment.server_url + '/api/v1/bang-tinh-cong-sua-chua/pagination';


  private bangTinhCongSuaChuaSource = new BehaviorSubject({});
  bangTinhCongSuaChua = this.bangTinhCongSuaChuaSource.asObservable();

  constructor(private http: HttpClient) { }

  setBangTinhCongSuaChuaSource(data) {
    return this.bangTinhCongSuaChuaSource.next(data);
  }

  public all() {
    return this.http.get(this.allBTCSCUrl);
  }
    public get_pagination(page) {
        return this.http.get(this.paginationUrl, {
            params: {
                page: page
            }
        });    }
  public create(data) {
    return this.http.post(this.createBTCSCUrl, data);
  }
  public upload(data) {
    return this.http.post(this.uploadBTCSUrl, data);
  }
  public update(data) {
    return this.http.put(this.updateBTCSCUrl, data);
  }

  public delete(data) {
    return this.http.request('DELETE', this.deleteBTCSCUrl, { body: data });
  }

  filter(query) {
    return this.http.get(this.filterBangTinhCongSuaChuaUrl, {
      params: {
        query: query
      }
    });
  }
}
