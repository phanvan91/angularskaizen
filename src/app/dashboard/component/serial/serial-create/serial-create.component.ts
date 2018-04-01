import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../../environments/environment';
import {SanPhamService} from '../../../../shared/san-pham.service';
import {SerialService} from '../../../../shared/serial.service';
import {NganhHangService} from '../../../../shared/nganh-hang.service';
import {ModelService} from '../../../../shared/model.service';
import {CustomerService} from '../../../../shared/customer.service';
import {DateService} from '../../../../shared/date.service';
import {ToastyService} from 'ng2-toasty';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-serial-create',
  templateUrl: './serial-create.component.html',
  styleUrls: ['./serial-create.component.scss']
})
export class SerialCreateComponent implements OnInit {
    user = environment.user;
    toChuc = environment.toChuc;
    SanPham = [];
    Model = [];
    SanPhamAll = [];
    ModelAll = [];
    NganhHang = [];
    page = 1;
    pages;
    total_page = [];
    total;
    alive = true;
    serialCreateForm;
    editIndex;
    deleteIndex;
    server_url = environment.server_url;
    status= environment.status_serial;
    status_serial = [];
    ajaxOptions_kh;
    options_kh;
    KhachHang;

    ngay_san_xuat = new Date();
    ngay_xuat_kho= new Date();
    ngay_kich_hoat_bh= new Date();
    ngay_het_han= new Date();
    bsConfig = {
        showWeekNumbers: false,
        dateInputFormat: 'DD/MM/YYYY'
    };

    @Output() serialAdded = new EventEmitter<boolean>();
    @Output() customer = new EventEmitter<boolean>();

    @Input() serial_add;

    constructor(
      private serialService: SerialService,
      private sanPhamService: SanPhamService,
      private nganhHangService: NganhHangService,
      private modelService: ModelService,
      private customerService: CustomerService,
      private dateService: DateService,
    private toastyService: ToastyService

  ) { }

  ngOnInit() {
      const arr_status = [];
      for ( let s = 1; s <= 4; s++) {
          arr_status[s] = this.status[s];
          this.status_serial.push(arr_status);


      }
      this.ajaxOptions_kh = {
          url: this.server_url + '/api/v1/khach-hang-search',
          dataType: 'json',
          delay: 250,
          cache: false,
          data: (params: any) => {
              if (params.term) {
                  if (params.term.length >= 3) {
                      return {
                          query: params.term,
                      };
                  }
              }
          },
          processResults: (data: any, params: any) => {
              return {
                  results: $.map(data, function (obj) {
                      // console.log('data', obj);
                      return { id: obj.id, text: obj.ten };
                  })
              };
          },
      };

      this.options_kh = {
          ajax: this.ajaxOptions_kh,
          placeholder: 'Tìm kiếm khách hàng',
          language: {
              noResults: function(){
                  return '<a onclick="document.getElementById(\'add-cus-serial\').style.display = \'block\'"> ' +
                      '<i class="fa fa-plus-square" aria-hidden="true"></i> Thêm mới khách hàng</a>';
              }
          },
          escapeMarkup: function (markup) {
              return markup;
          }
      };
      this.serialCreateForm = new FormGroup({
          id: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          serial: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          trang_thai: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          model_id: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          san_pham_id: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          nganh_hang_id: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          ngay_san_xuat: new FormControl(null, {
              validators: [ Validators.required ]
          }),
          ngay_xuat_kho: new FormControl(null, {
              // validators: [ Validators.required ]
          }),
          ngay_kich_hoat_bh: new FormControl(null, {
              // validators: [ Validators.required ]
          }),
          ngay_het_han: new FormControl(null, {
              // validators: [ Validators.required ]
          }),
          khach_hang_id: new FormControl(null, {
              validators: [ Validators.required ]
          }),

      });
      if (this.serial_add) {
          this.serialCreateForm.get('serial').patchValue(this.serial_add);

      }
      this.nganhHangService.all().takeWhile(() => this.alive).subscribe((res: any) => {
          if (res.length) {
              this.NganhHang = res;
          }
      });

      this.modelService.all(this.toChuc.id).takeWhile(() => this.alive).subscribe((res: any) => {
          if (res.length) {
              this.ModelAll = res;
          }
      });

      this.sanPhamService.all().takeWhile(() => this.alive).subscribe((res: any) => {
          if (res.length) {
              this.SanPhamAll = res;
          }
      });
  }
    onChangeValue(e, type) {
        // console.log(e.value);
        const id = e.value;
        if (type === 'khachhang') {
            this.serialCreateForm.get('khach_hang_id').patchValue(id);


        }

    }

    onCreateSerialSubmit(event) {
        event.preventDefault();
        const data = this.serialCreateForm.value;
        data.to_chuc_id = this.toChuc.id;
        console.log(data.ngay_xuat_kho);
        data.ngay_san_xuat = this.dateService.getDateString(this.ngay_san_xuat);
        if(this.ngay_xuat_kho === null){
          data.ngay_xuat_kho = null;
        }else{
          data.ngay_xuat_kho = this.dateService.getDateString(this.ngay_xuat_kho);
        }
        if(this.ngay_kich_hoat_bh === null){
          data.ngay_kich_hoat_bh = null;
        }else{
          data.ngay_kich_hoat_bh = this.dateService.getDateString(this.ngay_kich_hoat_bh);
        }
        if(this.ngay_het_han === null){
          data.ngay_het_han = null;
        }else{
          data.ngay_het_han = this.dateService.getDateString(this.ngay_het_han);
        }

        if (this.KhachHang) {
            if (this.KhachHang.id > 0) {
                data.khach_hang_id = this.KhachHang.id;

            }
        }
        this.serialService.create(data).takeWhile(() => this.alive).subscribe((res: any) => {
            this.serialAdded.next(res);
            if (res.khach_hang_id > 0) {
                this.customerService.show(res.khach_hang_id).takeWhile(() => this.alive).subscribe((resKH: any) => {
                    this.customer.next(resKH);
                }, err => {
                    this.toastyService.error('Mã serial đã tồn tại');
                });
            }

            (<any>$('#add_serial')).modal('hide');
            this.toastyService.success('Thao tác thành công');

        }, err => {
            this.toastyService.error('Mã serial đã tồn tại');
        });
    }
    changeNganh(event) {
        const nganh = event.value;
        this.serialCreateForm.get('nganh_hang_id').patchValue(nganh);

        this.sanPhamService.show_by_nganh(nganh).takeWhile(() => this.alive).subscribe((res: any) => {
            if (res.length) {
                this.SanPham = res;
            }
        });
    }
    changeProduct(event) {
        const sp = event.value;
        this.serialCreateForm.get('san_pham_id').patchValue(sp);
        this.modelService.show_by_sp(sp).takeWhile(() => this.alive).subscribe((res: any) => {
            if (res.length) {
                this.Model = res;
            }
        });
    }
    changeModel(event) {
        this.serialCreateForm.get('model_id').patchValue(event.value);


    }


}
