import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class SerialService {

  private allSerialUrl = environment.server_url + '/api/v1/serial';
  private createSerialUrl = environment.server_url + '/api/v1/serial/create';
  private updateSerialUrl = environment.server_url + '/api/v1/serial/update';
  private deleteSerialUrl = environment.server_url + '/api/v1/serial/delete';
  private getPaginationUrl = environment.server_url + '/api/v1/serial-phan-trang';
  private getSerialFilterUrl = environment.server_url + '/api/v1/serial/filter';
  private getSerialByKHUrl = environment.server_url + '/api/v1/serial-khach-hang';
    private getSerialByIDUrl = environment.server_url + '/api/v1/get-serial-by-id';
    private uploadExcelDUrl = environment.server_url + '/api/v1/upload-serial-excel';
    private getSerialByMaUrl = environment.server_url + '/api/v1/get-serial-by-ma';
    private getKichHoatBHUrl = environment.server_url + '/api/v1/kich-hoat-bh';


  private SerialSource = new BehaviorSubject({});
  Serial = this.SerialSource.asObservable();

  constructor(private http: HttpClient) {
  }

  setSerialSource(data) {
    return this.SerialSource.next(data);
  }

  public get_serial_by_kh(khID) {
    return this.http.get(this.getSerialByKHUrl, {
      params: {
        khach_hang_id: khID
      }
    });
  }
    public get_serial_by_key(key_search) {
        return this.http.get(this.getSerialByMaUrl, {
            params: {
                key_search: key_search
            }
        });
    }

    public kichhoatBH(id) {
        return this.http.get(this.getKichHoatBHUrl, {
            params: {
                id: id
            }
        });
    }

  public all(toChucId) {
    return this.http.get(this.allSerialUrl, {
      params: {
        to_chuc_id: toChucId
      }
    });
  }

  public get_pagination(toChucId, page) {
    return this.http.get(this.getPaginationUrl, {
      params: {
        to_chuc_id: toChucId,
        page: page
      }
    });
  }
    public importExcel(data) {
        return this.http.post(this.uploadExcelDUrl, data);
    }
  public create(data) {
    return this.http.post(this.createSerialUrl, data);
  }

  public update(data) {
    return this.http.put(this.updateSerialUrl, data);
  }

  public delete(data) {
    return this.http.request('DELETE', this.deleteSerialUrl, {body: data});
  }

  public filter(code) {
    return this.http.get(this.getSerialFilterUrl, {
      params: {
        code: code
      }
    });
  }

  public show(id) {
    return this.http.get(environment.server_url + '/api/v1/serial/' + id);
  }
    public get_serial(id) {
        return this.http.get(this.getSerialByIDUrl, {
            params: {
                id: id,
            }
        });
    }
}
