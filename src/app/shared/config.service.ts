import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class ConfigService {

  private cityUrl = environment.server_url + '/api/v1/config/city-province';
  private districtUrl = environment.server_url + '/api/v1/config/district';
  private villagetUrl = environment.server_url + '/api/v1/config/village';
    private citySource = new BehaviorSubject({});
  city = this.citySource.asObservable();

  private districtSource = new BehaviorSubject({});
  district = this.districtSource.asObservable();

  private villageSource = new BehaviorSubject({});
  village = this.villageSource.asObservable();

  constructor(private http: HttpClient) { }

  setCitySource(data) {
    return this.citySource.next(data);
  }

  setDistrictSource(data) {
    return this.districtSource.next(data);
  }

  setVillageSource(data) {
    return this.villageSource.next(data);
  }

  public getCityProvince() {
    return this.http.get(this.cityUrl);
  }

  public getDistrict(parentCode = null) {
    if (parentCode) {
      return this.http.get(this.districtUrl, {
        params: {
          parent_code: parentCode
        }
      });
    }
    return this.http.get(this.districtUrl);
  }

  public getVillage(city_code = null, parentCode = null) {
    if (parentCode) {
      return this.http.get(this.villagetUrl, {
        params: {
          city_code: city_code,
          parent_code: parentCode
        }
      });
    }
    return this.http.get(this.villagetUrl);
  }

}
