import { Component, OnInit, OnDestroy } from '@angular/core';
import {AuthService} from '../../../shared/auth.service';
import {environment} from '../../../../environments/environment';
import {LoaiNguoiDungService} from '../../../shared/loai-nguoi-dung.service';
import {CustomerService} from '../../../shared/customer.service';
import {ModelService} from '../../../shared/model.service';
import * as HtmlDocx from 'html-docx-js/dist/html-docx';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-lenh-nhan-hang-ve',
  templateUrl: './lenh-nhan-hang-ve.component.html',
  styleUrls: ['./lenh-nhan-hang-ve.component.scss']
})
export class LenhNhanHangVeComponent implements OnInit {
  ngaytaophieu = new Date();
  ngayTaoPhieuStr;
  userinfo;
  toChuc = environment.toChuc;
  loaiNguoiDungs;
  bophan;
  server_url = environment.server_url;
  ajaxOptions_kh;
  options_kh;

  data_kh;
  data_kh_map;

  ajaxOptions_tram;
  options_tram;

  data_tram;
  data_tram_map;

  ajaxOptions_tTbh;
  options_tTbh;

  data_tTbh;
  data_tTbh_map;

  locNhanHang;
  locGiaoHang;
  openFilterNhanHang;
  openFilterGiaoHang;

  lenhNhanHang;
  chiTietNhanHang = { serial: null, soluong: null , ghi_chu: null };

  ajaxOptions_serial;
  options_serial;

  data_serial;
  data_serial_map;

  modelList;
  modelSelect;

  printContent;

  constructor(private authservice: AuthService, private loainguoidung: LoaiNguoiDungService,
              private customerService: CustomerService, private modelService: ModelService) { }

  ngOnInit() {
    this.authservice.me().subscribe((info: any) => {
      this.userinfo = info;
      this.loainguoidung.all(this.toChuc.id).subscribe((res: any) => {
        if (res.length) {
          this.loaiNguoiDungs = res;
          // console.log(this.loaiNguoiDungs);
          for(let o of this.loaiNguoiDungs){
            if(this.userinfo.loai_nguoi_dung_id === o.id){
              this.bophan = o;
            }
          }
        }
      });
    });
    this.modelService.all(null).subscribe( (res: any) => {
      this.modelList = res;
    });
    this.ngayTaoPhieuStr = {
      date: this.ngaytaophieu.getDate(), month: this.ngaytaophieu.getMonth() + 1, year: this.ngaytaophieu.getFullYear()
    };
    this.lenhNhanHang = {
      nhan_hang: { from: null, sdt: null, dia_chi: null },
      giao_hang: { to: null, sdt: null, dia_chi: null},
      lydo: null,
      chi_tiet: []
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

    this.ajaxOptions_tram = {
      url: environment.server_url + '/api/v1/tram-bao-hanh/search',
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
        this.data_tram = [];
        this.data_tram_map = new Object();
        if (res.length > 0) {
            for (let i = 0; i < res.length; i++) {
                this.data_tram_map[res[i].id] = res[i];
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
    this.options_tram = {
        ajax: this.ajaxOptions_tram,
        placeholder: 'Tìm kiếm trạm bảo hành',
        language: {
          noResults: function(){
              return 'Không tồn tại';
          }
        },
        escapeMarkup: function (markup) {
            return markup;
        }
    };

    this.ajaxOptions_tTbh = {
      url: environment.server_url + '/api/v1/trung-tam-bao-hanh/search',
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
        this.data_tTbh = [];
        this.data_tTbh_map = new Object();
        if (res.length > 0) {
            for (let i = 0; i < res.length; i++) {
                this.data_tTbh_map[res[i].id] = res[i];
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
    this.options_tTbh = {
        ajax: this.ajaxOptions_tTbh,
        placeholder: 'Tìm kiếm trung tâm bảo hành',
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

  }
  Onprint() {
    let printContents, popupWin;
    printContents = document.getElementById('order-print').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();

    this.printContent = `
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
    popupWin.document.write(this.printContent);
    popupWin.document.close();
  }
  locNhanHangChange() {
    this.openFilterNhanHang = false;
    setTimeout(() => {
      this.openFilterNhanHang = true;
    }, 300);
  }
  locGiaoHangChange() {
    this.openFilterGiaoHang = false;
    setTimeout(() => {
      this.openFilterGiaoHang = true;
    }, 300);
  }
  onChangeNhanHang(event, type) {
    switch (type) {
      case 0:  // khach hang
        this.setValueLenhNhanHang(0,
          this.data_kh_map[event.value], this.data_kh_map[event.value].dien_thoai, this.data_kh_map[event.value].dia_chi);
        break;
      case 1:  // tram
      this.setValueLenhNhanHang(0,
        this.data_tram_map[event.value], this.data_tram_map[event.value].dien_thoai, this.data_tram_map[event.value].dia_chi);
        break;
      case 2:  // trung tam bao hanh
      this.setValueLenhNhanHang(0,
        this.data_tTbh_map[event.value], this.data_tTbh_map[event.value].dien_thoai, this.data_tTbh_map[event.value].dia_chi);
        break;
    }
  }
  onChangeGiaoHang(event, type) {
    switch (type) {
      case 0:  // khach hang
        this.setValueLenhNhanHang(1,
          this.data_kh_map[event.value], this.data_kh_map[event.value].dien_thoai, this.data_kh_map[event.value].dia_chi);
        break;
      case 1:  // tram
      this.setValueLenhNhanHang(1,
        this.data_tram_map[event.value], this.data_tram_map[event.value].dien_thoai, this.data_tram_map[event.value].dia_chi);
        break;
      case 2:  // trung tam bao hanh
      this.setValueLenhNhanHang(1,
        this.data_tTbh_map[event.value], this.data_tTbh_map[event.value].dien_thoai, this.data_tTbh_map[event.value].dia_chi);
        break;
    }
  }
  setValueLenhNhanHang(type, obj, sdt, diaChi) {
    if (type) {
      this.lenhNhanHang.giao_hang.to = obj;
      this.lenhNhanHang.giao_hang.sdt = sdt;
      this.lenhNhanHang.giao_hang.dia_chi = diaChi;
    }else {
      this.lenhNhanHang.nhan_hang.from = obj;
      this.lenhNhanHang.nhan_hang.sdt = sdt;
      this.lenhNhanHang.nhan_hang.dia_chi = diaChi;
    }

    console.log(this.lenhNhanHang);
  }
  onChangeSerial(event) {
    this.chiTietNhanHang.serial = this.data_serial_map[event.value];
    const modelId = this.data_serial_map[event.value].model_id;
    this.modelSelect = this.modelList.find( x => x.id == modelId);
    console.log(this.modelSelect);
  }
  addToList() {
    const itemExist = this.lenhNhanHang.chi_tiet.find( x => x.id == this.chiTietNhanHang.serial.id);
    if (itemExist) {
      itemExist.solg = parseInt(itemExist.solg, 0) + parseInt(this.chiTietNhanHang.soluong, 0);
      itemExist.ghi_chu = this.chiTietNhanHang.ghi_chu;
    }else {
      const item = {
        id: this.chiTietNhanHang.serial.id,
        ten: this.chiTietNhanHang.serial.serial + '-' + this.modelSelect.ten,
        solg: this.chiTietNhanHang.soluong,
        ghi_chu: this.chiTietNhanHang.ghi_chu
      };
      this.lenhNhanHang.chi_tiet.push(item);
    }
  }

  convertDocx() {
    const printContents = document.getElementById('order-print').innerHTML;
    this.printContent = `
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
    const converted = HtmlDocx.asBlob(this.printContent);
    console.log(converted);
    const d = new Date();
    const stringName = 'lenh_nhan_hang_' + d.getFullYear() + '-' + ( d.getMonth() + 1 ) + '-' + d.getDate() + '-' + d.getHours() + '.docx';
    fileSaver.saveAs( converted, stringName);
  }
}
