import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class ChiPhiDiLaiService {

  private allCPDLUrl = environment.server_url + '/api/v1/danh-sach-chi-phi-di-lai/all';
    private paginationCPDLUrl = environment.server_url + '/api/v1/cpdl-phan-trang';
    private createCPDLUrl = environment.server_url + '/api/v1/danh-sach-chi-phi-di-lai/create';
  private updateCPDLUrl = environment.server_url + '/api/v1/danh-sach-chi-phi-di-lai/update';
  private deleteCPDLUrl = environment.server_url + '/api/v1/danh-sach-chi-phi-di-lai/delete';
  private importCPDLUrl = environment.server_url + '/api/v1/danh-sach-chi-phi-di-lai/import';
    private cpdlSource = new BehaviorSubject({});
    Cpdl = this.cpdlSource.asObservable();
  constructor(private http: HttpClient) { }
    setCpdlSource(data) {
        return this.cpdlSource.next(data);
    }
  public all() {
    return this.http.get(this.allCPDLUrl);
  }
    public get_pagination(toChucId, page, key_word) {

        return this.http.get(this.paginationCPDLUrl, {
            params: {
                to_chuc_id: toChucId,
                page: page,
                key_word : key_word
            }
        });
   }
   public get_pagination_search(toChucId, page, key_word ) {

       return this.http.get(this.paginationCPDLUrl, {
           params: {
               to_chuc_id: toChucId,
               page: page,
               key_word: key_word
           }
       });
  }
  public create(data) {
    return this.http.post(this.createCPDLUrl, data);
  }

  public update(data) {
    return this.http.put(this.updateCPDLUrl, data);
  }

  public delete(data) {
    return this.http.request('DELETE', this.deleteCPDLUrl, { body: data });
  }

  public filter(tram, thanhPho, quan, phuong) {
    return this.http.get(environment.server_url + '/api/v1/danh-sach-chi-phi-di-lai', {
      params: {
        tram: tram,
        thanh_pho: thanhPho,
        quan: quan,
        phuong: phuong
      }
    });
  }

  public import(formData) {
    return this.http.post(this.importCPDLUrl, formData);
  }
}
