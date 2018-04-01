import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class SanPhamService {

  private allSanphamUrl = environment.server_url + '/api/v1/san-pham';
    private createSanphamUrl = environment.server_url + '/api/v1/san-pham/create';
  private updateSanphamUrl = environment.server_url + '/api/v1/san-pham/update';
  private deleteSanphamUrl = environment.server_url + '/api/v1/san-pham/delete';
    private showSanphambyNganhUrl = environment.server_url + '/api/v1/san-pham-nganh';
    private getPaginationUrl = environment.server_url + '/api/v1/san-pham-phan-trang';

  private sanPhamSource = new BehaviorSubject({});
  sanPham = this.sanPhamSource.asObservable();

  constructor(private http: HttpClient) { }

  setSanPhamSource(data) {
    return this.sanPhamSource.next(data);
  }

  public all() {
    return this.http.get(this.allSanphamUrl);
  }
    public get_pagination(toChucId, page) {
        return this.http.get(this.getPaginationUrl, {
            params: {
                to_chuc_id: toChucId,
                page: page
            }
        });    }
    public show_by_nganh(nganhID) {
        return this.http.get(this.showSanphambyNganhUrl, {
            params: {
                nganh: nganhID
            }
        });
  }

  public create(data) {
    return this.http.post(this.createSanphamUrl, data);
  }

  public update(data) {
    return this.http.put(this.updateSanphamUrl, data);
  }

  public delete(data) {
    return this.http.request('DELETE', this.deleteSanphamUrl, { body: data });
  }
}
