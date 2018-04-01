import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class CustomerService {

  private allCustomerUrl = environment.server_url + '/api/v1/khach-hang';

    private createCustomerUrl = environment.server_url + '/api/v1/khach-hang/create';
    private updateCustomerUrl = environment.server_url + '/api/v1/khach-hang/update';
    private deleteCustomerUrl = environment.server_url + '/api/v1/khach-hang/delete';
    private getPaginationUrl = environment.server_url + '/api/v1/khach-hang-phan-trang';
    private getFilternUrl = environment.server_url + '/api/v1/khach-hang/filter';
    private getCustomerUrl = environment.server_url + '/api/v1/show-khach-hang';
    private getMaTuSinhUrl = environment.server_url + '/api/v1/khach-hang-get-ma-tu-sinh';
    private createPublicUrl = environment.server_url + '/api/v1/createKHPublic';




  private khachHangSource = new BehaviorSubject({});
  khachHang = this.khachHangSource.asObservable();

  constructor(private http: HttpClient) { }

  setCustomerSource(data) {
    return this.khachHangSource.next(data);
  }

  public all(toChucId) {
    return this.http.get(this.allCustomerUrl, {
      params: {
        to_chuc_id: toChucId,
      }
    });
  }
    public get_pagination(toChucId, page) {
        return this.http.get(this.getPaginationUrl, {
            params: {
                to_chuc_id: toChucId,
                page: page
            }
        });    }

    public createPublic(data) {
        return this.http.post(this.createPublicUrl, data);
    }
  public create(data) {
    return this.http.post(this.createCustomerUrl, data);
  }

  public update(data) {
    return this.http.put(this.updateCustomerUrl, data);
  }

  public delete(data) {
    return this.http.request('DELETE', this.deleteCustomerUrl, { body: data });
  }

  public filter(name) {
    return this.http.get(this.getFilternUrl, {
      params: {
        name: name
      }
    }).shareReplay();
  }


  public show(id) {
    return this.http.get(environment.server_url + '/api/v1/khach-hang/' + id);
  }
    public get_customer(id) {
        return this.http.get(this.getCustomerUrl, {
            params: {
                id: id,
            }
        });
    }
  public getMaTuSinh() {
    return this.http.get(this.getMaTuSinhUrl);
  }
}
