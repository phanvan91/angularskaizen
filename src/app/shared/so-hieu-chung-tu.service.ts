import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {Select2OptionData} from 'ng2-select2';

@Injectable()
export class SoHieuChungTuService {

  private allSoHieuChungTuUrl = environment.server_url + '/api/v1/so-hieu-chung-tu/all';
  private getSoHieuChungTuByTypeUrl = environment.server_url + '/api/v1/so-hieu-chung-tu/get-by-type';
  private getSoHieuChungTuDetailUrl = environment.server_url + '/api/v1/so-hieu-chung-tu/get-detail';
  private createSoHieuChungTuUrl = environment.server_url + '/api/v1/so-hieu-chung-tu/create';
  private updateSoHieuChungTuUrl = environment.server_url + '/api/v1/so-hieu-chung-tu/update';
  private deleteSoHieuChungTuUrl = environment.server_url + '/api/v1/so-hieu-chung-tu/delete';
    private paginationSoHieuChungTuUrl = environment.server_url + '/api/v1/so-hieu-chung-tu/pagination';

  private soHieuChungTuSource = new BehaviorSubject({});
  soHieuChungTu = this.soHieuChungTuSource.asObservable();

  constructor(private http: HttpClient) { }

  setSoHieuChungTuSource(data) {
    return this.soHieuChungTuSource.next(data);
  }
    public pagination(page) {
        return this.http.get(this.paginationSoHieuChungTuUrl, {
            params: {
                page: page
            }
        });
    }
  public getByType(loaiChungTu, loaiKho) {
      return this.http.get(this.getSoHieuChungTuByTypeUrl, {
          params: {
              loai_chung_tu: loaiChungTu,
              loai_kho: loaiKho
          }
      });
  }

    public getDetail(so_hieu_id) {
        return this.http.get(this.getSoHieuChungTuDetailUrl, {
            params: {
                so_hieu_id: so_hieu_id
            }
        });
    }

  public all(toChucId) {
    return this.http.get(this.allSoHieuChungTuUrl, {
      params: {
        to_chuc_id: toChucId
      }
    });
  }

  public create(data) {
    return this.http.post(this.createSoHieuChungTuUrl, data);
  }

  public update(data) {
    return this.http.put(this.updateSoHieuChungTuUrl, data);
  }

  public delete(data) {
    return this.http.request('DELETE', this.deleteSoHieuChungTuUrl, { body: data });
  }
}
