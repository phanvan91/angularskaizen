import {Component, OnDestroy, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import {PhieuDeNghiService} from '../../../shared/phieu-de-nghi.service';
import {LinhKienService} from "../../../shared/linh-kien.service";
import {KhoService} from "../../../shared/kho.service";
import {AuthService} from "../../../shared/auth.service";
import {DateService} from "../../../shared/date.service";
import {CongViecService} from "../../../shared/cong-viec.service";
import {UserService} from "../../../shared/user.service";

@Component({
  selector: 'app-dscvct',
  templateUrl: './dscvct.component.html',
  styleUrls: ['./dscvct.component.scss']
})
export class DscvctComponent implements OnInit, OnDestroy {
    startDate =  new Date('2018-01-01');
    endDate =  new Date();
    user = environment.user;
    toChuc = environment.toChuc;
    server_url = environment.server_url;
    alive = true;
    page = 1;
    pages;
    total_page = [];
    total;
    editIndex;
    deleteIndex;
    min ;
    max;
    congviec = [];
    me: any = {};
    trang_thai_cv = environment.trang_thai_cong_viec;
    status_psc = environment.status_psc;
    status_phieu_de_nghi_lk = environment.status_phieu_de_nghi_lk;
    loai_chung_tu_cv = environment.loai_chung_tu_cv;
    loai_cong_viec = environment.loai_cong_viec;
    options_nvbh;
    phanCongForm;
    xacnhanPDNForm;
    editPDNIndex;
    openPDNLK = false;
    phieu_de_nghi_id;
    tram_bao_hanh_id;
    NVBH = [];
    constructor(
      private dateService: DateService,
      private authService: AuthService,
      private congViecService: CongViecService,
      private userService: UserService,
      private phieuDeNghiCapVatTu: PhieuDeNghiService

) { }

  ngOnInit() {
      this.phanCongForm = new FormGroup({
          log_id: new FormControl(null, {
              validators: [Validators.required, Validators.email]
          }),
          request_id: new FormControl(null, {
              validators: [Validators.required, Validators.email]
          }),
          user_id: new FormControl(null, {
              validators: [Validators.required, Validators.email]
          }),
          nhan_vien_bao_hanh_id: new FormControl(null, {
              validators: [Validators.required, Validators.email]
          }),
          ghi_chu: new FormControl(null, {
              validators: [Validators.required]
          }),
      });
      this.xacnhanPDNForm = new FormGroup({
          request_id: new FormControl(null, {
              validators: [Validators.required, Validators.email]
          }),
          ghi_chu: new FormControl(null, {
              validators: [Validators.required]
          }),
          user_id: new FormControl(null, {
              validators: [Validators.required, Validators.email]
          }),
          phieu_de_nghi_id: new FormControl(null, {
              validators: [Validators.required]
          }),
          trang_thai: new FormControl(null, {
              validators: [Validators.required]
          }),

      });

      this.options_nvbh = {
          placeholder: 'Tìm kiếm NVBH',
          language: {
              noResults: function(){
                  return 'Không tìm thấy kết quả';
              }
          },
          escapeMarkup: function (markup) {
              return markup;
          }
      };

      this.authService.me().takeWhile(() => this.alive).subscribe(resMe => {
          this.me = resMe;
          const startDate = this.dateService.getDateString(this.startDate);
          const endDate = this.dateService.getDateString(this.endDate);
          this.congViecService.get_pagination( this.me.id, this.page,
              startDate, endDate).takeWhile(() => this.alive).subscribe((res: any) => {
              this.congviec = res.data;
              console.log(res);
              this.total = res.total;
              this.page = res.current_page;
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




      }, err => console.log(err));

  }
    show_page(index) {
        this.page = index;
        const startDate = this.dateService.getDateString(this.startDate);
        const endDate = this.dateService.getDateString(this.endDate);
        this.congViecService.get_pagination( this.me.id, this.page,
            startDate, endDate).takeWhile(() => this.alive).subscribe((res: any) => {
            this.congviec = res.data;
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

    submitSearch(event) {

        const startDate = this.dateService.getDateString(this.startDate);
        const endDate = this.dateService.getDateString(this.endDate);
        this.page = 1;
        this.congViecService.get_pagination( this.me.id, this.page,
            startDate, endDate).takeWhile(() => this.alive).subscribe((res: any) => {
            this.congviec = res.data;

            this.total = res.total;
            this.page = res.current_page;
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
    onChangeValue(e, type) {
        // console.log(e.value);
        const id = e.value;
        if (type === 'nvbh') {
            this.phanCongForm.get('nhan_vien_bao_hanh_id').patchValue(id);


        }
    }
    openPhanCong(index) {
        this.phanCongForm.get('request_id').patchValue(this.congviec[index].id);
        this.phanCongForm.get('user_id').patchValue(this.me.id);

        this.editIndex = index;
        this.userService.getUsers('NVBH', this.me.tram_bao_hanh_id).takeWhile(() => this.alive).subscribe((resUser: any) => {
            console.log(resUser);
            this.NVBH = resUser;
        });


    }
    onSubmitPC(event) {
        event.preventDefault();
        const data = this.phanCongForm.value;
        console.log(data);
        this.congViecService.phanCongBH(data).takeWhile(() => this.alive).subscribe((resPC: any) => {
            this.congviec[this.editIndex] = resPC;
            (<any>$('#phan_cong_pbh')).modal('hide');
            console.log(resPC);
        });


    }
    openXacNhan(index) {
        this.xacnhanPDNForm.get('request_id').patchValue(this.congviec[index].id);
        this.xacnhanPDNForm.get('user_id').patchValue(this.me.id);
        this.xacnhanPDNForm.get('phieu_de_nghi_id').patchValue(this.congviec[index].doi_tuong_id);
        this.xacnhanPDNForm.get('trang_thai').patchValue(5);

        this.editIndex = index;


    }
    onSubmitXNPDN(event) {
        event.preventDefault();
        const data = this.xacnhanPDNForm.value;
        data.loai_cong_viec = 4;
        console.log(data);
        this.phieuDeNghiCapVatTu.xacnhanDNLK(data).takeWhile(() => this.alive).subscribe((res: any) => {
            this.congviec[this.editIndex] = res;
            // console.log(res);
            (<any>$('#xac_nhan_de_nghi')).modal('hide');

        });


    }
    openPDN(index) {
        this.phieu_de_nghi_id = this.congviec[index].doi_tuong_id;
        this.openPDNLK = false;
        this.editPDNIndex = index;

        setTimeout(() => {
            this.openPDNLK = true;
            (<any>$('#add_edit_lk')).modal('show');
        }, 200);
        setTimeout(() => {
            (<any>$('#add_edit_lk')).modal('show');
        }, 400);


        setTimeout(() => {
            (<any>$('#add_edit_lk')).modal('show');
        }, 400);
    }

    ngOnDestroy(): void {
        this.alive = false;
    }
}
