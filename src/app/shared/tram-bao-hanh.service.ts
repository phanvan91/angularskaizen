import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {environment} from '../../environments/environment';

@Injectable()
export class TramBaoHanhService {

  private allTramBaoHanhUrl = environment.server_url + '/api/v1/tram-bao-hanh/all';
  private createTramBaoHanhUrl = environment.server_url + '/api/v1/tram-bao-hanh/create';
  private importTramBaoHanhUrl = environment.server_url + '/api/v1/tram-bao-hanh/upload';
  private updateTramBaoHanhUrl = environment.server_url + '/api/v1/tram-bao-hanh/update';
  private deleteTramBaoHanhUrl = environment.server_url + '/api/v1/tram-bao-hanh/delete';
  public searchUrl = environment.server_url + '/api/v1/tram-bao-hanh/search';
  private getPaginationUrl = environment.server_url + '/api/v1/tram-bao-hanh/phan-trang';
  private getTrambyTinhUrl = environment.server_url + '/api/v1/tram-by-tinh';
  private getTramThuocTrungTamUrl = environment.server_url + '/api/v1/tram-bao-hanh/thuoc-trung-tam';

  private tranBaoHanhSource = new BehaviorSubject({});
  tramBaoHanh = this.tranBaoHanhSource.asObservable();

  constructor(private http: HttpClient) { }

  setTramBaoHanhSource(data) {
    return this.tranBaoHanhSource.next(data);
  }
  public get_tram_by_tinh(tinh) {
        return this.http.get(this.getTrambyTinhUrl, {
            params: {
                tinh: tinh
            }
        });
    }
  public get_pagination(page) {
        return this.http.get(this.getPaginationUrl, {
            params: {
                page: page
            }
        });
  }

  public getTramThuocTT(trung_tam_id) {
    return this.http.get(this.getTramThuocTrungTamUrl, {
      params: {
          trung_tam_bao_hanh_id: trung_tam_id
      }
  });
  }

  public all() {
    return this.http.get(this.allTramBaoHanhUrl);
  }
  create(data){
    return this.http.post(this.createTramBaoHanhUrl, data);
  }
  update(data){
    return this.http.put(this.updateTramBaoHanhUrl, data);
  }
  delete(data){
    return this.http.request('DELETE', this.deleteTramBaoHanhUrl, { body: data });
  }
  import(data){
    return this.http.post(this.importTramBaoHanhUrl, data);
  }
}
