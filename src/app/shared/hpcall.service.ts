import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class HpcallService {

    private allHpcallUrl = environment.server_url + '/api/v1/happy-call';
    private createHpcallUrl = environment.server_url + '/api/v1/happy-call/create';
    private updateHpcallUrl = environment.server_url + '/api/v1/happy-call/update';
    private deleteHpcallUrl = environment.server_url + '/api/v1/happy-call/delete';
    private getPaginationUrl = environment.server_url + '/api/v1/happy-call-phan-trang';
    private getPaginationHpcallYesUrl = environment.server_url + '/api/v1/happy-call-da-thuc-hien-pagination';
    private getPaginationHpcallNoUrl = environment.server_url + '/api/v1/happy-call-chua-thuc-hien-pagination';
    private actionHpcallUrl = environment.server_url + '/api/v1/action-happy-call';
    private getHpcallIndexUrl = environment.server_url + '/api/v1/get-happy-call-index';


    private hpcallSource = new BehaviorSubject({});
    Hpcall = this.hpcallSource.asObservable();

    constructor(private http: HttpClient) {
    }


    setHpcallSource(data) {
        return this.hpcallSource.next(data);
    }

    public all(toChucId) {
        return this.http.get(this.allHpcallUrl, {
            params: {
                to_chuc_id: toChucId,
            }
        });
    }

    public get_HpcallYes_pagination(toChucId, page) {
        return this.http.get(this.getPaginationHpcallYesUrl, {
            params: {
                to_chuc_id: toChucId,
                page: page
            }
        });
    }

    public get_HpcallNo_pagination(toChucId, page) {
        return this.http.get(this.getPaginationHpcallNoUrl, {
            params: {
                to_chuc_id: toChucId,
                page: page
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

    public create(data) {
        return this.http.post(this.createHpcallUrl, data);
    }

    public update(data) {
        return this.http.put(this.updateHpcallUrl, data);
    }

    public delete(data) {
        return this.http.request('DELETE', this.deleteHpcallUrl, {body: data});
    }

    public actionHpcall(data) {
        return this.http.post(this.actionHpcallUrl, data);
    }

    public get_hpcall_index(data) {
        return this.http.post(this.getHpcallIndexUrl, data);
    }
}
