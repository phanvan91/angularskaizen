import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class LoaiNguoiDungService {

  private allLoaiNguoiDungUrl = environment.server_url + '/api/v1/loai-nguoi-dung/all';
  private createLoaiNguoiDungUrl = environment.server_url + '/api/v1/loai-nguoi-dung/create';
  private updateLoaiNguoiDungUrl = environment.server_url + '/api/v1/loai-nguoi-dung/update';
  private deleteLoaiNguoiDungUrl = environment.server_url + '/api/v1/loai-nguoi-dung/delete';

  private loaiNguoiDungSource = new BehaviorSubject({});
  loaiNguoiDung = this.loaiNguoiDungSource.asObservable();

  constructor(private http: HttpClient) { }

  setLoaiNguoiDungSource(data) {
    return this.loaiNguoiDungSource.next(data);
  }

  public all(toChucId) {
    return this.http.get(this.allLoaiNguoiDungUrl, {
      params: {
        to_chuc_id: toChucId
      }
    });
  }

  public create(data) {
    return this.http.post(this.createLoaiNguoiDungUrl, data);
  }

  public update(data) {
    return this.http.put(this.updateLoaiNguoiDungUrl, data);
  }

  public delete(data) {
    return this.http.request('DELETE', this.deleteLoaiNguoiDungUrl, { body: data });
  }
}
