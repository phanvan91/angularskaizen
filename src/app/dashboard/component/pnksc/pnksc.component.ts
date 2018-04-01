import {Component, OnDestroy, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ConfigService} from '../../../shared/config.service';
import {CustomerService} from '../../../shared/customer.service';
import {SerialService} from '../../../shared/serial.service';
import {environment} from '../../../../environments/environment';
import {PhieuSuaChuaService} from '../../../shared/phieu-sua-chua.service';
import {AuthService} from '../../../shared/auth.service';
import {KhoService} from "../../../shared/kho.service";

@Component({
  selector: 'app-pnksc',
  templateUrl: './pnksc.component.html',
  styleUrls: ['./pnksc.component.scss']
})
export class PnkscComponent implements OnInit {

    user = environment.user;
    toChuc = environment.toChuc;
    server_url = environment.server_url;
    alive = true;
    options_kh;
    options_serial;
    ajaxOptions_kh;
    ajaxOptions_serial;
    KhachHang;
    city;
    dictrict;
    village;
    Serials = [];
    me;
    options_tthh;
    ajaxOptions_tthh;
    constructor(
        private customerService: CustomerService,
        private configService: ConfigService,
        private serialService: SerialService,
        private phieuSuaChuaService: PhieuSuaChuaService,
        private authService: AuthService,
        private khoService: KhoService

    ) { }

  ngOnInit() {

      this.configService.getCityProvince().takeWhile(() => this.alive).subscribe(res => {
          if (Object.getOwnPropertyNames(res).length) {
              this.city = res;
              this.configService.getDistrict().takeWhile(() => this.alive).subscribe((dRes: any) => {
                  if (Object.getOwnPropertyNames(dRes).length) {
                      this.dictrict = dRes;
                      this.configService.getVillage().takeWhile(() => this.alive).subscribe((vRes: any) => {
                          if (Object.getOwnPropertyNames(vRes).length) {
                              this.village = vRes;

                          }
                      });
                  }
              });
          }

      });
      this.authService.me().takeWhile(() => this.alive).subscribe(res => {
          this.me = res;

      });


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
                  return '<a data-toggle="modal" data-target="#add_customer"> ' +
                      '<i class="fa fa-plus-square" aria-hidden="true"></i> Thêm mới khách hàng</a>';
              }
          },
          escapeMarkup: function (markup) {
              return markup;
          }
      };
      this.ajaxOptions_tthh = {
          url: this.server_url + '/api/v1/tthh-search',
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
                      const text = '[' + obj.ma_tinh_trang_hu_hong + ']-' + obj.mo_ta;
                      return { id: obj.id, text: text };
                  })
              };
          },
      };


      this.options_tthh = {
          ajax: this.ajaxOptions_tthh,
          placeholder: 'Tìm kiếm',
          language: {
              noResults: function(){
                  return 'Không có kết quả';
              }
          },
          escapeMarkup: function (markup) {
              return markup;
          }
      };

      this.ajaxOptions_serial = {
          url: this.server_url + '/api/v1/serial-search',
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
                      return { id: obj.id, text: obj.serial };
                  })
              };
          },
      };
      this.options_serial = {
          ajax: this.ajaxOptions_serial,
          placeholder: 'Tìm kiếm seial',
          language: {
              noResults: function(){
                  return '<a data-toggle="modal" data-target="#add_serial"> ' +
                      '<i class="fa fa-plus-square" aria-hidden="true"></i> Thêm mới serial</a>';
              }
          },
          escapeMarkup: function (markup) {
              return markup;
          }
      };


  }
    onChangeValue(e, type, index) {
        // console.log(e.data[0].text);
        const id = e.value;
         if (type === 'khachhang') {
             this.customerService.get_customer(id).takeWhile(() => this.alive).subscribe((res: any) => {
                this.KhachHang = res;
             });

         }
        if (type === 'serial') {
            this.serialService.get_serial(id).takeWhile(() => this.alive).subscribe((res: any) => {
                this.Serials.push(res);
            });

        }
        if (type === 'tthh') {
            this.Serials[index].tinh_trang_hu_hong_id = id;
            this.Serials[index].tinh_trang_hu_hong = e.data[0].text;
             console.log(this.Serials[index]);
            console.log(this.Serials);


        }

    }

    delete_row(i) {
        this.Serials.splice(i, 1);
    }

    create_phieu_nhap_kho() {

        if (this.KhachHang && this.Serials) {
            const data: any = {};
            data.to_chuc_id = this.toChuc.id
            data.id_khach_hang = this.KhachHang.id;
            data.user_id = this.me.id;
            this.khoService.khoSelected.subscribe((res: any ) => {
                if (res.length) {
                    data.tram_bao_hanh_id = res[0].tram_bao_hanh_id;
                } else {
                    data.tram_bao_hanh_id = this.me.tram_bao_hanh_id;

                }
            });
            data.data_serial = this.Serials;
            if (data.tram_bao_hanh_id > 0) {
                this.phieuSuaChuaService.create_phieu_nhap_kho(data).takeWhile(() => this.alive).subscribe((res: any) => {
                    console.log(res);
                    alert('Bạn đã tạo danh sách phiếu nhập kho sửa chữa thành công');
                });
            } else {
                alert('Hãy chọn trạm nhập kho');

            }

        }else {
            alert('Vui Lòng Lựa Chọn Đầy Đủ Thông Tin');
        }

    }
}
