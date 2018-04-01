import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';
import {Select2OptionData} from 'ng2-select2';

@Injectable()
export class DonDatHangService {

  allDonDatHangUrl = (<any>environment).server_url + '/api/v1/don-dat-hang/all';
  chiTietDonDatHangUrl = (<any>environment).server_url + '/api/v1/don-dat-hang/get_chi_tiet';
  getDonDatHangUrl = (<any>environment).server_url + '/api/v1/don-dat-hang/get';

  filterDonDatHangUrl = (<any>environment).server_url + '/api/v1/don-dat-hang/filter';
  searchDonDatHangUrl = (<any>environment).server_url + '/api/v1/don-dat-hang/search';

  createDonDatHangUrl = (<any>environment).server_url + '/api/v1/don-dat-hang/create';

  private donDatHangSource = new BehaviorSubject({});
  donDatHang = this.donDatHangSource.asObservable();

  constructor(private http: HttpClient) { }

  setDonDatHangSource(data){
    this.donDatHangSource.next(data);
  }

    public all(): Observable<Array<Select2OptionData>> {
        return this.http.get(this.allDonDatHangUrl, {}).map((res: any) => {
            return  res ? res.map(item => {
                item.text = item.so_ct; return item;
            }) : null;
        });
    }

    getChiTiet(id){
        return this.http.get(this.chiTietDonDatHangUrl,{
            params: {
                don_dat_hang_id: id
            }
        });
    }
  getDonDatHang(id){
      return this.http.get(this.getDonDatHangUrl,{
          params: {
              don_dat_hang_id: id
          }
      });
  }

  getAll(){
    return this.http.get(this.allDonDatHangUrl);
  }

  getPage(url){
    return this.http.get(url);
  }

  filter(ngay_bat_dau, ngay_ket_thuc){
    return this.http.get(this.filterDonDatHangUrl,{
      params: {
        ngay_bat_dau: ngay_bat_dau,
        ngay_ket_thuc: ngay_ket_thuc
      }
    });
  }

  create(data){
    return this.http.post(this.createDonDatHangUrl, data);
  }

}
