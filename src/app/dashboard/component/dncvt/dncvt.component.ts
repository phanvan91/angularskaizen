import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LinhKienService} from '../../../shared/linh-kien.service';
import {KhoService} from '../../../shared/kho.service';
import {PhieuDeNghiService} from '../../../shared/phieu-de-nghi.service';
import {Location} from '@angular/common';
import {DateService} from '../../../shared/date.service';
import {environment} from '../../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import {CongViecService} from "../../../shared/cong-viec.service";
import {UserService} from "../../../shared/user.service";

@Component({
  selector: 'app-dncvt',
  templateUrl: './dncvt.component.html',
  styleUrls: ['./dncvt.component.scss']
})

export class DncvtComponent implements OnInit {
    @Input() tram_id: Object;
    @Input() phieu_sua_chua_id: Object;
    @Input() de_nghi_id: Object;
    @Output() onNewItem = new EventEmitter<boolean>();
    @Output() onEditItem = new EventEmitter<boolean>();
    @Output() onDeNghiItem = new EventEmitter<boolean>();

    isInDisplayMode = true;
    linhKienXoaIndex = null;
    denghi;
    dateShow;
    lkKeyWord;
    alive = true;
    data_lk;
    data_lk_map;
    linhKienAdd: any;
    isCreateNew = false;
    ajaxOptions_lk;
    options_lk;
    me;
    isTramDuLK = true;
    status_phieu_de_nghi_lk = environment.status_phieu_de_nghi_lk;
    today = new Date();
    bsConfig = {
        showWeekNumbers: false,
        dateInputFormat: 'DD/MM/YYYY'
    };


    constructor(
        private linhKienService: LinhKienService,
        private khoService: KhoService,
        private phieuDeNghiCapVatTu: PhieuDeNghiService,
        private location: Location,
        private dateService: DateService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private userService: UserService,

    ) {
        if (!this.de_nghi_id) {
            this.activatedRoute.queryParams.subscribe(params => {
                this.de_nghi_id = params['id'];
            });
        }
    }

    ngOnInit() {
        this.userService.userInfo.takeWhile(() => this.alive).subscribe(res => {
            this.me = res;

        });
        this.linhKienAdd = {};
        let d = new Date();
        this.dateShow = {'date': d.getDate(), 'month': d.getMonth() + 1, 'year': d.getFullYear()};
        if (this.de_nghi_id) { //view
            this.isInDisplayMode = true;
            this.phieuDeNghiCapVatTu.getDetail(this.de_nghi_id).takeWhile(() => this.alive).subscribe((res: any) => {
                this.denghi = res;
                this.linhKienAdd.linh_kien_xac = this.linhKienAdd.linh_kien;
                //this.phieu_sua_chua_id =  this.denghi.phieu_sua_chua_id;

                this.checkDuTaiTram();

            });
        }else { //new
            this.denghi = {};
            this.denghi.phieu_sua_chua_id = this.phieu_sua_chua_id;
            this.denghi.created_at = new Date();
            if (this.tram_id > 0) {
                this.khoService.getKhoTotDetailByTramId(this.tram_id).takeWhile(() => this.alive).subscribe((res: any) => {
                    this.denghi.kho_tram = res;
                });
            }else {
                this.khoService.khoSelected.takeWhile(() => this.alive).subscribe((res: any ) => {
                    if (res.length) {
                        this.denghi.kho_tram = res.find( x => x.loai_kho === environment.loai_kho.kho_tot);
                    }
                });
            }
            this.isInDisplayMode = false;
            this.isCreateNew = true;
        }

        this.ajaxOptions_lk = {
            url: this.linhKienService.searchUrl,
            dataType: 'json',
            delay: 250,
            cache: false,
            data: (params: any) => {
                if (this.denghi.kho_tram) {
                    return {
                        key_word: params.term,
                        kho_id: this.denghi.kho_tram.id
                    };
                }
            },
            processResults: (res: any, params: any) => {
                this.data_lk = [];
                this.data_lk_map = new Object();
                if (res.length > 0) {
                    for (let i = 0; i < res.length; i++) {
                        this.data_lk_map[res[i].id] = res[i];
                    }
                }
                return {
                    results: $.map(res, function (obj) {
                        // console.log('data', obj);
                        return { id: obj.id, text: obj.ma + '-' + obj.ten };
                    })
                };
            },
        };

        this.options_lk = {
            ajax: this.ajaxOptions_lk,
            placeholder: 'Tìm kiếm',
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

    getDayMonth(date) {
        return this.dateService.getDayMonth(date);
    }

    checkDuTaiTram() {
        if (this.denghi.trang_thai === 1) {
            let lk;
            this.isTramDuLK = true;
            for (let i = 0; i < this.denghi.linh_kiens.length; i++) {
                lk = this.denghi.linh_kiens[i];
                if (lk.so_luong > lk.ton_tram) {
                    this.isTramDuLK = false;
                    break;
                }
            }
        }
    }

    themLinhKien() {
        if (this.linhKienAdd.linh_kien && this.denghi.thoi_han_can_vat_tu) {
            this.linhKienAdd.linh_kien_id = this.linhKienAdd.linh_kien.id;
            this.denghi.linh_kiens = this.denghi.linh_kiens ? this.denghi.linh_kiens : [];
            let linhkien;
            for ( let i = 0; i < this.denghi.linh_kiens.length; i++) {
                linhkien = this.denghi.linh_kiens[i];
                if (linhkien.linh_kien.id === this.linhKienAdd.linh_kien.id) {
                    return;
                }
            }
            this.denghi.linh_kiens.push(Object.assign({}, this.linhKienAdd));
            this.checkDuTaiTram();
        } else {
            if (!this.denghi.thoi_han_can_vat_tu) {
                alert('Vui lòng nhập thời hạn cần vật tư!');
            }
        }
    }

    onChangeSoLuongThuc(index, newValue) {
        const lk = this.denghi.linh_kiens[index];
        lk.so_luong = newValue.target.value.replace(/,/g, '' );
    }

    onChangeSoLuongGuiTrungTam(index, newValue) {
        const lk = this.denghi.linh_kiens[index];
        lk.so_luong_gui_trung_tam = newValue.target.value.replace(/,/g, '' );
    }

    changeLinhKien(value: any) {
        this.linhKienAdd.linh_kien = this.data_lk_map[value.value];
        this.linhKienAdd.linh_kien_xac = this.linhKienAdd.linh_kien;
        this.linhKienAdd.don_gia = this.linhKienAdd.linh_kien.gia_ban ? this.linhKienAdd.linh_kien.gia_ban : 0;
        this.linhKienAdd.so_luong = 1;
        this.linhKienAdd.ton = this.linhKienAdd.linh_kien.ton_cuoi ? this.linhKienAdd.linh_kien.ton_cuoi : 0;
    }

    changeLinhKienXac(value: any) {
        this.linhKienAdd.linh_kien_xac = this.data_lk_map[value.id];
    }

    onEditClick() {
        this.isInDisplayMode = false;
    }

    validateDocument() {
        if (!this.denghi.linh_kiens || this.denghi.linh_kiens.length === 0) {
            alert('Phải chọn ít nhất một linh kiện!');
            return false;
        }

        if (!this.denghi.thoi_han_can_vat_tu) {
            alert('Chọn thời hạn cần vật tư!');
            return false;
        }

        return true;
    }

    onSaveClick() {
        if (this.denghi.linh_kiens.length > 0) {
            if (!this.denghi.kho_tram.tram_bao_hanh_id) {
                alert('Vui lòng chọn kho trạm');
                return;
            }
            if (!this.denghi.ly_do && !this.denghi.phieu_sua_chua_id) {
                alert('Vui lòng nhập lý do!');
                return ;
            }

            if (!this.denghi.id) {
                this.phieuDeNghiCapVatTu.create({'data': this.getDataToUpload()}).takeWhile(() => this.alive).subscribe((res: any) => {
                    this.de_nghi_id = res;
                    this.onDeNghiItem.next(res);
                    this.isInDisplayMode = true;
                    this.phieuDeNghiCapVatTu.getDetail(this.de_nghi_id).takeWhile(() => this.alive).subscribe((res: any) => {
                        this.denghi = res;
                        this.denghi.thoi_han_can_vat_tu = this.dateService.getDateFromString(this.denghi.thoi_han_can_vat_tu);
                        this.denghi.created_at = new Date(this.denghi.created_at);
                    });
                    this.close();
                });
            }else {
                this.phieuDeNghiCapVatTu.update({'data': this.getDataToUpload()}).takeWhile(() => this.alive).subscribe((res: any) => {
                    this.isInDisplayMode = true;
                    this.de_nghi_id = res;
                    if (!this.phieu_sua_chua_id) {
                        this.onDeNghiItem.next(res);
                    }
                    this.close();
                });
            }
            if (this.denghi.trang_thai === environment.trang_thai_phieu_dncvt.gui_trung_tam) {
                const data: any = {};

                if (this.me.loai_nguoi_dung_id === 5) {
                    data.phieu_de_nghi_id = this.de_nghi_id;
                    data.loai_cong_viec = 4;
                    data.trang_thai = 5;
                    data.user_id = this.me.id;
                    this.phieuDeNghiCapVatTu.xacnhanDNLK(data).takeWhile(() => this.alive).subscribe((resDNLK: any) => {
                        console.log(resDNLK);
                    });
                }
            }


        }else {
            alert('Vui lòng nhập linh kiện yêu cầu!');
        }
    }

    close() {
        if (!this.phieu_sua_chua_id) {
            this.location.back();
        }else {
            (<any>$('#add_edit_lk')).modal('hide');
        }
    }

    onXoaLinhKienClick(index) {
        this.linhKienXoaIndex = index;
    }

    xoaLinhKien(index) {
        if (index != null) {
            this.denghi.linh_kiens.splice(this.linhKienXoaIndex, 1);
        }
        this.linhKienXoaIndex = null;
        this.checkDuTaiTram();
    }

    onRejectClick() {
        this.changeTrangThai(environment.trang_thai_phieu_dncvt.tu_choi);
    }

    onDeNghiClick() {
        this.denghi.trang_thai = environment.trang_thai_phieu_dncvt.de_nghi;
        this.onSaveClick();
    }

    onChuyenToiTrungTamClick() {
        this.denghi.trang_thai = environment.trang_thai_phieu_dncvt.gui_trung_tam;
        this.isInDisplayMode = false;
        let lk;
        for (let i = 0; i < this.denghi.linh_kiens.length; i++) {
            lk = this.denghi.linh_kiens[i];
            lk.so_luong_gui_trung_tam = (lk.ton_tram >= lk.so_luong) ? 0 : lk.so_luong - lk.ton_tram;
        }





        alert('Vui lòng nhập số lượng và chọn nút Lưu lại để hoàn tất!');
    }

    openPhieuSuaChua() {
        this.router.navigateByUrl('/dashboard/tao-phieu-sua-chua?id=' + this.denghi.phieu_sua_chua_id);
    }

    onTaoPhieuChuyenKho() {
        //open phieu chuyen kho
        this.router.navigateByUrl('/dashboard/removal?phieu_de_nghi=' + this.denghi.id);
    }

    onTaoPhieuXuatKhoTrungTam() {
        this.router.navigateByUrl('/dashboard/issue?phieu_de_nghi=' + this.denghi.id);
    }

    onTaoPhieuXuatKho() {
        this.phieuDeNghiCapVatTu.taoPhieuXuatKho(this.de_nghi_id).takeWhile(() => this.alive).subscribe((res: any) => {
            if (!this.phieu_sua_chua_id) {
                this.onEditItem.next(res);
            }
            this.close();
        });
    }

    changeTrangThai (trang_thai) {
        this.phieuDeNghiCapVatTu.changeTrangThai(trang_thai, this.de_nghi_id).takeWhile(() => this.alive).subscribe((res: any) => {
            if (!this.phieu_sua_chua_id) {
                this.onEditItem.next(res);
            }
            this.close();
        });
    }

    changeKho(value: any) {
      this.denghi.kho_de_nghi = value;
      this.denghi.kho_de_nghi_id = value.id;
    }

    searchLinhKien(keyword) {
        this.getDanhSachLinkien(keyword);
    }


    getDataToUpload() {
        const data: any = {};
        data.id = this.denghi.id;
        data.phieu_sua_chua_id = this.denghi.phieu_sua_chua_id;
        data.trang_thai = this.denghi.trang_thai;
        data.thoi_han_can_vat_tu = this.dateService.getDateString(
            this.denghi.thoi_han_can_vat_tu);
        data.kho_tram_id = this.denghi.kho_tram.id;
        data.ly_do = this.denghi.ly_do;
        let lk;
        data.linh_kiens = [];
        for (let i = 0; i < this.denghi.linh_kiens.length; i++) {
            lk = {};
            lk.id = this.denghi.linh_kiens[i].id;
            lk.linh_kien_id = this.denghi.linh_kiens[i].linh_kien_id;
            lk.so_luong = this.denghi.linh_kiens[i].so_luong;
            lk.so_luong_gui_trung_tam = this.denghi.linh_kiens[i].so_luong_gui_trung_tam;
            lk.don_gia = this.denghi.linh_kiens[i].don_gia;
            data.linh_kiens.push(lk);
        }
        return data;
    }

    getDanhSachLinkien(keyWord) {
        if (this.lkKeyWord !== keyWord) {
            this.lkKeyWord = keyWord;
            this.linhKienService.search(keyWord, this.tram_id, true).takeWhile(() => this.alive).subscribe((res: any) => {
                this.data_lk = [];
                this.data_lk_map = new Object();
                if (res.length > 0) {
                    for (let i = 0; i < res.length; i++) {
                        this.data_lk_map[res[i].id] = res[i];
                        this.data_lk.push({'id': res[i].id, 'text': res[i].ten});
                    }
                }
            });
        }
    }

    onPrintOrder() {
        let printContents, popupWin;
        printContents = document.getElementById('order-print').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
              <html>
                <head>
                    <style>
                      table{width: 100%;border-collapse: collapse; margin: 20px 0px;}
                      td, th{border: 1px solid #aaa; padding: 5px;}
                      .order-header .title{font-size: 20px; font-weight: bold}
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
              </html>`
        );
        popupWin.document.close();
    }
}
