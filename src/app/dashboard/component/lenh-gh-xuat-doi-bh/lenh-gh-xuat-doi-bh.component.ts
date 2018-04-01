import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../shared/auth.service';
import {environment} from '../../../../environments/environment';
import {LoaiNguoiDungService} from '../../../shared/loai-nguoi-dung.service';
import {CustomerService} from '../../../shared/customer.service';
import {ModelService} from '../../../shared/model.service';
import * as HtmlDocx from 'html-docx-js/dist/html-docx';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-lenh-gh-xuat-doi-bh',
  templateUrl: './lenh-gh-xuat-doi-bh.component.html',
  styleUrls: ['./lenh-gh-xuat-doi-bh.component.scss']
})
export class LenhGhXuatDoiBhComponent implements OnInit {
  ngaytaophieu = new Date();
  ngayTaoPhieuStr;
  userinfo;
  loaiNguoiDungs;
  bophan;
  modelList;

  ajaxOptions_kh;
  options_kh;

  data_kh;
  data_kh_map;

  ajaxOptions_user;
  options_user;

  data_user;
  data_user_map;

  ajaxOptions_serial;
  options_serial;

  data_serial;
  data_serial_map;

  ajaxOptions_khoXuat;
  options_khoXuat;

  data_khoXuat;
  data_khoXuat_map;

  lenhGiaoHang;
  chiTietLenhGiaoHang;
  
  constructor(private authservice: AuthService, private loainguoidung: LoaiNguoiDungService,
    private customerService: CustomerService, private modelService: ModelService) { }


  ngOnInit() {
    this.authservice.me().subscribe((info: any) => {
      this.userinfo = info;
      this.loainguoidung.all(null).subscribe((res: any) => {
        if (res.length) {
          this.loaiNguoiDungs = res;
        }
      });
    });
    this.modelService.all(null).subscribe( (res: any) => {
      this.modelList = res;
    });
    this.ngayTaoPhieuStr = {
      date: this.ngaytaophieu.getDate(), month: this.ngaytaophieu.getMonth() + 1, year: this.ngaytaophieu.getFullYear()
    };
    this.ajaxOptions_kh = {
      url: environment.server_url + '/api/v1/khach-hang-search',
      dataType: 'json',
      delay: 250,
      cache: false,
      data: (params: any) => {
          return {
            query: params.term,
          };
      },
      processResults: (res: any, params: any) => {
        this.data_kh = [];
        this.data_kh_map = new Object();
        if (res.length > 0) {
            for (let i = 0; i < res.length; i++) {
                this.data_kh_map[res[i].id] = res[i];
            }
        }
        return {
            results: $.map(res, function (obj) {
                // console.log('data', obj);
                return { id: obj.id, text: obj.ma + '-' + obj.ten };
            })
        };
      }
    };
    this.options_kh = {
        ajax: this.ajaxOptions_kh,
        placeholder: 'Tìm kiếm khách hàng',
        language: {
          noResults: function(){
              return 'Không tồn tại';
          }
        },
        escapeMarkup: function (markup) {
            return markup;
        }
    };

    this.ajaxOptions_user = {
      url: environment.server_url + '/api/v1/user/search-nhan-vien',
      dataType: 'json',
      delay: 250,
      cache: false,
      data: (params: any) => {
          return {
            key_word: params.term,
            token: JSON.parse(localStorage.getItem('sstoken')).access_token
          };
      },
      processResults: (res: any, params: any) => {
        this.data_user = [];
        this.data_user_map = new Object();
        if (res.length > 0) {
            for (let i = 0; i < res.length; i++) {
                this.data_user_map[res[i].id] = res[i];
            }
        }
        return {
            results: $.map(res, function (obj) {
                // console.log('data', obj);
                return { id: obj.id, text: obj.name };
            })
        };
      }
    };
    this.options_user = {
        ajax: this.ajaxOptions_user,
        placeholder: 'Tìm kiếm khách hàng',
        language: {
          noResults: function(){
              return 'Không tồn tại';
          }
        },
        escapeMarkup: function (markup) {
            return markup;
        }
    };

    this.ajaxOptions_khoXuat = {
      url: environment.server_url + '/api/v1/kho/search-kho-xuat',
      dataType: 'json',
      delay: 250,
      cache: false,
      data: (params: any) => {
          return {
            key_word: params.term,
            loai_kho: 1,
            token: JSON.parse(localStorage.getItem('sstoken')).access_token
          };
      },
      processResults: (res: any, params: any) => {
        this.data_khoXuat = [];
        this.data_khoXuat_map = new Object();
        if (res.length > 0) {
            for (let i = 0; i < res.length; i++) {
                this.data_khoXuat_map[res[i].id] = res[i];
            }
        }
        return {
            results: $.map(res, function (obj) {
                // console.log('data', obj);
                return { id: obj.id, text: obj.ten_kho };
            })
        };
      }
    };
    this.options_khoXuat = {
        ajax: this.ajaxOptions_khoXuat,
        placeholder: 'Tìm kiếm kho xuat',
        language: {
          noResults: function(){
              return 'Không tồn tại';
          }
        },
        escapeMarkup: function (markup) {
            return markup;
        }
    };

    this.ajaxOptions_serial = {
      url: environment.server_url + '/api/v1/serial-search',
      dataType: 'json',
      delay: 250,
      cache: false,
      data: (params: any) => {
          return {
            query: params.term
          };
      },
      processResults: (res: any, params: any) => {
        this.data_serial = [];
        this.data_serial_map = new Object();
        if (res.length > 0) {
            for (let i = 0; i < res.length; i++) {
                this.data_serial_map[res[i].id] = res[i];
            }
        }
        return {
            results: $.map(res, function (obj) {
                // console.log('data', obj);
                return { id: obj.id, text: obj.serial };
            })
        };
      }
    };
    this.options_serial = {
        ajax: this.ajaxOptions_serial,
        placeholder: 'Tìm kiếm serial',
        language: {
          noResults: function(){
              return 'Không tồn tại';
          }
        },
        escapeMarkup: function (markup) {
            return markup;
        }
    };

    this.lenhGiaoHang = {
      nguoi_de_nghi: { ten: null, bo_phan: null },
      khach_hang: { ten: null, sdt: null, dia_chi: null },
      ly_do: null,
      ghi_chu: 'NHẬN TỦ HƯ + THÙNG XỐP PHỤ KIỆN',
      chi_tiet: []
    };

    this.chiTietLenhGiaoHang = {
      id: null, model: null, solg: null, khoxuat: null, ghi_chu: null
    };
  }

  onChangeNgDeNghi(event) {
    // console.log(this.data_user_map[event.value]);
    const bp = this.loaiNguoiDungs.find(x => x.id == this.data_user_map[event.value].loai_nguoi_dung_id);
    this.lenhGiaoHang.nguoi_de_nghi.bo_phan = bp.ten_loai;
    this.lenhGiaoHang.nguoi_de_nghi.ten = this.data_user_map[event.value].name;
  }

  onChangeKhachHang(event) {
    // console.log(this.data_kh_map[event.value]);
    this.lenhGiaoHang.khach_hang.ten = this.data_kh_map[event.value].ten;
    this.lenhGiaoHang.khach_hang.sdt = this.data_kh_map[event.value].dien_thoai;
    this.lenhGiaoHang.khach_hang.dia_chi = this.data_kh_map[event.value].dia_chi;
  }

  onChangeSerial(event) {
    console.log(this.data_serial_map[event.value]);
    const serial = this.data_serial_map[event.value];
    const modelId = this.data_serial_map[event.value].model_id;
    const modelSelect = this.modelList.find( x => x.id == modelId);
    this.chiTietLenhGiaoHang.model = serial.serial + '-' + modelSelect.ten;
    this.chiTietLenhGiaoHang.id = serial.id;
  }

  onChangeKho(event) {
    console.log(this.data_khoXuat_map[event.value]);
    this.chiTietLenhGiaoHang.khoxuat = this.data_khoXuat_map[event.value].ten_kho;
  }

  addToList() {
    if (isNaN(this.chiTietLenhGiaoHang.solg ) || !this.chiTietLenhGiaoHang.solg) {
      alert('Vui lòng nhập đúng số lượng');
      return;
    }
    const itemExist = this.lenhGiaoHang.chi_tiet.find( x => x.id == this.chiTietLenhGiaoHang.id);
    if (itemExist) {
      itemExist.solg = parseInt(itemExist.solg, 0) + parseInt(this.chiTietLenhGiaoHang.solg, 0);
      itemExist.ghi_chu = this.chiTietLenhGiaoHang.ghi_chu;
    }else {
      const item = {
        id: this.chiTietLenhGiaoHang.id,
        model: this.chiTietLenhGiaoHang.model,
        solg: this.chiTietLenhGiaoHang.solg,
        ghi_chu: this.chiTietLenhGiaoHang.ghi_chu
      };
      this.lenhGiaoHang.chi_tiet.push(item);
    }
  }
  onPrint() {
      let printContents, popupWin;
      printContents = document.getElementById('order-print').innerHTML;
      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin.document.open();

      const printContent = `
      <html>
        <head>
            <style>
              table{width: 100%;border-collapse: collapse; margin: 20px 0px;}
              td, th{border: 1px solid #aaa; padding: 5px;}
              .order-header .title{font-size:20px; font-weight: bold}
              .order-body .title{font-size: 23px; font-weight: bold; margin-bottom: 15px;}
              .order-body .title, .order-body .order-time, .order-body .order-no{text-align: center}
              .order-no{margin-bottom: 20px;}
              .order-body{ margin : 30px 0px;}
              .order-info div{display: flex;}
              .order-info .dot-inline{border-bottom: 1px dotted #aaa; flex: 1}
              .text.left{text-align: left;}
              .text.right{text-align: right;}
              .text.center{text-align: center;}
              .row{width: 100%; clear: both;}
              .row .col{width: 50%; float: left; text-align: center; line-height: 60px;}
              @media screen {
                    .print-footer{
                        display: none;
                    }
              }
              @media print {
                    .print-footer{
                        position: fixed;
                        bottom: 0px;
                        text-align: center;
                        display: block;
                        width: 100%;
                    }
              }
            </style>
        </head>
        <body onload="window.print();window.close()">${printContents}</body>
      </html>`;
      popupWin.document.write(printContent);
      popupWin.document.close();
  }
  convertDocx() {
    const printContents = document.getElementById('order-print').innerHTML;
    const printContent = `
      <html>
        <head>
            <style>
              table{width: 100%;border-collapse: collapse; margin: 20px 0px;}
              td, th{border: 1px solid #aaa; padding: 5px;}
              .order-header .title{font-size:20px; font-weight: bold}
              .order-body .title{font-size: 23px; font-weight: bold; margin-bottom: 15px;}
              .order-body .title, .order-body .order-time, .order-body .order-no{text-align: center}
              .order-no{margin-bottom: 20px;}
              .order-body{ margin : 30px 0px;}
              .order-info div{display: flex;}
              .order-info .dot-inline{border-bottom: 1px dotted #aaa; flex: 1}
              .text.left{text-align: left;}
              .text.right{text-align: right;}
              .text.center{text-align: center;}
              .row{width: 100%; clear: both;}
              .row .col{width: 50%; float: left; text-align: center; line-height: 60px;}
              @media screen {
                    .print-footer{
                        display: none;
                    }
              }
              @media print {
                    .print-footer{
                        position: fixed;
                        bottom: 0px;
                        text-align: center;
                        display: block;
                        width: 100%;
                    }
              }
            </style>
        </head>
        <body onload="window.print();window.close()">${printContents}</body>
      </html>`;
    const converted = HtmlDocx.asBlob(printContent);
    console.log(converted);
    const d = new Date();
    const stringName = 'lenh_giao_hang_xbh_' 
    + d.getFullYear() + '-' + ( d.getMonth() + 1 ) + '-' + d.getDate() + '-' + d.getHours() + '.docx';
    fileSaver.saveAs( converted, stringName);
  }
}
