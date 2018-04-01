import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {Select2OptionData} from 'ng2-select2';

@Injectable()
export class AccountantService {

  private allAccountantUrl = environment.server_url + '/api/v1/he-thong-tai-khoang-ke-toan/all';
  private createAccountantUrl = environment.server_url + '/api/v1/he-thong-tai-khoang-ke-toan/create';
  private updateAccountantUrl = environment.server_url + '/api/v1/he-thong-tai-khoang-ke-toan/update';
  private deleteAccountantUrl = environment.server_url + '/api/v1/he-thong-tai-khoang-ke-toan/delete';
  public searchAccountantUrl = environment.server_url + '/api/v1/he-thong-tai-khoang-ke-toan/search';
  public paginationAccountantUrl = environment.server_url + '/api/v1/he-thong-tai-khoang-ke-toan/pagination';

  private accountantSource = new BehaviorSubject({});
  accountant = this.accountantSource.asObservable();

  constructor(private http: HttpClient) { }

  setAccountantSource(data) {
    return this.accountantSource.next(data);
  }

    public getAll(): Observable<Array<Select2OptionData>> {
        return this.http.get(this.allAccountantUrl, {}).map((res: any) => {
            return res ? res.map(item => {
                item.text = item.ten_tai_khoang; return item;
            }) : null;
        });
    }
    public pagination(page) {
        return this.http.get(this.paginationAccountantUrl, {
            params: {
                page: page
            }
        });
    }
  public all(toChucId) {
    return this.http.get(this.allAccountantUrl, {
      params: {
        to_chuc_id: toChucId
      }
    });
  }

  public create(data) {
    return this.http.post(this.createAccountantUrl, data);
  }

  public update(data) {
    return this.http.put(this.updateAccountantUrl, data);
  }

  public delete(data) {
    return this.http.request('DELETE', this.deleteAccountantUrl, { body: data });
  }
}
