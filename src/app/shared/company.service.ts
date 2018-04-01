import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class CompanyService {

  private allCompanyUrl = environment.server_url + '/api/v1/cong-ty/all';
  private createCompanyUrl = environment.server_url + '/api/v1/cong-ty/create';
  private updateCompanyUrl = environment.server_url + '/api/v1/cong-ty/update';
  private deleteCompanyUrl = environment.server_url + '/api/v1/cong-ty/delete';
    private paginationUrl = environment.server_url + '/api/v1/cong-ty/pagination';


  private companySource = new BehaviorSubject({});
  company = this.companySource.asObservable();

  constructor(private http: HttpClient) { }
    public get_pagination(page) {
        return this.http.get(this.paginationUrl, {
            params: {
                page: page
            }
        });    }
  setCompanySource(data) {
    return this.companySource.next(data);
  }

  public create(data) {
    return this.http.post(this.createCompanyUrl, data);
  }

  public all() {
    return this.http.get(this.allCompanyUrl);
  }

  public update(data) {
    return this.http.put(this.updateCompanyUrl, data);
  }

  public delete(data) {
    return this.http.request('DELETE', this.deleteCompanyUrl, { body: data });
  }
}
