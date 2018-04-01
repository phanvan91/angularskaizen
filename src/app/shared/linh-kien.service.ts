import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class LinhKienService {

    public searchUrl = environment.server_url + '/api/v1/linh-kien/search';
    public searchListUrl = environment.server_url + '/api/v1/linh-kien/search-list';

    private allLinhKienUrl = environment.server_url + '/api/v1/linh-kien/all';
    private createLinhKienUrl = environment.server_url + '/api/v1/linh-kien/create';
    private updateLinhKienUrl = environment.server_url + '/api/v1/linh-kien/update';
    private deleteLinhKienUrl = environment.server_url + '/api/v1/linh-kien/delete';
    private checkExistLinhKienUrl = environment.server_url + '/api/v1/linh-kien/check-exist';
    private importLinhKienUrl = environment.server_url + '/api/v1/linh-kien/import';
    private paginateLinhKienUrl = environment.server_url + '/api/v1/linh-kien/paginate';
    private getDeNghiCapLKUrl = environment.server_url + '/api/v1/phieu-de-nghi/phieu-de-nghi-cap-lk';
    private getDeNghiCapLKByIDUrl = environment.server_url + '/api/v1/phieu-de-nghi-cap-lk-id';
    private deletePDNUrl = environment.server_url + '/api/v1/delete-phieu-de-nghi';
    private linhkienxacPSCurl = environment.server_url + '/api/v1/phieu-sua-chua/no-linh-kien-xac-psc';
    private updatelinhkienxacPSCurl = environment.server_url + '/api/v1/no-linh-kien/update';


    private getNoLinhKienXacUrl = environment.server_url + '/api/v1/no-linh-kien-xac';
    private updateNoLinhKienXacUrl = environment.server_url + '/api/v1/no-linh-kien-xac/update';
    private getDsChoNhapKhoUrl = environment.server_url + '/api/v1/no-linh-kien-xac/ds-cho-nhap-kho';
    private traLKurl = environment.server_url + '/api/v1/linh-kien/tra-linh-kien';


    private linhKienSource = new BehaviorSubject({});
    linhKien = this.linhKienSource.asObservable();

    constructor(private http: HttpClient) { }

    setLinhKienSource(data) {
        this.linhKienSource.next(data);
    }

    public getLKXPSC(phieu_sua_chua_id) {
        return this.http.get(this.linhkienxacPSCurl, {
            params: {
                phieu_sua_chua_id: phieu_sua_chua_id}
        });
    }

    public getPTlk(phieu_sua_chua_id) {
        return this.http.get(this.traLKurl, {
            params: {
                phieu_sua_chua_id: phieu_sua_chua_id}
        });
    }

    public search(keyWord, khoId, isKhoTot) {
        return this.http.get(this.searchUrl, {
            params: {
                is_kho_tot: isKhoTot,
                key_word: keyWord,
                kho_id: khoId
            }
        });
    }

    getAll() {
        return this.http.get(this.allLinhKienUrl);
    }
    checkExist(data) {
        return this.http.post(this.checkExistLinhKienUrl, data);
    }
    import(data) {
        return this.http.post(this.importLinhKienUrl, data);
    }
    paginate(key_word) {
        return this.http.get(this.paginateLinhKienUrl, {
          params: {
            key_word: key_word
          }
        });

    }
    getPage(url) {
        return this.http.get(url);
    }
    create(data) {
        return this.http.post(this.createLinhKienUrl, data);
    }

    update(data) {
        return this.http.put(this.updateLinhKienUrl, data);
    }
    updateLKX(data) {
        return this.http.put(this.updatelinhkienxacPSCurl, data);
    }

    delete(data) {
        return this.http.request('DELETE', this.deleteLinhKienUrl, { body: data });
    }
    deletePDN(data) {
        return this.http.request('DELETE', this.deletePDNUrl, { body: data });
    }

    public getDeNghiCapLKByID(phieu_de_nghi_id) {
        return this.http.get(this.getDeNghiCapLKByIDUrl, {
            params: {
                phieu_de_nghi_id: phieu_de_nghi_id,
            }
        });
    }
    public getDeNghiCapLK(phieu_sua_chua_id) {
        return this.http.get(this.getDeNghiCapLKUrl, {
            params: {
                phieu_sua_chua_id: phieu_sua_chua_id,
            }
        });
    }

    public getNoLinhKienXac(data) {
        return this.http.get(this.getNoLinhKienXacUrl, {
            params: {
                startDate: data.startDate,
                endDate: data.endDate,
                tram_bao_hanh_id: data.tram_bao_hanh_id,
                user_id: data.user_id,
                so_phieu: data.so_phieu,
                trang_thai: data.trang_thai
            }
        });
    }

    public updateNoLinhKienXac(data) {
        return this.http.post(this.updateNoLinhKienXacUrl, data);
    }

    public getDsChoNhapKho(data) {
        return this.http.get(this.getDsChoNhapKhoUrl, {
            params: {
                startDate: data.startDate,
                endDate: data.endDate,
                tram_bao_hanh_id: data.tram_bao_hanh_id,
                user_id: data.user_id,
                so_phieu: data.so_phieu,
                trang_thai: data.trang_thai
            }
        });
    }
}
