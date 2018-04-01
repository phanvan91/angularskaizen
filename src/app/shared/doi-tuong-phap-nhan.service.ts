import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from "rxjs/Observable";
import {Select2OptionData} from "ng2-select2";

@Injectable()
export class DoiTuongPhapNhanService {
  private allDoiTuongPhapNhanUrl = environment.server_url + '/api/v1/doi-tuong-phap-nhan/all';
  public searchDoiTuongPhapNhanUrl = environment.server_url + '/api/v1/doi-tuong-phap-nhan/search';
  private createDoiTuongPhapNhanUrl = environment.server_url + '/api/v1/doi-tuong-phap-nhan/create';
  private updateDoiTuongPhapNhanUrl = environment.server_url + '/api/v1/doi-tuong-phap-nhan/update';
  private deleteDoiTuongPhapNhanUrl = environment.server_url + '/api/v1/doi-tuong-phap-nhan/delete';
    public paginationDoiTuongPhapNhanUrl = environment.server_url + '/api/v1/doi-tuong-phap-nhan/pagination';

  private doiTuongPhapNhanSource = new BehaviorSubject({});
  doiTuongPhapNhan = this.doiTuongPhapNhanSource.asObservable();

  constructor(private http: HttpClient) { }

  public setDoiTuongPhapNhanSource(data) {
    return this.doiTuongPhapNhanSource.next(data);
  }

    public getAll(): Observable<Array<Select2OptionData>> {
        return this.http.get(this.allDoiTuongPhapNhanUrl, {}).map((res: any) => {
          console.log(res);
            return  res ? res.map(item => {
                item.text = item.ten; return item;
            }) : null;
        });
    }
    public pagination(page) {
        return this.http.get(this.paginationDoiTuongPhapNhanUrl, {
            params: {
                page: page
            }
        });
    }
  public all(toChucId) {
    return this.http.get(this.allDoiTuongPhapNhanUrl, {
      params: {
        to_chuc_id: toChucId
      }
    });
  }

  public create(data) {
    return this.http.post(this.createDoiTuongPhapNhanUrl, data);
  }

  public update(data) {
    return this.http.put(this.updateDoiTuongPhapNhanUrl, data);
  }

  public delete(data) {
    return this.http.request('DELETE', this.deleteDoiTuongPhapNhanUrl, { body: data });
  }

}
