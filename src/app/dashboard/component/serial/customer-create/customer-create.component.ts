import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ConfigService} from '../../../../shared/config.service';
import {environment} from '../../../../../environments/environment';
import {CustomerService} from '../../../../shared/customer.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastyService} from "ng2-toasty";

@Component({
    selector: 'app-customer-create',
    templateUrl: './customer-create.component.html',
    styleUrls: ['./customer-create.component.scss']
})
export class CustomerCreateComponent implements OnInit, OnDestroy {
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
            loai: new FormControl(null, {
                validators: [ Validators.required ]
            }),
            dien_thoai: new FormControl(null, {
                validators: [ Validators.required ]
            }),
            email: new FormControl(null, {
                validators: [ Validators.required ]
            }),
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
    }
    changeCity(event) {
        const code = event.value;
        this.code = code;
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
            this.toastyService.success('Thao tác thành công');

        }, err => {
            this.toastyService.error('Thao tác thất bại' + err);
        });

    }

    ngOnDestroy(): void {
        this.alive = false;
    }

}
