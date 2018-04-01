import {Component, OnDestroy, OnInit, Host} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastyService} from 'ng2-toasty';
import {SerialService} from '../shared/serial.service';
import {CustomerService} from '../shared/customer.service';
import {environment} from '../../environments/environment';
import {ConfigService} from "../shared/config.service";
@Component({
  selector: 'app-bao-hanh',
  templateUrl: './bao-hanh.component.html',
  styleUrls: ['./bao-hanh.component.scss']
})
export class BaoHanhComponent implements OnInit {
    SearchSerialForm;
    user = environment.user;
    toChuc = environment.toChuc;
    status= environment.status_psc;
    alive = true;
    serial;
    customer;
    thanhPhos: any = {};
    quans: any = {};
    villages: any = {};
    city = [];
    dictrict = [];
    village = [];
    khachHangCreateForm;
    code;
    find = false;
    PSC;
    show_list = false;
    serials;
    editIndex;
  constructor(
      private toastService: ToastyService,
      private serialService: SerialService,
      private customerService: CustomerService,
      private configService: ConfigService

  ) { }

  ngOnInit() {

      this.SearchSerialForm = new FormGroup({
          key: new FormControl(null, {
              validators: [ Validators.required ]
          }),
      });
      this.khachHangCreateForm = new FormGroup({
          id: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          ma: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          ten: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          to_chuc_id: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          loai: new FormControl(1, {
              validators: [ Validators.required ]
          }),
          dien_thoai: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          email: new FormControl(null, {}),
          tinh_tp: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          quan_huyen: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          phuong_xa: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          dia_chi: new FormControl(null, {
              validators: [ Validators.required ]
          }),
      });

      this.configService.getCityProvince().takeWhile(() => this.alive).subscribe(resCity => {
          if (resCity) {
              if (Object.keys(resCity).length) {
                  this.thanhPhos = resCity;
              }
              for( let key in resCity) {
                  this.city.push(resCity[key]);
              }
              this.configService.getDistrict().takeWhile(() => this.alive).subscribe(resDict => {
                  if (resDict) {
                      if (Object.keys(resDict).length) {
                          this.quans = resDict;
                      }
                      this.dictrict = [];
                      for( let key in resDict) {
                          this.dictrict.push(resDict[key]);
                      }

                      this.configService.getVillage().takeWhile(() => this.alive).subscribe(resVill => {
                          if (Object.keys(resVill).length) {
                              this.villages = resVill;
                          }

                      }, err => console.log(err));

                  }
              }, err => console.log(err));

          }
      }, err => console.log(err));




  }
    changeCity(event) {
        const code = event.value;
        this.code = code;
        this.khachHangCreateForm.get('tinh_tp').patchValue(code);
        this.khachHangCreateForm.get('tinh_tp').patchValue(code);

        this.configService.getDistrict(this.code).takeWhile(() => this.alive).subscribe((res: any) => {
            console.log(res);
            this.dictrict = [];
            for (let key in res) {
                this.dictrict.push(res[key]);
            }
        });
    }

    changeDictrict(event) {
        this.khachHangCreateForm.get('quan_huyen').patchValue(event.value);

        this.configService.getVillage(this.code, event.value).takeWhile(() => this.alive).subscribe((res: any) => {
            this.village = [];
            for (let key in res) {
                this.village.push(res[key]);
            }

        });
    }
    changeVillage(event) {
        this.khachHangCreateForm.get('phuong_xa').patchValue(event.value);
    }
    onCreateKhachHangSubmit(event) {
        event.preventDefault();
        const data = this.khachHangCreateForm.value;
        data.to_chuc_id = this.toChuc.id;
        data.serial_id = this.serial.id;
        console.log(data);
        this.customerService.createPublic(data).takeWhile(() => this.alive).subscribe((res: any) => {
            if (res) {
                this.customer = res;
                // this.toastService.success('Thao tác thành công');
                alert('Cập nhật thông tin thành công');

            }


        }, err => {
            // this.toastService.error('Mã đã tồn tại');
            // alert('Mã đã tồn tại');

        });
    }

    onSearchSubmit(event) {
        event.preventDefault();
        const data = this.SearchSerialForm.value;
        const key = data.key;
        this.serialService.get_serial_by_key(key).takeWhile(() => this.alive).subscribe((res: any) => {
            if (res) {
                if (res.id > 0) {
                    console.log(res);
                    this.serial = res;
                    this.customer = res.customer;
                    this.PSC = res.psc;

                }  else {
                    if (res.show_list) {
                        this.show_list = true;
                        this.serial = null;
                        this.serials = res.serials;
                        this.customer = res.customer;
                        console.log(this.serials);
                        console.log(this.customer);


                    } else {
                        this.find = true;
                        console.log('not found');
                    }


                }

            }

        }, err => {
        });
    }
    kichhoatSubmit() {
        this.serialService.kichhoatBH(this.serial.id).takeWhile(() => this.alive).subscribe((res: any) => {
            if (res) {
                if (res.id > 0) {
                    console.log(res);
                    this.serial = res;
                    this.customer = res.customer;
                    if (this.editIndex) {
                        this.serials[this.editIndex] = this.serial;

                    }
                    // this.toastService.success('Bạn đã kích hoạt bảo hành thành công');
                    alert('Bạn đã kích hoạt bảo hành thành công');

                }  else {
                    console.log('not found');

                }

            }

        }, err => {
        });
    }
    chi_tiet_BH(serial, index) {
      this.editIndex = index;
        this.serialService.get_serial_by_key(serial).takeWhile(() => this.alive).subscribe((res: any) => {
            if (res) {
                if (res.id > 0) {
                    console.log(res);
                    this.serial = res;
                    this.customer = res.customer;
                    this.PSC = res.psc;
                    window.scrollTo(200, 300);

                }  else {
                    this.find = true;
                    console.log('not found');

                }

            }

        }, err => {
        });
    }

}
