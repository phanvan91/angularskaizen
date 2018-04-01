import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class HuongKhacPhucService {

  private allHuongKhacPhucUrl = (<any>environment).server_url + '/api/v1/huong-khac-phuc/all';
  private createHuongKhacPhucUrl = (<any>environment).server_url + '/api/v1/huong-khac-phuc/create';
  private updateHuongKhacPhucUrl = (<any>environment).server_url + '/api/v1/huong-khac-phuc/update';
  private deleteHuongKhacPhucUrl = (<any>environment).server_url + '/api/v1/huong-khac-phuc/delete';
  private filterHuongKhacPhucUrl = (<any>environment).server_url + '/api/v1/huong-khac-phuc/filter';
  private importHuongKhacPhucUrl = (<any>environment).server_url + '/api/v1/huong-khac-phuc/import';
    private getPaginationUrl = environment.server_url + '/api/v1/hkp-phan-trang';

  private huongKhacPhucSource = new BehaviorSubject({});
  huongKhacPhuc = this.huongKhacPhucSource.asObservable();

  constructor(private http: HttpClient) { }

  setHuongKhacPhucSource(data){
    this.huongKhacPhucSource.next(data);
  }
    public get_pagination(toChucId , page) {
        return this.http.get(this.getPaginationUrl, {
            params: {
                to_chuc_id: toChucId,
                page: page
            }
        });    }

  getAll(){
    return this.http.get(this.allHuongKhacPhucUrl);
  }
  create(data){
    return this.http.post(this.createHuongKhacPhucUrl, data);
  }
  update(data){
    return this.http.put(this.updateHuongKhacPhucUrl, data);
  }
  delete(data){
    return this.http.request('DELETE', this.deleteHuongKhacPhucUrl, { body: data });
  }

  filter(query) {
    return this.http.get(this.filterHuongKhacPhucUrl, {
      params: {
        query: query
      }
    });
  }

  import(formData) {
    return this.http.post(this.importHuongKhacPhucUrl, formData);
  }
}
