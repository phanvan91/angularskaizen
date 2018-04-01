import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class PhieuDeNghiService {

  private createPhieuDeNghiLKUrl = environment.server_url + '/api/v1/phieu-de-nghi/create';
  private updatePhieuDeNghiLKUrl = environment.server_url + '/api/v1/phieu-de-nghi/update';
  private getPhieuDeNghiLKUrl = environment.server_url + '/api/v1/phieu-de-nghi/get';
  private changeTrangThaiUrl = environment.server_url + '/api/v1/phieu-de-nghi/change-status';
  private getPaginationUrl = environment.server_url + '/api/v1/phieu-de-nghi-phan-trang';
  private xacnhanDNLKUrl = environment.server_url + '/api/v1/phieu-de-nghi/xac-nhan-DNLK';
  private taoPhieuXuatKhoUrl = environment.server_url + '/api/v1/phieu-de-nghi/tao-xuat-kho';


  constructor(private http: HttpClient) {
  }


    public get_pagination(toChucId, page, kho_tram_id, kho_trung_tam_id, trang_thai, startDate, endDate) {
        return this.http.get(this.getPaginationUrl, {
            params: {
                to_chuc_id: toChucId,
                page: page,
                kho_tram_id: kho_tram_id,
                kho_trung_tam_id: kho_trung_tam_id,
                trang_thai: trang_thai,
                startDate: startDate,
                endDate: endDate

            }
        });
  }
    public getDetail(id) {
        return this.http.get(this.getPhieuDeNghiLKUrl, {
            params: {
                id: id
            }
        });
    }


    public create(data) {
        return this.http.post(this.createPhieuDeNghiLKUrl, data);
    }

    public update(data) {
      return this.http.post(this.updatePhieuDeNghiLKUrl, data);
    }

    public changeTrangThai(trangThai, id) {
        return this.http.get(this.changeTrangThaiUrl, {
            params: {
                trang_thai: trangThai,
                phieu_de_nghi_id: id
            }
        });
    }

    public taoPhieuXuatKho(id) {
        return this.http.get(this.taoPhieuXuatKhoUrl, {
            params: {
                phieu_de_nghi_id: id
            }
        });
    }

    public xacnhanDNLK(data) {
        return this.http.post(this.xacnhanDNLKUrl, data);
    }


}
