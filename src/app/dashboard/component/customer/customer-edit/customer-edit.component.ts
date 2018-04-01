import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomerService} from '../../../../shared/customer.service';
import {environment} from '../../../../../environments/environment';
import {ConfigService} from '../../../../shared/config.service';
import {SerialService} from '../../../../shared/serial.service';
import {ToastyService} from "ng2-toasty";

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss']
})
export class CustomerEditComponent implements OnInit {
  user = environment.user;
  toChuc = environment.toChuc;
  alive = true;
  khachHangEditForm;
  page = 1;
  pages;
  total_page = [];
  total;
  editIndex;
  deleteIndex;
  city = [];
  dictrict = [];
  code;
  village = [];
    citys;
    dictricts = [];
    villages = [];

    tinh_tp;
    quan_huyen;
    phuong_xa;
    edit_city;
    edit_dictrict;
    edit_village;

  @Output() khachHangEdit = new EventEmitter<boolean>();

  @Input() data;

  constructor(private customerService: CustomerService,
              private configService: ConfigService,
              private serialService: SerialService,
              private toastyService: ToastyService
  ) {
  }

  ngOnInit() {
    this.khachHangEditForm = new FormGroup({
      id: new FormControl(null, {
        validators: [Validators.required]
      }),
      ma: new FormControl(null, {
        validators: [Validators.required]
      }),
      ten: new FormControl(null, {
        validators: [Validators.required]
      }),
      to_chuc_id: new FormControl(null, {
        validators: [Validators.required]
      }),
      loai: new FormControl(null, {
        validators: [Validators.required]
      }),
      dien_thoai: new FormControl(null, {
        validators: [Validators.required]
      }),
      email: new FormControl(null, {
        // validators: [Validators.required]
      }),
      tinh_tp: new FormControl(null, {
        validators: [Validators.required]
      }),
      quan_huyen: new FormControl(null, {
        validators: [Validators.required]
      }),
      phuong_xa: new FormControl(null, {
        validators: [Validators.required]
      }),
      dia_chi: new FormControl(null, {
        validators: [Validators.required]
      }),
    });

      this.configService.getCityProvince().takeWhile(() => this.alive).subscribe(res => {
      for (let key in res) {
        this.city.push(res[key]);
      }
          this.configService.getDistrict(this.data.tinh_tp).takeWhile(() => this.alive).subscribe((res: any) => {
              this.dictrict = [];
              for (let key in res) {
                  this.dictrict.push(res[key]);
              }

          });
          this.configService.getVillage(this.data.tinh_tp, this.data.quan_huyen).takeWhile(() => this.alive).subscribe((res: any) => {
              this.village = [];
              for (let key in res) {
                  this.village.push(res[key]);
              }

          });
    });

    this.khachHangEditForm.get('id').patchValue(this.data.id);
    this.khachHangEditForm.get('ma').patchValue(this.data.ma);
    this.khachHangEditForm.get('ten').patchValue(this.data.ten);
    this.khachHangEditForm.get('loai').patchValue(this.data.loai);
    this.khachHangEditForm.get('dien_thoai').patchValue(this.data.dien_thoai);
    this.khachHangEditForm.get('email').patchValue(this.data.email);
    this.khachHangEditForm.get('tinh_tp').patchValue(this.data.tinh_tp);
    this.khachHangEditForm.get('quan_huyen').patchValue(this.data.quan_huyen);
    this.khachHangEditForm.get('phuong_xa').patchValue(this.data.phuong_xa);
    this.khachHangEditForm.get('dia_chi').patchValue(this.data.dia_chi);

      this.configService.getCityProvince().takeWhile(() => this.alive).subscribe(res => {
          if (Object.getOwnPropertyNames(res).length) {
              this.citys = res;
              this.configService.getDistrict().takeWhile(() => this.alive).subscribe((dRes: any) => {
                  if (Object.getOwnPropertyNames(dRes).length) {
                      this.dictricts = dRes;
                      this.configService.getVillage().takeWhile(() => this.alive).subscribe((vRes: any) => {
                          if (Object.getOwnPropertyNames(vRes).length) {
                              this.villages = vRes;
                              this.edit_city = this.citys[this.data.tinh_tp].name;
                              this.edit_dictrict = this.dictricts[this.data.quan_huyen].name;
                              this.edit_village = this.villages[this.data.phuong_xa].name;
                          }
                      });
                  }
              });

          }

      });

  }

  onEditSubmit(event) {
    event.preventDefault();

    const data = this.khachHangEditForm.value;
    let result;
    data.to_chuc_id = this.toChuc.id;
    this.customerService.update(data).takeWhile(() => this.alive).subscribe((res: any) => {
      result = res;
      this.serialService.get_serial_by_kh(result.id).takeWhile(() => this.alive).subscribe((ress: any) => {
        if (ress.length > 0) {
          result.serials = ress;
        } else {
          result.serials = [];

        }
      });
      this.khachHangEdit.next(res);
        (<any>$('#edit_customer')).modal('hide');

        this.toastyService.success('Thao tác thành công');

    }, err => {
        this.toastyService.error('Thao tác thất bại');
    });
  }

  changeCity(event) {
    const code = event.value;
    this.code = code;
      this.khachHangEditForm.get('tinh_tp').patchValue(code);

    this.configService.getDistrict(this.code).takeWhile(() => this.alive).subscribe((res: any) => {
      console.log(res);
      this.dictrict = [];
      for (let key in res) {
        this.dictrict.push(res[key]);
      }
    });
  }

  changeDictrict(event) {
      this.khachHangEditForm.get('quan_huyen').patchValue(event.value);

    this.configService.getVillage(this.code, event.value).takeWhile(() => this.alive).subscribe((res: any) => {
      this.village = [];
      for (let key in res) {
        this.village.push(res[key]);
      }
      console.log(this.village);

    });
  }
    changeVillage(event) {
        this.khachHangEditForm.get('phuong_xa').patchValue(event.value);
    }

}
