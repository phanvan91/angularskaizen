import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class ModelService {

    private allModelUrl = environment.server_url + '/api/v1/model';

    private createModelUrl = environment.server_url + '/api/v1/model/create';
  private updateModelUrl = environment.server_url + '/api/v1/model/update';
  private deleteModelUrl = environment.server_url + '/api/v1/model/delete';
    private showModelbySPUrl = environment.server_url + '/api/v1/model-san-pham';
    private getPaginationUrl = environment.server_url + '/api/v1/model-phan-trang';
    private uploadCsvUrl = environment.server_url + '/api/v1/upload-csv';

  private modelSource = new BehaviorSubject({});
  Model = this.modelSource.asObservable();

  constructor(private http: HttpClient) { }

  setModelSource(data) {
    return this.modelSource.next(data);
  }

  public all(toChucId) {
    return this.http.get(this.allModelUrl, {
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
        });    }
    public show_by_sp(modelID) {
        return this.http.get(this.showModelbySPUrl, {
            params: {
                model: modelID
            }
        });    }
  public create(data) {
    return this.http.post(this.createModelUrl, data);
  }

  public update(data) {
    return this.http.put(this.updateModelUrl, data);
  }
    public uploadCsv(data) {
        return this.http.post(this.uploadCsvUrl, data);

    }

  public delete(data) {
    return this.http.request('DELETE', this.deleteModelUrl, { body: data });
  }
}
