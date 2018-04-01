import {Component, EventEmitter, OnDestroy, OnInit, Output} from "@angular/core";
import { HttpClient } from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import {NganhHangService} from '../../../shared/nganh-hang.service';
import {CustomerService} from '../../../shared/customer.service';
import {SanPhamService} from '../../../shared/san-pham.service';
import {ConfigService} from '../../../shared/config.service';
import {ToastyService} from "ng2-toasty";
@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent implements OnInit, OnDestroy {
    user = environment.user;
    toChuc = environment.toChuc;
    alive = true;
    khachHangCreateForm;
    page = 1;
    pages;
    total_page = [];
    total;
    editIndex;
    deleteIndex;
    city = [];
    dictrict = [];
    village = [];
    code;
    code_dict;
    maTuSinh;
    @Output() khachHangAdded = new EventEmitter<boolean>();

    constructor(
        private customerService: CustomerService,
        private configService: ConfigService,
        private toastyService: ToastyService

    ) { }

  ngOnInit() {

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
      this.configService.getCityProvince().takeWhile(() => this.alive).subscribe((res: any) => {
          for( let key in res) {
              this.city.push(res[key]);
          }

      });

      this.configService.getDistrict(this.code).takeWhile(() => this.alive).subscribe((res: any) => {
          this.dictrict = [];
          for( let key in res) {
              this.dictrict.push(res[key]);
          }

      });
      this.customerService.getMaTuSinh().subscribe((res: any) => {
        this.maTuSinh = res.ma;
        this.khachHangCreateForm.get('ma').patchValue(this.maTuSinh);
      });

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
            console.log(this.village);

        });
    }
    changeVillage(event) {
        this.khachHangCreateForm.get('phuong_xa').patchValue(event.value);
    }
    onCreateKhachHangSubmit(event) {
        event.preventDefault();
        const data = this.khachHangCreateForm.value;
        data.to_chuc_id = this.toChuc.id;
        console.log(data);
        this.customerService.create(data).takeWhile(() => this.alive).subscribe((res: any) => {
            this.khachHangAdded.next(res);
            (<any>$('#add_customer')).modal('hide');
            this.toastyService.success('Thao tác thành công');

        }, err => {
            this.toastyService.error('Thao tác thất bại hoặc số điện thoại đã tồn tại');
        });
    }
    ngOnDestroy(): void {
        this.alive = false;
    }
}
