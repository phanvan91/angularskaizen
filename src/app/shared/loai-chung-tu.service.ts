import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class LoaiChungTuService {

  private allLoaiChungTutUrl = environment.server_url + '/api/v1/loai-chung-tu/all';
  private createLoaiChungTutUrl = environment.server_url + '/api/v1/loai-chung-tu/create';
  private updateLoaiChungTutUrl = environment.server_url + '/api/v1/loai-chung-tu/update';
  private deleteLoaiChungTutUrl = environment.server_url + '/api/v1/loai-chung-tu/delete';

  private loaiChungTuSource = new BehaviorSubject({});
  loaiChungTu = this.loaiChungTuSource.asObservable();

  constructor(private http: HttpClient) { }

  setLoaiChungTuSource(data) {
    return this.loaiChungTuSource.next(data);
  }

  public all(toChucId) {
    return this.http.get(this.allLoaiChungTutUrl, {
      params: {
        to_chuc_id: toChucId
      }
    });
  }

  public create(data) {
    return this.http.post(this.createLoaiChungTutUrl, data);
  }

  public update(data) {
    return this.http.put(this.updateLoaiChungTutUrl, data);
  }

  public delete(data) {
    return this.http.request('DELETE', this.deleteLoaiChungTutUrl, { body: data });
  }
}
