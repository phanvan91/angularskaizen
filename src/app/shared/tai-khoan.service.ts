import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from "rxjs/Observable";
import {Select2OptionData} from "ng2-select2";

@Injectable()
export class TaiKhoanService {

    private allTaiKhoanUrl = environment.server_url + '/api/v1/tai-khoan/all';

    constructor(private http: HttpClient) { }

    private taiKhoanSource = new BehaviorSubject({});
    taikhoan = this.taiKhoanSource.asObservable();

    setTaiKhoanSource(data) {
        return this.taiKhoanSource.next(data);
    }

    public all() {
        return this.http.get(this.allTaiKhoanUrl, null);
    }

    public getAll(): Observable<Array<Select2OptionData>> {
        return this.http.get(this.allTaiKhoanUrl, {}).map((res: any) => {
            return res ? res.map(item => {
                item.text = item.ten_chung_tu; return item;
            }) : null;
        });
    }
}
