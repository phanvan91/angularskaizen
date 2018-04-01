import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class CongViecService {

    private getPaginationUrl = environment.server_url + '/api/v1/cong-viec-phan-trang';
    private phanCongUrl = environment.server_url + '/api/v1/phan-cong-bao-hanh';

  constructor(private http: HttpClient) { }

    public get_pagination(uid, page, startDate, endDate) {
        return this.http.get(this.getPaginationUrl, {
            params: {
                uid: uid,
                page: page,
                startDate: startDate,
                endDate: endDate
            }
        });
    }

    public phanCongBH(data) {
        return this.http.post(this.phanCongUrl, data);
    }
}
