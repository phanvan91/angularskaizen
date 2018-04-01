import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class PhieuSuaChuaService {

    private updatePhieuSuaChuaUrl = environment.server_url + '/api/v1/phieu-sua-chua/update';
    private createPhieuSuaChuaUrl = environment.server_url + '/api/v1/phieu-sua-chua/create';
  private allPBHUrl = environment.server_url + '/api/v1/phieu-sua-chua';
  private getPaginationUrl = environment.server_url + '/api/v1/phieu-sua-chua-phan-trang';
  private getCheckInnUrl = environment.server_url + '/api/v1/phieu-sua-chua/check-in';
  private getRemoveChiPhiDiLaiUrl = environment.server_url + '/api/v1/phieu-sua-chua/remove-chi-phi-di-lai';
  private getUpdateThongTinDichVuUrl = environment.server_url + '/api/v1/phieu-sua-chua/update-thong-tin-dich-vu';
  private getUpdateChiPhiDiLaiUrl = environment.server_url + '/api/v1/phieu-sua-chua/update-chi-phi-di-lai';
    private createPhieuNhapKhoUrl = environment.server_url + '/api/v1/create-phieu-nhap-kho';
    private checkInUrl = 'http://maps.googleapis.com/maps/api/geocode/json';
    private updateIMGUrl = environment.server_url + '/api/v1/phieu-sua-chua/updateIMG';
    public checkPSCSerialurl = environment.server_url + '/api/v1/phieu-sc/check-psc-by-serial';

  constructor(private http: HttpClient) {
  }


    public checkinAddress(latlng) {
        return this.http.get(this.checkInUrl + '?latlng=' + latlng);

    }
    public checkPSC(serial_id) {
        return this.http.get(this.checkPSCSerialurl, {
            params: {
                serial_id: serial_id,
            }
        });
    }
  public all(toChucId) {
    return this.http.get(this.allPBHUrl, {
      params: {
        to_chuc_id: toChucId,
      }
    });
  }

  public get_pagination(toChucId, page, trang_thai, serial = '', uu_tien = '', tram_bao_hanh_id = '') {
    return this.http.get(this.getPaginationUrl, {
      params: {
        to_chuc_id: toChucId,
        page: page,
        trang_thai: trang_thai,
        serial: serial,
        uu_tien: uu_tien,
        tram_bao_hanh_id: tram_bao_hanh_id
      }
    });
  }

  create(formData: FormData) {
    return this.http.post(this.createPhieuSuaChuaUrl, formData);
  }
    update(formData: FormData) {
        return this.http.post(this.updatePhieuSuaChuaUrl, formData);
    }

  public show(id) {
    return this.http.get(environment.server_url + '/api/v1/phieu-sua-chua/' + id);
  }

  public checkIn(data) {
    return this.http.put(this.getCheckInnUrl, data);
  }

  public removeChiPhiDiLai(data) {
    return this.http.request('DELETE', this.getRemoveChiPhiDiLaiUrl, { body: data });
  }

  public updateThongTinDichVu(formData) {
    return this.http.post(this.getUpdateThongTinDichVuUrl, formData);
  }
    public updateImage(formData) {
        return this.http.post(this.updateIMGUrl, formData);
    }

  public updateChiPhiDiLai(data) {
    return this.http.put(this.getUpdateChiPhiDiLaiUrl, data);
  }

    public create_phieu_nhap_kho(data) {
        return this.http.post(this.createPhieuNhapKhoUrl, data);
    }


}
