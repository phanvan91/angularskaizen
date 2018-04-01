import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class TrungTamBaoHanhService {

  private allTrungTamBaoHanhUrl = environment.server_url + '/api/v1/trung-tam-bao-hanh/all';
  private createTrungTamBaoHanhUrl = environment.server_url + '/api/v1/trung-tam-bao-hanh/create';
  private updaterungTamBaoHanhUrl = environment.server_url + '/api/v1/trung-tam-bao-hanh/update';
  private deleteTrungTamBaoHanhUrl = environment.server_url + '/api/v1/trung-tam-bao-hanh/delete';
  private getListTrungTamBaoHanhUrl = environment.server_url + '/api/v1/trung-tam-bao-hanh/get-list';
  private getPaginationUrl = environment.server_url + '/api/v1/trung-tam-bao-hanh/phan-trang';

  private trungTamBaoHanhSource = new BehaviorSubject({});
  trungTamBaoHanh = this.trungTamBaoHanhSource.asObservable();

  private tTamSelectId = new BehaviorSubject({});
  trungTamSelect = this.tTamSelectId.asObservable();
  constructor(private http: HttpClient) { }

  setTTSelect(data) {
    return this.tTamSelectId.next(data);
  }

  setTrungTamBaoHanhSource(data) {
    return this.trungTamBaoHanhSource.next(data);
  }
    public get_pagination(page) {
        return this.http.get(this.getPaginationUrl, {
            params: {
                page: page
            }
        });
    }
  public all() {
    return this.http.get(this.allTrungTamBaoHanhUrl);
  }
  create(data) {
    return this.http.post(this.createTrungTamBaoHanhUrl, data);
  }
  update(data) {
    return this.http.put(this.updaterungTamBaoHanhUrl, data);
  }
  delete(data) {
    return this.http.request('DELETE', this.deleteTrungTamBaoHanhUrl, { body: data });
  }
  getList() {
    return this.http.get(this.getListTrungTamBaoHanhUrl);
  }
}
