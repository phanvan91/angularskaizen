import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/share';

@Injectable()
export class NguyenNhanService {
  private allNguyenNhangUrl = (<any>environment).server_url + '/api/v1/nguyen-nhan/all';
  private createNguyenNhanUrl = (<any>environment).server_url + '/api/v1/nguyen-nhan/create';
  private updateNguyenNhanUrl = (<any>environment).server_url + '/api/v1/nguyen-nhan/update';
  private deleteNguyenNhanUrl = (<any>environment).server_url + '/api/v1/nguyen-nhan/delete';
  private filterNguyenNhanUrl = (<any>environment).server_url + '/api/v1/nguyen-nhan/filter';
  private importNguyenNhanUrl = (<any>environment).server_url + '/api/v1/nguyen-nhan/import';
    private getPaginationUrl = environment.server_url + '/api/v1/nguyen-nhan-phan-trang';

  private nguyenNhanSource = new BehaviorSubject({});
  nguyenNhan = this.nguyenNhanSource.asObservable();

  constructor(private http: HttpClient) { }

  setNguyenNhanSource(data){
    this.nguyenNhanSource.next(data);
  }
    public get_pagination(toChucId , page) {
        return this.http.get(this.getPaginationUrl, {
            params: {
                to_chuc_id: toChucId,
                page: page
            }
        });    }


    public all() {
        return this.http.get(this.allNguyenNhangUrl);
    }
  create(data){
    return this.http.post(this.createNguyenNhanUrl, data);
  }
  update(data){
    return this.http.put(this.updateNguyenNhanUrl, data);
  }
  delete(data){
    return this.http.request('DELETE', this.deleteNguyenNhanUrl, { body: data });
  }

  filter(query) {
    return this.http.get(this.filterNguyenNhanUrl, {
      params: {
        query: query
      }
    }).share();
  }

  import(formData) {
    return this.http.post(this.importNguyenNhanUrl, formData);
  }
}
