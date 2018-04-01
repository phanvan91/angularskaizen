import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class NganhHangService {

  private allNganhUrl = environment.server_url + '/api/v1/nganh-hang';

    private createNganhHangUrl = environment.server_url + '/api/v1/nganh-hang/create';
    private updateNganhHangUrl = environment.server_url + '/api/v1/nganh-hang/update';
    private deleteNganhHangUrl = environment.server_url + '/api/v1/nganh-hang/delete';
    private getPaginationUrl = environment.server_url + '/api/v1/nganh-hang-phan-trang';

  private nganhHangSource = new BehaviorSubject({});
  nganhHang = this.nganhHangSource.asObservable();

  constructor(private http: HttpClient) { }

  setNganhHangSource(data) {
    return this.nganhHangSource.next(data);
  }

  public all() {
    return this.http.get(this.allNganhUrl);
  }
    public get_pagination(toChucId, page) {
        return this.http.get(this.getPaginationUrl, {
            params: {
                to_chuc_id: toChucId,
                page: page
            }
        });    }
  public create(data) {
    return this.http.post(this.createNganhHangUrl, data);
  }

  public update(data) {
    return this.http.put(this.updateNganhHangUrl, data);
  }

  public delete(data) {
    return this.http.request('DELETE', this.deleteNganhHangUrl, { body: data });
  }
}
