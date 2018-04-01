import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {SoHieuChungTuService} from '../../../shared/so-hieu-chung-tu.service';
import {DoiTuongPhapNhanService} from '../../../shared/doi-tuong-phap-nhan.service';
import {KhoService} from '../../../shared/kho.service';
import {LinhKienService} from '../../../shared/linh-kien.service';
import {ChungTuService} from '../../../shared/chung-tu.service';
import {environment} from '../../../../environments/environment';
import {AccountantService} from '../../../shared/accountant.service';
import {DonDatHangService} from '../../../shared/don-dat-hang.service';
import {DateService} from '../../../shared/date.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PhieuDeNghiService} from '../../../shared/phieu-de-nghi.service';

@Component({
  selector: 'app-removal',
  templateUrl: './removal.component.html',
  styleUrls: ['./removal.component.scss']
})

export class RemovalComponent implements OnInit, OnDestroy {
    @Input() loai_kho: any;

    chungTuId;
    data_ct = [];
    data_lk;
    data_lk_map;
    kho_map;
    issue: any = {};
    linhKienXoaIndex;
    linhKienAdd: any = {};
    alive = true;
    loaiKho;
    isInDisplayMode = false;
    allowEdit = true;
    lkKeyWord = null;
    ajaxOptions_dtpn;
    options_dtpn;
    options_dskt;
    ajaxOptions_dskt;
    ajaxOptions_ddh;
    options_ddh;
    ajaxOptions_tkkt;
    options_tkkt;
    ajaxOptions_lk;
    options_lk;
    loai_ct;
    today;
    isXacNhanNhanHang = false;
    deNghiCapVatTuId;
    bsConfig = {
        showWeekNumbers: false,
        dateInputFormat: 'DD/MM/YYYY'
    };

    constructor(private soHieuChungTuService: SoHieuChungTuService,
                private doiTuongPhapNhanService: DoiTuongPhapNhanService,
                private khoService: KhoService,
                private linhKienService: LinhKienService,
                private chungTuService: ChungTuService,
                private taiKhoanService: AccountantService,
                private dateService: DateService,
                private donDatHangService: DonDatHangService,
                private location: Location,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private phieuDeNghiCapVatTu: PhieuDeNghiService
    ) {
        this.activatedRoute.queryParams.subscribe(params => {
            this.chungTuId = params['id'];
            this.deNghiCapVatTuId = params['phieu_de_nghi'];
            if (!this.loai_kho) {
                this.loai_kho = params['loai_kho'] ? params['loai_kho'] : environment.loai_kho.kho_tot;
            }
        });
    }

    ngOnInit() {
        this.initDefaultData();
        this.initSelect2();
        this.getData();
    }

    ngOnDestroy(): void {
        this.alive = false;
    }

    initDefaultData() {
        this.today = new Date();
        this.loai_ct = environment.loai_chung_tu.phieu_xuat_kho;
    }

    initSelect2() {
        this.soHieuChungTuService.getByType(this.loai_ct, this.loai_kho).takeWhile(() => this.alive).subscribe((res: any ) => {
            if (res) {
                this.data_ct = res;
            }
        });

        this.ajaxOptions_dtpn = {
            url: this.doiTuongPhapNhanService.searchDoiTuongPhapNhanUrl,
            dataType: 'json',
            delay: 250,
            cache: false,
            data: (params: any) => {
                if (params.term) {
                    if (params.term.length >= 3) {
                        return {
                            key_word: params.term,
                        };
                    }
                }
            },
            processResults: (res: any, params: any) => {
                return {
                    results: $.map(res, function (obj) {
                        // console.log('data', obj);
                        return { id: obj.id, text: obj.ma + '-' + obj.ten };
                    })
                };
            },
        };

        this.options_dtpn = {
            ajax: this.ajaxOptions_dtpn,
            placeholder: 'Tìm kiếm',
            language: {
                noResults: function(){
                    return '<a data-toggle="modal" data-target="#add_legal"> ' +
                           '<i class="fa fa-plus-square" aria-hidden="true"></i> Thêm mới</a>';
                }
            },
            escapeMarkup: function (markup) {
                return markup;
            }
        };

        this.ajaxOptions_ddh = {
            url: this.donDatHangService.searchDonDatHangUrl,
            dataType: 'json',
            delay: 250,
            cache: false,
            data: (params: any) => {
                if (params.term) {
                    if (params.term.length >= 3) {
                        return {
                            key_word: params.term
                        };
                    }
                }
            },
            processResults: (res: any, params: any) => {
                return {
                    results: $.map(res, function (obj) {
                        return { id: obj.id, text: obj.so_ct };
                    })
                };
            },
        };

        this.options_ddh = {
            ajax: this.ajaxOptions_ddh,
            placeholder: 'Tìm kiếm đơn đặt hàng',
            language: {
                noResults: function(){
                    return 'Không tồn tại';
                }
            },
            escapeMarkup: function (markup) {
                return markup;
            }
        };

        this.ajaxOptions_tkkt = {
            url: this.taiKhoanService.searchAccountantUrl,
            dataType: 'json',
            delay: 250,
            cache: false,
            data: (params: any) => {
                if (params.term) {
                    return {
                        key_word: params.term
                    };
                }
            },
            processResults: (res: any, params: any) => {
                return {
                    results: $.map(res, function (obj) {
                        return { id: obj.id, text: obj.so_hieu_tai_khoang };
                    })
                };
            },
        };

        this.options_tkkt = {
            ajax: this.ajaxOptions_tkkt,
            placeholder: 'Tìm kiếm',
            language: {
                noResults: function(){
                    return '<a data-toggle="modal" data-target="#add_accountant"> ' +
                        '<i class="fa fa-plus-square" aria-hidden="true"></i> Thêm mới</a>';
                }
            },
            escapeMarkup: function (markup) {
                return markup;
            }
        };

        this.ajaxOptions_dskt = {
            url: this.khoService.getKhoTramByTrungTamUrl,
            dataType: 'json',
            delay: 250,
            cache: false,
            data: (params: any) => {
                return {
                    key_word: params.term,
                    trung_tam_id: this.issue.kho_xuat.trung_tam_bao_hanh_id,
                    loai_kho: this.issue.kho_xuat.loai_kho,
                    except_kho_id: this.issue.kho_xuat.id
                };
            },
            processResults: (res: any, params: any) => {
                this.kho_map = new Object();
                if (res.length > 0) {
                    for (let i = 0; i < res.length; i++) {
                        this.kho_map[res[i].id] = res[i];
                    }
                }
                return {
                    results: $.map(res, function (obj) {
                        return { id: obj.id, text: obj.ten_kho };
                    })
                };
            },
        };

        this.options_dskt = {
            ajax: this.ajaxOptions_dskt,
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

        this.ajaxOptions_lk = {
            url: this.linhKienService.searchUrl,
            dataType: 'json',
            delay: 250,
            cache: false,
            data: (params: any) => {
                return {
                    key_word: params.term,
                    kho_id: this.issue.kho_xuat.id
                };
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

    getData() {
        this.loaiKho = environment.loai_kho.kho_tot;
        this.linhKienAdd.so_luong_thuc = 1;
        this.linhKienAdd.so_luong_yc = 1;
        if (!this.chungTuId) {
            this.issue = {};
            this.createNew();

            if (this.deNghiCapVatTuId) {
                this.issue.phieu_de_nghi_id = this.deNghiCapVatTuId;
                this.phieuDeNghiCapVatTu.getDetail(this.deNghiCapVatTuId).takeWhile(() => this.alive).subscribe((res: any) => {
                    this.issue.phieu_sua_chua_id =  res.phieu_sua_chua_id;
                    this.issue.phieu_de_nghi_id = res.id;
                    this.issue.so_ct_goc = res.id;
                    this.issue.ngay_ct_goc = this.dateService.getDateFromString(res.created_at);
                    this.issue.kho_xuat = res.kho_trung_tam;
                    this.issue.kho_nhap = res.kho_tram;

                    this.issue.kho_xuat_id = this.issue.kho_xuat.id;
                    this.issue.kho_nhap_id = this.issue.kho_nhap.id;
                    this.issue.cong_ty_id = this.issue.kho_xuat.cong_ty_id;

                    let lk;
                    this.issue.linh_kiens = [];
                    this.issue.tong_so_tien_truoc_thue = 0;
                    for (let i = 0; i < res.linh_kiens.length; i++) {
                        lk = res.linh_kiens[i];
                        lk.id = null;
                        lk.so_luong_yc = lk.so_luong_gui_trung_tam;
                        lk.so_luong_thuc = lk.so_luong_gui_trung_tam;
                        lk.linh_kien.ton_cuoi = lk.ton_trung_tam;
                        this.issue.tong_so_tien_truoc_thue += lk.so_luong_thuc * lk.don_gia;
                        this.issue.linh_kiens.push(Object.assign({}, lk));
                    }
                });
            }else {
                this.khoService.khoSelected.takeWhile(() => this.alive).subscribe((res: any ) => {
                    if (res.length) {
                        this.issue.kho_xuat = res.find( x => x.loai_kho === environment.loai_kho.kho_tot);
                        if (this.issue.kho_xuat) {
                            this.issue.kho_xuat_id = this.issue.kho_xuat.id;
                            this.issue.kho_nhap_id = this.issue.kho_nhap.id;
                            this.issue.cong_ty_id = this.issue.kho_xuat.cong_ty_id;
                        }
                    }
                });
            }
        }else {
            this.isInDisplayMode = true;
            this.chungTuService.getCTTotDetail(this.chungTuId, (this.loai_kho == environment.loai_kho.kho_tot)).takeWhile(() => this.alive).subscribe((res: any) => {
                this.issue = res;
                if (this.issue) {
                    this.issue.ngay_ct = this.dateService.getDateFromString(this.issue.ngay_ct);
                    if (this.issue.ngay_ct_goc) {
                        this.issue.ngay_ct_goc = this.dateService.getDateFromString(this.issue.ngay_ct_goc);
                    }
                    if (this.issue.tk_co) {
                        this.issue.tk_co.text = this.issue.tk_co.so_hieu_tai_khoang;
                    }

                    if (this.issue.tk_no) {
                        this.issue.tk_no.text = this.issue.tk_no.so_hieu_tai_khoang;
                    }

                    if (this.issue.doi_tuong_no) {
                        this.issue.doi_tuong_no.text = this.issue.doi_tuong_no.ma + '-' + this.issue.doi_tuong_no.ten;
                    }

                    if (this.issue.doi_tuong_co) {
                        this.issue.doi_tuong_co.text = this.issue.doi_tuong_co.ma + '-' + this.issue.doi_tuong_co.ten;
                    }

                    const temps = [];
                    for (let i = 0; i < this.issue.linh_kiens.length; i++) {
                        if (this.issue.linh_kiens[i].kho_id === this.issue.kho_xuat_id) {
                            temps.push(this.issue.linh_kiens[i]);
                        }
                    }
                    this.issue.linh_kiens = temps;

                }else {
                    alert('Tài liệu không tồn tại!');
                    this.location.back();
                }
            });
        }
    }

    createNew() {
        this.issue.ngay_ct = new Date();
        this.issue.phan_tram_thue = 10;
        this.issue.tong_so_tien_truoc_thue = 0;
    }

    getDanhSachLinkien(keyWord) {
        if (this.lkKeyWord !== keyWord) {
            this.lkKeyWord = keyWord;
            this.linhKienService.search(keyWord, this.issue.kho_xuat.id, true).takeWhile(() => this.alive).subscribe((res: any) => {
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


    changeLinhKien(value: any) {
        this.linhKienAdd.linh_kien = this.data_lk_map[value.value];
        this.linhKienAdd.don_gia = this.linhKienAdd.linh_kien.gia_ban;
        if (!this.dateService.isEqual(this.issue.ngay_ct, this.today)) {
            this.linhKienAdd.linh_kien.ton_cuoi = 0;
            this.chungTuService.getTonKhoLK(this.issue.kho_xuat.id,
                this.linhKienAdd.linh_kien.id, this.dateService.
                getDateString(this.issue.ngay_ct)).takeWhile(() => this.alive).subscribe((res: any) => {
                if (res) {
                    this.linhKienAdd.linh_kien.ton_cuoi = res.ton_cuoi_ky;
                }
            });
        }
    }

    openPhieuSuaChua(id){
        this.router.navigateByUrl('/dashboard/tao-phieu-sua-chua?id='+ id.toString());
    }

    openPhieuDeNghi(id){
        this.router.navigateByUrl('/dashboard/don-de-nghi-cap-vat-tu?id='+ id.toString());
    }

    getDayMonth(date) {
        return this.dateService.getDayMonth(date);
    }

    getTwoNumber(so_ct) {
        return this.dateService.getTwoNumber(so_ct);
    }

    byId(value1, value2) {
        if (value1 && value2) {
            return value1.id === value2.id;
        } else {
            return false;
        }
    }

    changeLoaiChungTu(value) {
        this.issue.loai_chung_tu = value;
        this.soHieuChungTuService.getDetail(value.id).takeWhile(() => this.alive).subscribe((res: any) => {
            this.issue.tk_no = res.tai_khoan_no;
            this.issue.tk_no.text = this.issue.tk_no.so_hieu_tai_khoang;
            this.issue.tk_co = res.tai_khoan_co;
            this.issue.tk_co.text = res.tai_khoan_co.so_hieu_tai_khoang;
            this.issue.tk_co_id = this.issue.tk_co.id;
            this.issue.tk_no_id = this.issue.tk_no.id;
        });
    }

    changeKhoNhap(value) {
        this.issue.kho_nhap = this.kho_map[value.value];
        this.issue.kho_nhap_id = this.issue.kho_nhap.id;
    }

    changeTaiKhoanNo(value) {
        this.issue.tk_no = value;
        this.issue.tk_no_id = value.value;
    }

    changeTaiKhoanCo(value) {
        this.issue.tk_co = value;
        this.issue.tk_co_id = value.value;
    }

    changeDoiTuongCo(value) {
        this.issue.doi_tuong_co = value;
        this.issue.doi_tuong_co_id = value.value;
    }

    changeDoiTuongNo(value) {
        this.issue.doi_tuong_no = value;
        this.issue.doi_tuong_no_id = value.value;
    }

    onChangeSoLuongThuc(index, newValue) {
        const lk = this.issue.linh_kiens[index];
        const value = newValue.target.value.replace(/,/g, '' );
        if (lk.so_luong_thuc !== value) {
            this.issue.tong_so_tien_truoc_thue -= lk.don_gia * lk.so_luong_thuc;
            lk.so_luong_thuc = value;
            this.issue.tong_so_tien_truoc_thue += lk.don_gia * lk.so_luong_thuc;
        }
    }

    searchLinhKien(keyword) {
        this.getDanhSachLinkien(keyword);
    }

    themLinhKien() {
        if (this.linhKienAdd.linh_kien) {
            let linhkien;
            this.linhKienAdd.linh_kien_id = this.linhKienAdd.linh_kien.id;
            this.issue.tong_so_tien_truoc_thue += this.linhKienAdd.don_gia * this.linhKienAdd.so_luong_thuc;
            this.issue.linh_kiens = this.issue.linh_kiens ? this.issue.linh_kiens : [];
            for ( let i = 0; i < this.issue.linh_kiens.length; i++) {
                linhkien = this.issue.linh_kiens[i];
                if (linhkien.linh_kien.id === this.linhKienAdd.linh_kien.id) {
                    //linhkien.don_gia = this.linhKienAdd.don_gia;
                    //linhkien.so_luong_yc += this.linhKienAdd.so_luong_yc;
                    //linhkien.so_luong_thuc += this.linhKienAdd.so_luong_thuc;
                    return;
                }
            }
            linhkien = {};
            this.issue.linh_kiens.push(Object.assign({}, this.linhKienAdd));
        }
    }

    onXoaLinhKienClick(index) {
        this.linhKienXoaIndex = index;
    }

    xoaLinhKien() {
        (<any>$('#delete_linh_kien')).modal('hide');
        this.issue.tong -= this.issue.linh_kiens[this.linhKienXoaIndex].don_gia * this.issue.linh_kiens[this.linhKienXoaIndex].so_luong_thuc;
        this.issue.linh_kiens.splice(this.linhKienXoaIndex, 1);
    }

    deleteReceipt() {
        this.chungTuService.delete({'chung_tu_id' : this.issue.id,
            'kho_nhap_id': this.issue.kho_nhap_id, 'kho_xuat_id': this.issue.kho_xuat_id})
            .takeWhile(() => this.alive).subscribe((res: any) => {
            (<any>$('#delete_receipt')).modal('hide');
            this.router.navigateByUrl('/dashboard/removals');
        });
    }

    validateDocument() {
        if (!this.issue.linh_kiens || this.issue.linh_kiens.length === 0) {
            return false;
        }

        if (!this.issue.kho_xuat_id) {
            return false;
        }

        if (!this.issue.kho_nhap_id) {
            return false;
        }

        /*if (!this.issue.so_ct) {
            return false;
        }*/
        return true;
    }

    getDocumentData() {
        const data: any = {};

        data.id = this.issue.id;
        data.cong_ty_id = this.issue.cong_ty_id;
        data.phieu_sua_chua_id = this.issue.phieu_sua_chua_id;
        data.phieu_de_nghi_id = this.issue.phieu_de_nghi_id;
        data.tk_no_id = this.issue.tk_no_id;
        data.tk_co_id = this.issue.tk_co_id;
        data.doi_tuong_no_id = this.issue.doi_tuong_no_id;
        data.doi_tuong_co_id = this.issue.doi_tuong_co_id;
        data.loai_ct = environment.loai_chung_tu.phieu_chuyen_kho;
        data.ngay_ct = this.dateService.getDateString(this.issue.ngay_ct);
        data.so_ct = this.issue.so_ct;
        data.ma_ct_id = this.issue.ma_ct_id;
        data.don_dat_hang_id = this.issue.don_dat_hang_id;
        data.ten_nguoi_nhan = this.issue.ten_nguoi_nhan;
        data.dia_chi = this.issue.dia_chi;
        data.so_dt = this.issue.so_dt;
        data.kho_nhap_id = this.issue.kho_nhap_id;
        data.kho_xuat_id = this.issue.kho_xuat_id;
        data.tong_so_tien_truoc_thue = this.issue.tong_so_tien_truoc_thue;
        data.phan_tram_thue = this.issue.phan_tram_thue;
        data.so_ct_goc_kem = this.issue.so_ct_goc_kem;
        data.linh_kiens = [];
        data.xac_nhan_nhan_hang = false;
        if (this.isXacNhanNhanHang) {
            data.ngay_nhan = this.dateService.getDateString(new Date());
            data.xac_nhan_nhan_hang = true;
        }

        let lk;
        for (let i = 0; i < this.issue.linh_kiens.length; i++) {
            lk = this.issue.linh_kiens[i];
            data.linh_kiens.push({'id': lk.id, 'linh_kien_id': lk.linh_kien_id,
                'so_luong_yc': lk.so_luong_yc,
                'so_luong_thuc': lk.so_luong_thuc,
                'so_luong_nhan': lk.so_luong_nhan,
                'loai_giao_dich': environment.loai_giao_dich.xuat,
                'loai_ct': environment.loai_chung_tu.phieu_chuyen_kho,
                'don_gia' : lk.don_gia,
                'ghi_chu': lk.ghi_chu,
                'ngay_ct': data.ngay_ct});
        }
        return {'data': data };
    }

    onEditClick() {
        this.isInDisplayMode = false;
    }

    onNhanHangClick() {
        this.isInDisplayMode = false;
        let lk;
        for (let i = 0; i < this.issue.linh_kiens.length; i++) {
            lk = this.issue.linh_kiens[i];
            lk.so_luong_nhan = lk.so_luong_thuc;
        }
        this.isXacNhanNhanHang = true;
        alert('Vui lòng xác nhận lại số lượng nhận và ấn nút Lưu lại!');
    }

    onSaveClick() {
        if (this.validateDocument()) {
            this.issue.ma_ct_id = this.issue.loai_chung_tu ? this.issue.loai_chung_tu.id : null;

            if (this.issue.id) {
                //edit
                this.chungTuService.update_ct_kho_tot(this.getDocumentData()).subscribe((res: any) => {
                    if (!res.error) {
                        this.location.back();
                    }
                });
            }else {
                //add new
                this.chungTuService.create_ct_kho_tot(this.getDocumentData()).subscribe((res: any) => {
                    if (!res.error) {
                        this.location.back();
                    }
                });
            }
        }else {
            alert('please input to (*) field');
        }
    }

    close() {
        this.location.back();
    }

    print() {
        let printContents, popupWin;
        printContents = document.getElementById('receipt-print').innerHTML;
        popupWin = window.open('', '_blank', '');
        popupWin.document.open();
        popupWin.document.write(`<link rel='stylesheet' media='print' type='text/css' href='https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css'/>`);
        popupWin.document.write(`
          <html>
            <head>
            <style>
            #add-issue{
              text-align: center;
              margin-top: 5%;
            }
            .border-top-none{
              border-top: 0;
            }
            
            label{
              font-weight: bold;
            }
            #width-300{
              width: 300px;
            }
            #table-issue th{
              text-align: center;
            }
            #full-width{
              width: 100%;
            }
            .payment-info label{
              width:46%;
            }
            .intro label{
              width: 20%;
            }
            .issue-title{
              text-align: center;
            }
            .content {
              width: 100%;
            }
            .pagination{
              float: right;
            }
            .app-227{
              margin: 2%;
            }
            .issue-content .logo a:hover {
              text-decoration: none;
              color: #7793C4;
            }
            .border-colspan{
              border-left: 2px solid #dee2e6;
              border-right: 2px solid #dee2e6;
            
            }
            .top-headers th{
              border-left: 2px solid #dee2e6;
              border-right: 2px solid #dee2e6;
            
            }
            table#table-issue * {
              border-bottom: 0;
            }
            #table-issue td{
              border: 2px solid #dee2e6;
            
            }
            .issue-content .invoice-wrapper {
              background: #FFF;
              border: 1px solid #CDD3E2;
              box-shadow: 0px 0px 1px #CCC;
              padding: 40px 40px 60px;
              margin-top: 40px;
              border-radius: 4px;
            }
            
            .issue-content .invoice-wrapper .payment-details span {
              display: block;
            }
            .issue-content .invoice-wrapper .payment-details a {
              display: inline-block;
              margin-top: 5px;
            }
            
            .issue-content .invoice-wrapper .line-items .print a {
              display: inline-block;
              border: 1px solid #9CB5D6;
              padding: 13px 13px;
              border-radius: 5px;
              color: #708DC0;
              font-size: 13px;
              -webkit-transition: all 0.2s linear;
              -moz-transition: all 0.2s linear;
              -ms-transition: all 0.2s linear;
              -o-transition: all 0.2s linear;
              transition: all 0.2s linear;
            }
            
            .issue-content .invoice-wrapper .line-items .print a:hover {
              text-decoration: none;
              border-color: #333;
              color: #333;
            }
            @media (min-width: 1200px) {
              .issue-content .container {width: 900px; }
            }
            
            .issue-content .logo {
              text-align: center;
              margin-top: 50px;
            }
            
            .issue-content .logo a {
              font-family: Myriad Pro, Lato, Helvetica Neue, Arial;
              font-size: 36px;
              letter-spacing: .1px;
              color: #555;
              font-weight: 300;
              -webkit-transition: all 0.2s linear;
              -moz-transition: all 0.2s linear;
              -ms-transition: all 0.2s linear;
              -o-transition: all 0.2s linear;
              transition: all 0.2s linear;
            }
            
            .issue-content .invoice-wrapper .intro {
              line-height: 25px;
              color: #444;
            }
            
            .issue-content .invoice-wrapper .payment-info {
              margin-top: 25px;
              padding-top: 15px;
            }
            
            
            
            .issue-content .invoice-wrapper .payment-info strong {
              display: block;
              color: #444;
              margin-top: 3px;
            }
            
            @media (max-width: 767px) {
              .issue-content .invoice-wrapper .payment-info .text-right {
                text-align: left;
                margin-top: 20px; }
            }
            .issue-content .invoice-wrapper .payment-details {
              border-top: 2px solid #EBECEE;
              margin-top: 30px;
              padding-top: 20px;
              line-height: 22px;
            }
            
            
            @media (max-width: 767px) {
              .issue-content .invoice-wrapper .payment-details .text-right {
                text-align: left;
                margin-top: 20px; }
            }
            .issue-content .invoice-wrapper .line-items {
              margin-top: 40px;
            }
            .issue-content .invoice-wrapper .line-items .headers {
              color: #A9B0BB;
              font-size: 13px;
              letter-spacing: .3px;
              border-bottom: 2px solid #EBECEE;
              padding-bottom: 4px;
            }
            .issue-content .invoice-wrapper .line-items .items {
              margin-top: 8px;
              border-bottom: 2px solid #EBECEE;
              padding-bottom: 8px;
            }
            .issue-content .invoice-wrapper .line-items .items .item {
              padding: 10px 0;
              color: #696969;
              font-size: 15px;
            }
            @media (max-width: 767px) {
              .issue-content .invoice-wrapper .line-items .items .item {
                font-size: 13px; }
            }
            .issue-content .invoice-wrapper .line-items .items .item .amount {
              letter-spacing: 0.1px;
              color: #84868A;
              font-size: 16px;
            }
            @media (max-width: 767px) {
              .issue-content .invoice-wrapper .line-items .items .item .amount {
                font-size: 13px; }
            }
            
            .issue-content .invoice-wrapper .line-items .total {
              margin-top: 30px;
            }
            
            .issue-content .invoice-wrapper .line-items .total .extra-notes {
              float: left;
              width: 40%;
              text-align: left;
              font-size: 13px;
              color: #7A7A7A;
              line-height: 20px;
            }
            
            @media (max-width: 767px) {
              .issue-content .invoice-wrapper .line-items .total .extra-notes {
                width: 100%;
                margin-bottom: 30px;
                float: none; }
            }
            
            .issue-content .invoice-wrapper .line-items .total .extra-notes strong {
              display: block;
              margin-bottom: 5px;
              color: #454545;
            }
            
            .issue-content .invoice-wrapper .line-items .total .field {
              margin-bottom: 7px;
              font-size: 14px;
              color: #555;
            }
            
            .issue-content .invoice-wrapper .line-items .total .field.grand-total {
              margin-top: 10px;
              font-size: 16px;
              font-weight: 500;
            }
            
            .issue-content .invoice-wrapper .line-items .total .field.grand-total span {
              color: #20A720;
              font-size: 16px;
            }
            
            .issue-content .invoice-wrapper .line-items .total .field span {
              display: inline-block;
              margin-left: 20px;
              min-width: 85px;
              color: #84868A;
              font-size: 15px;
            }
            
            .issue-content .invoice-wrapper .line-items .print {
              margin-top: 50px;
              text-align: center;
            }
            
            
            
            .issue-content .invoice-wrapper .line-items .print a i {
              margin-right: 3px;
              font-size: 14px;
            }
            
            .issue-content .footer {
              margin-top: 40px;
              margin-bottom: 110px;
              text-align: center;
              font-size: 12px;
              color: #969CAD;
            }
            .border-none{
              border: 0 !important;
            }
            .print {
              display: inline;
            }
            div#action-receip {
              text-align: center;
            }
            #close a{
              border: 1px solid red;
              color: red;
            }
            #save a{
              color: #5cb85c;
              border: 1px solid #5cb85c;
            
            }
            .p-bold{
              font-weight: bold;
            }
            p{
              margin: 0;
            }
            .table-print th{
              text-align: center;
              border-bottom: 0 !important;
            
            }
            .amts-right{
              text-align: right;
            }
            #last-row{
              margin-top: 2%;
            }
            div#issue-tk {
              text-align: right;
            }
            </style>
            </head>
            <body onload="window.print();window.close()">${printContents}</body>
          </html>`
        );
        popupWin.document.close();
    }
}
