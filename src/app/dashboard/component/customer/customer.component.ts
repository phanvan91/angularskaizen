import {Component, OnDestroy, OnInit, Host} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import {NganhHangService} from '../../../shared/nganh-hang.service';
import {CustomerService} from '../../../shared/customer.service';
import {SanPhamService} from '../../../shared/san-pham.service';
import {ConfigService} from '../../../shared/config.service';
import {SerialService} from "../../../shared/serial.service";

import {ToastyService} from 'ng2-toasty';
import {DashboardComponent} from '../../dashboard.component';
@Component({
    selector: 'app-customer',
    templateUrl: './customer.component.html',
    styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit , OnDestroy {

    user = environment.user;
    toChuc = environment.toChuc;
    alive = true;
    KhachHang = [];
    khachHangEditForm;
    page = 1;
    pages;
    total_page = [];
    total;
    editIndex;
    deleteIndex;
    city;
    dictrict;
    code;
    open = false;
    isAddKH = false;
    min;
    max;
    village = [];
    constructor(
        private customerService: CustomerService,
        private configService: ConfigService,
        private serialService: SerialService,
        private toastService: ToastyService,@Host() private parent: DashboardComponent
    ) { }

    ngOnInit() {
        this.khachHangEditForm = new FormGroup({
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
            dia_chi: new FormControl(null, {
                validators: [ Validators.required ]
            }),
        });
        // console.log(this.code);

        this.configService.getCityProvince().takeWhile(() => this.alive).subscribe(res => {
            if (Object.getOwnPropertyNames(res).length) {
                this.city = res;
                this.configService.getDistrict().takeWhile(() => this.alive).subscribe((dRes: any) => {
                    if (Object.getOwnPropertyNames(dRes).length) {
                        this.dictrict = dRes;
                        this.configService.getVillage().takeWhile(() => this.alive).subscribe((vRes: any) => {
                            if (Object.getOwnPropertyNames(vRes).length) {
                                this.village = vRes;
                                this.customerService.get_pagination( this.toChuc.id, this.page).takeWhile(() => this.alive)
                                    .subscribe((ress: any) => {
                                    this.KhachHang = ress.data;
                                    this.total = ress.total;
                                    this.page = ress.current_page;
                                    this.pages = ress.last_page;
                                    this.min = Math.max(this.page - 4, 1);
                                    this.max =  Math.min(this.page + 4 , this.pages );
                                    if (this.pages > 1 ) {
                                        this.total_page = [];
                                        for (let i =  this.min; i <= this.max; i++) {
                                            this.total_page.push(i);
                                        }
                                    }
                                });

                            }
                        });
                    }
                });
            }

        });
    }
    onDeleteSubmit() {
        const data: any = {};
        data.id = this.KhachHang[this.deleteIndex].id;
        data.to_chuc_id = this.toChuc.id;

        this.customerService.delete(data).takeWhile(() => this.alive).subscribe((res: any) => {
            this.KhachHang.splice(this.deleteIndex, 1);
            (<any>$('#delete_customer')).modal('hide');
            this.toastService.success(this.parent.toastOptions('Thao tác thành công', ''));
        }, err => {
            this.toastService.error(this.parent.toastOptions('Thất bại', err.error));
        });
    }

    openEdit(index) {
        this.open = false;
        this.editIndex = index;

        setTimeout(() => {
            this.open = true;
        }, 200);
        setTimeout(() => {
            (<any>$('#edit_customer')).modal('show');
        }, 400);

    }
    show_page(index) {
        this.page = index;
        this.customerService.get_pagination( this.toChuc.id, this.page).takeWhile(() => this.alive).subscribe((res: any) => {
            this.KhachHang = res.data;
            this.total = res.total;
            this.pages = res.last_page;
            this.min = Math.max(this.page - 4, 1);
            this.max =  Math.min(this.page + 4 , this.pages );
            if (this.pages > 1 ) {
                this.total_page = [];
                for (let i =  this.min; i <= this.max; i++) {
                    this.total_page.push(i);
                }
            }
        });
    }
    ngOnDestroy(): void {
        this.alive = false;
    }
    khachHangAdded(event) {
        this.KhachHang.push(event);
        this.isAddKH = false;
    }
}
