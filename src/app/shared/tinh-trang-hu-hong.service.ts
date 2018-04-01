import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class TinhTrangHuHongService {

  private allTinhTrangHuHongUrl = (<any>environment).server_url + '/api/v1/tinh-trang-hu-hong/all';
  private createTinhTrangHuHongUrl = (<any>environment).server_url + '/api/v1/tinh-trang-hu-hong/create';
  private updateTinhTrangHuHongUrl = (<any>environment).server_url + '/api/v1/tinh-trang-hu-hong/update';
  private deleteTinhTrangHuHongUrl = (<any>environment).server_url + '/api/v1/tinh-trang-hu-hong/delete';
  private importTinhTrangHuHongUrl = (<any>environment).server_url + '/api/v1/tinh-trang-hu-hong/import';
  private getPaginationUrl = environment.server_url + '/api/v1/tthh-phan-trang';

  private tinhTrangHuHongSource = new BehaviorSubject({});
  tinhTrangHuHong = this.tinhTrangHuHongSource.asObservable();

  constructor(private http: HttpClient) { }

  setTinTrangHuHongSource(data) {
    this.tinhTrangHuHongSource.next(data);
  }
    public get_pagination(toChucId, page) {
        return this.http.get(this.getPaginationUrl, {
            params: {
                to_chuc_id: toChucId,
                page: page
            }
        });    }
  getAll(){
    return this.http.get(this.allTinhTrangHuHongUrl);
  }
  create(data){
    return this.http.post(this.createTinhTrangHuHongUrl, data);
  }
  update(data){
    return this.http.put(this.updateTinhTrangHuHongUrl, data);
  }
  delete(data){
    return this.http.request('DELETE', this.deleteTinhTrangHuHongUrl, { body: data });
  }

  import(formData) {
    return this.http.post(this.importTinhTrangHuHongUrl, formData);
  }
}
