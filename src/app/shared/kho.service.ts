import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from "rxjs/Observable";
import {Select2OptionData} from "ng2-select2";

@Injectable()
export class KhoService {

    private allKhoUrl = environment.server_url + '/api/v1/kho/all';
    private getDetailKhoUrl = environment.server_url + '/api/v1/kho/get-kho-tot-detail';
    private khoByTramUrl = environment.server_url + '/api/v1/kho/get-kho-by-tram';
    private tonKhoUrl = environment.server_url + '/api/v1/ton-kho/all';
    private khoTrungTamBHUrl = environment.server_url + '/api/v1/kho/bao-hanh';
    private tonkhototUrl = environment.server_url + '/api/v1/ton-kho-tot';
    private tonkhoxauUrl = environment.server_url + '/api/v1/ton-kho-xau';
    private linhkienxacUrl = environment.server_url + '/api/v1/linh-kien-xac';
    public getKhoTramByTrungTamUrl = environment.server_url + '/api/v1/kho/get-all-kho-tram-by-trung-tam';

    private updatedongia =  environment.server_url + '/api/v1/kho/update';

    constructor(private http: HttpClient) { }

    private khoSource = new BehaviorSubject({});
    kho = this.khoSource.asObservable();

    private khoSelectedSource = new BehaviorSubject({});
    khoSelected = this.khoSelectedSource.asObservable();

    setKhoSource(data) {
        return this.khoSource.next(data);
    }

    setKhoSelected(data) {
        return this.khoSelectedSource.next(data);
    }

    public getKhoTrungTamBaoHanh(data) {
        return this.http.get(this.khoTrungTamBHUrl, data);
    }

    public getKhoTramByTrungTam(data) {
        return this.http.get(this.getKhoTramByTrungTamUrl, data);
    }

    public all() {
        return this.http.get(this.allKhoUrl, null);
    }

    public getKhoTotDetailByTramId(tramId) {
        return this.http.get(this.getDetailKhoUrl, {
            params: {
                tram_id: tramId
            }
        });
    }

    public getAll(type): Observable<Array<Select2OptionData>> {
        return this.http.get(this.allKhoUrl, {
            params: {
                loai_kho: type
            }
        }).map((res: any) => {
            return res ? res.map(item => {
                item.text = item.ma_kho + '-' + item.ten_kho; return item;
            }) : null;
        });
    }

    public getKhoByTram(tramId) {
        return this.http.get(this.khoByTramUrl, {
            params: {
                tram_id: tramId
            }
        });
    }


    public getTonKho(khoId, linhKienId) {
        return this.http.get(this.tonKhoUrl, {
            params: {
                kho_id: khoId,
                linh_kien_id: linhKienId
            }
        });
    }
    public getTonKhoTot(page , khoNhap , linh_kien_id) {
        return this.http.get(this.tonkhototUrl, {
            params: {
                page: page,
                khoNhap: khoNhap,
                linh_kien_id: linh_kien_id
            }
        });
    }
    public getTonKhoXau(page , khoNhap , linh_kien_id) {
        return this.http.get(this.tonkhoxauUrl, {
            params: {
                page: page,
                khoNhap: khoNhap,
                linh_kien_id: linh_kien_id
            }
        });
    }
    public getLinhKienXac(page) {
        return this.http.get(this.linhkienxacUrl, {
            params: {
                page: page
            }
        });
    }

    public update_don_gia(data){
      return this.http.put(this.updatedongia, data);
    }
}
