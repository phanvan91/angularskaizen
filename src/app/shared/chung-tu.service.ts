import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class ChungTuService {

    private getListChungTuUrl = environment.server_url + '/api/v1/chung-tu/get_list';
    private createChungTuKhoTotUrl = environment.server_url + '/api/v1/chung-tu/create_ct_kho_tot';
    private createChungTuKhoXacUrl = environment.server_url + '/api/v1/chung-tu/create_ct_kho_xac';
    private deleteChungTuTotUrl = environment.server_url + '/api/v1/chung-tu/delete-ct-tot';
    private updateChungTuTotUrl = environment.server_url + '/api/v1/chung-tu/update-ct-tot';
    private updateChungTuXacUrl = environment.server_url + '/api/v1/chung-tu/update-ct-xac';
    private getChungTuTotDetailUrl = environment.server_url + '/api/v1/chung-tu/get-ct-tot-detail';
    private getListKhoTotUrl = environment.server_url + '/api/v1/chung-tu/get-list-kho-tot';
    private filterListKhoTotUrl = environment.server_url + '/api/v1/chung-tu/filter-list-kho-tot';
    private getTonKhoLinhKienUrl = environment.server_url + '/api/v1/chung-tu/get-ton-kho';
    private taophieutraLKUrl = environment.server_url + '/api/v1/chung-tu/tra-linh-kien';

    constructor(private http: HttpClient) { }

    public tra_linh_kien(data) {
        return this.http.post(this.taophieutraLKUrl, data);
    }

    public create_ct(data, isKhoTot) {
        if (isKhoTot) {
            return this.http.post(this.createChungTuKhoTotUrl, data);
        }else {
            return this.http.post(this.createChungTuKhoXacUrl, data);
        }
    }

    public update_ct(data, isKhoTot) {
        if (isKhoTot) {
            return this.http.post(this.updateChungTuTotUrl, data);
        }else {
            return this.http.post(this.updateChungTuXacUrl, data);
        }
    }

    public create_ct_kho_tot(data) {
        return this.http.post(this.createChungTuKhoTotUrl, data);
    }

    public update_ct_kho_tot(data) {
        return this.http.post(this.updateChungTuTotUrl, data);
    }


    public getList(loaiChungTu, loaiKho, khoId) {
        return this.http.get(this.getListChungTuUrl, {
            params: {
                loai_ct: loaiChungTu
            }
        });
    }

    public getCTTotDetail(chungTuId, isKhoTot) {
        return this.http.get(this.getChungTuTotDetailUrl, {
            params: {
                chung_tu_id: chungTuId,
                is_kho_tot: isKhoTot
            }
        });
    }

    public delete(data) {
        return this.http.request('DELETE', this.deleteChungTuTotUrl, { body: data });
    }

    public getListChungTuKhoTot(loai_ct, kho_id) {
        return this.http.get(this.getListKhoTotUrl, {
            params: {
                loai_ct: loai_ct, kho_id: kho_id
            }
        });
    }

    public getTonKhoLK(kho_id, lk_id , ngay_ct) {
        return this.http.get(this.getTonKhoLinhKienUrl, {
            params: {
                kho_id: kho_id, linh_kien_id: lk_id, ngay_ct : ngay_ct
            }
        });
    }

    public filterListChungTuKhoTot(loai_ct, kho_id, ngay_bat_dau, ngay_ket_thuc){
        return this.http.get(this.filterListKhoTotUrl, {
            params: {
                loai_ct: loai_ct, kho_id: kho_id,ngay_bat_dau: ngay_bat_dau,ngay_ket_thuc: ngay_ket_thuc
            }
        });
    }
    public getPage(url){
        return this.http.get(url);
    }
}
