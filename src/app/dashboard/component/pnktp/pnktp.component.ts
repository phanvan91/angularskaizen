import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
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

@Component({
    selector: 'app-pnktp',
    templateUrl: './pnktp.component.html',
    styleUrls: ['./pnktp.component.scss']
})

export class NktpComponent implements OnInit, OnDestroy {
    @Input() loai_kho: any;
    @Input() linh_kiens: Array<any>;
    @Output() onSaveDone = new EventEmitter<boolean>();

    chungTuId;
    data_ct = [];
    data_lk;
    data_lk_map;
    receipt: any = {};
    linhKienXoaIndex;
    linhKienAdd: any = {};
    alive = true;
    isInDisplayMode = false;
    allowEdit = true;
    lkKeyWord = null;
    ajaxOptions_dtpn;
    options_dtpn;
    ajaxOptions_ddh;
    options_ddh;
    ajaxOptions_tkkt;
    options_tkkt;
    ajaxOptions_lk;
    options_lk;
    loai_ct;
    today;
    bsConfig = {
        showWeekNumbers: false,
        dateInputFormat: 'DD/MM/YYYY'
    };
    loai_kho_temp;
    isKhoTot;

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
                private activatedRoute: ActivatedRoute
                ) {
        this.activatedRoute.queryParams.subscribe(params => {
            this.chungTuId = params['id'];
            this.loai_kho_temp = params['loai_kho'] ? params['loai_kho'] : environment.loai_kho.kho_tot;
        });
    }

    ngOnInit() {
        if (this.loai_kho == null) {
            this.loai_kho = this.loai_kho_temp;
        }
        this.isKhoTot = this.loai_kho === environment.loai_kho.kho_tot;

        this.initDefaultData();
        this.initSelect2();
        this.getData();
    }

    ngOnDestroy(): void {
        this.alive = false;
    }

    initDefaultData() {
        this.today = new Date();
        this.loai_ct = environment.loai_chung_tu.phieu_nhap_kho;
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

        this.ajaxOptions_lk = {
            url: this.linhKienService.searchUrl,
            dataType: 'json',
            delay: 250,
            cache: false,
            data: (params: any) => {
                /*if (params.term) {
                    if (params.term.length >= 3) {
                        return {
                            key_word: params.term,
                            // kho_id: this.tram_id
                        };
                    }
                }*/
                return {
                    key_word: params.term,
                    kho_id: this.receipt.kho_nhap.id
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
        this.linhKienAdd.so_luong_thuc = 1;
        this.linhKienAdd.so_luong_yc = 1;

        if (!this.chungTuId) {
            this.createNew();
            this.khoService.khoSelected.takeWhile(() => this.alive).subscribe((res: any ) => {
                if (res.length) {
                    this.receipt.kho_nhap = res.find( x => x.loai_kho === this.loai_kho);
                    if (this.receipt.kho_nhap) {
                        this.receipt.cong_ty_id = this.receipt.kho_nhap.cong_ty_id;
                        this.receipt.trung_tam_id = this.receipt.kho_nhap.trung_tam_bao_hanh_id;
                    }
                }
            });
        }else {
            this.isInDisplayMode = true;
            this.chungTuService.getCTTotDetail(this.chungTuId, this.isKhoTot).takeWhile(() => this.alive).subscribe((res: any) => {
                this.receipt = res;
                if (this.receipt) {
                    this.receipt.ngay_ct = this.dateService.getDateFromString(this.receipt.ngay_ct);
                    if (this.receipt.ngay_ct_goc) {
                        this.receipt.ngay_ct_goc = this.dateService.getDateFromString(this.receipt.ngay_ct_goc);
                    }

                    if (this.receipt.tk_co) {
                        this.receipt.tk_co.text = this.receipt.tk_co.so_hieu_tai_khoang;
                    }

                    if (this.receipt.tk_no) {
                        this.receipt.tk_no.text = this.receipt.tk_no.so_hieu_tai_khoang;
                    }

                    if (this.receipt.doi_tuong_no) {
                        this.receipt.doi_tuong_no.text = this.receipt.doi_tuong_no.ma + '-' + this.receipt.doi_tuong_no.ten;
                    }

                    if (this.receipt.doi_tuong_co) {
                        this.receipt.doi_tuong_co.text = this.receipt.doi_tuong_co.ma + '-' + this.receipt.doi_tuong_co.ten;
                    }

                }else {
                    alert('Tài liệu không tồn tại!');
                    this.location.back();
                }
            });
        }
    }

    createNew() {
        this.receipt.ngay_ct = new Date();
        this.receipt.phan_tram_thue = 10;
        this.receipt.tong_so_tien_truoc_thue = 0;
        this.receipt.linh_kiens = [];
        console.log(this.linh_kiens);
        if (this.linh_kiens) {
            let tempLk;
            for (let i = 0; i < this.linh_kiens.length; i++) {
                tempLk = {};
                tempLk.linh_kien = this.linh_kiens[i].linh_kien_thu_hoi;
                tempLk.linh_kien_id = this.linh_kiens[i].linh_kien_thu_hoi.id;
                tempLk.so_luong_yc = this.linh_kiens[i].so_luong_cap;
                tempLk.so_luong_thuc = this.linh_kiens[i].so_luong_thu;
                tempLk.no_id = this.linh_kiens[i].id;
                tempLk.don_gia = 0;
                this.receipt.linh_kiens.push(tempLk);
            }
        }
    }

    getDanhSachLinkien(keyWord) {
        if (this.lkKeyWord !== keyWord) {
            this.lkKeyWord = keyWord;
            this.linhKienService.search(keyWord, this.receipt.kho_nhap.id, this.isKhoTot).
            takeWhile(() => this.alive).subscribe((res: any) => {
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
        this.receipt.loai_chung_tu = value;
        this.soHieuChungTuService.getDetail(value.id).takeWhile(() => this.alive).subscribe((res: any) => {
            this.receipt.tk_no = res.tai_khoan_no;
            this.receipt.tk_no.text = this.receipt.tk_no.so_hieu_tai_khoang;
            this.receipt.tk_co = res.tai_khoan_co;
            this.receipt.tk_co.text = res.tai_khoan_co.so_hieu_tai_khoang;
            this.receipt.tk_co_id = this.receipt.tk_co.id;
            this.receipt.tk_no_id = this.receipt.tk_no.id;
        });
    }

    changeTaiKhoanNo(value) {
        this.receipt.tk_no = value;
        this.receipt.tk_no_id = value.value;
    }

    changeTaiKhoanCo(value) {
        this.receipt.tk_co = value;
        this.receipt.tk_co_id = value.value;
    }

    changeDoiTuongCo(value) {
        this.receipt.doi_tuong_co = value;
        this.receipt.doi_tuong_co_id = value.value;
    }

    changeDoiTuongNo(value) {
        this.receipt.doi_tuong_no = value;
        this.receipt.doi_tuong_no_id = value.value;
    }

    changeDonDatHang(value) {
        this.receipt.don_dat_hang = value;
        this.receipt.hoa_don_dat_hang_id = value.value;
        this.receipt.linh_kiens = [];
        this.donDatHangService.getDonDatHang(this.receipt.hoa_don_dat_hang_id).takeWhile(() => this.alive).subscribe((res: any) => {
            if (res && res.danh_sach_don_dat_hang_chi_tiet && res.danh_sach_don_dat_hang_chi_tiet.length > 0) {
                let lk;
                this.receipt.linh_kiens = [];
                this.receipt.tong_so_tien_truoc_thue = 0;
                for (let i = 0; i < res.danh_sach_don_dat_hang_chi_tiet.length; i++) {
                    lk = res.danh_sach_don_dat_hang_chi_tiet[i];
                    lk.id = null;
                    lk.so_luong_yc = lk.so_luong;
                    lk.so_luong_thuc = lk.so_luong;
                    lk.don_gia = lk.linh_kien.gia_ban;
                    this.receipt.tong_so_tien_truoc_thue += lk.so_luong_thuc * lk.linh_kien.gia_ban;
                    this.receipt.linh_kiens.push(Object.assign({}, lk));
                }
            }
        });
    }

    onChangeSoLuongThuc(index, newValue) {
        const lk = this.receipt.linh_kiens[index];
        const value = newValue.target.value.replace(/,/g, '' );
        if (lk.so_luong_thuc !== value) {
            this.receipt.tong_so_tien_truoc_thue -= lk.don_gia * lk.so_luong_thuc;
            lk.so_luong_thuc = value;
            this.receipt.tong_so_tien_truoc_thue += lk.don_gia * lk.so_luong_thuc;
        }
    }

    searchLinhKien(keyword) {
        this.getDanhSachLinkien(keyword);
    }

    themLinhKien() {
        if (this.linhKienAdd.linh_kien) {
            let linhkien;
            this.linhKienAdd.linh_kien_id = this.linhKienAdd.linh_kien.id;
            this.receipt.tong_so_tien_truoc_thue += this.linhKienAdd.don_gia * this.linhKienAdd.so_luong_thuc;
            this.receipt.linh_kiens = this.receipt.linh_kiens ? this.receipt.linh_kiens : [];
            for ( let i = 0; i < this.receipt.linh_kiens.length; i++) {
                linhkien = this.receipt.linh_kiens[i];
                if (linhkien.linh_kien.id === this.linhKienAdd.linh_kien.id) {
                    // linhkien.don_gia = this.linhKienAdd.don_gia;
                    // linhkien.so_luong_yc += this.linhKienAdd.so_luong_yc;
                    // linhkien.so_luong_thuc += this.linhKienAdd.so_luong_thuc;
                    return;
                }
            }
            linhkien = {};
            this.receipt.linh_kiens.push(Object.assign({}, this.linhKienAdd));
        }
    }

    onXoaLinhKienClick(index) {
        this.linhKienXoaIndex = index;
    }

    xoaLinhKien() {
        (<any>$('#delete_linh_kien')).modal('hide');
        this.receipt.tong -= this.receipt.linh_kiens[this.linhKienXoaIndex].don_gia * this.receipt.linh_kiens[this.linhKienXoaIndex].so_luong_thuc;
        this.receipt.linh_kiens.splice(this.linhKienXoaIndex, 1);
    }

    deleteReceipt() {
        this.chungTuService.delete({'chung_tu_id' : this.receipt.id,
            'kho_nhap_id': this.receipt.kho_nhap_id, 'kho_xuat_id': this.receipt.kho_xuat_id})
            .takeWhile(() => this.alive).subscribe((res: any) => {
                (<any>$('#delete_receipt')).modal('hide');
                this.router.navigateByUrl('/dashboard/issues');
        });
    }

    validateDocument() {
        if (!this.receipt.linh_kiens || this.receipt.linh_kiens.length === 0) {
            return false;
        }

        if (!this.receipt.ngay_ct) {
            return false;
        }

        /*if (!this.receipt.so_ct) {
            return false;
        }*/
        return true;
    }

    getDocumentData() {
        const data: any = {};

        data.id = this.receipt.id;
        data.cong_ty_id = this.receipt.cong_ty_id;
        data.phieu_sua_chua_id = this.receipt.phieu_sua_chua_id;
        data.tk_no_id = this.receipt.tk_no_id;
        data.tk_co_id = this.receipt.tk_co_id;
        data.doi_tuong_no_id = this.receipt.doi_tuong_no_id;
        data.doi_tuong_co_id = this.receipt.doi_tuong_co_id;
        data.loai_ct = environment.loai_chung_tu.phieu_nhap_kho;
        data.ngay_ct = this.dateService.getDateString(this.receipt.ngay_ct);
        data.so_ct = this.receipt.so_ct;
        data.ma_ct_id = this.receipt.ma_ct_id;
        data.don_dat_hang_id = this.receipt.don_dat_hang_id;
        data.ten_nguoi_giao = this.receipt.ten_nguoi_giao;
        data.so_ct_goc = this.receipt.so_ct_goc;
        data.ngay_ct_goc = this.receipt.ngay_ct_goc ? this.dateService.getDateString(this.receipt.ngay_ct_goc) : null;
        data.don_vi_ct_goc = this.receipt.don_vi_ct_goc;
        data.kho_nhap_id = this.receipt.kho_nhap_id;
        data.kho_xuat_id = this.receipt.kho_xuat_id;
        data.tong_so_tien_truoc_thue = this.receipt.tong_so_tien_truoc_thue;
        data.phan_tram_thue = this.receipt.phan_tram_thue;
        data.ten_nguoi_nhan = this.receipt.ten_nguoi_nhan;
        data.so_ct_goc_kem = this.receipt.so_ct_goc_kem;
        data.trung_tam_bao_hanh_id = this.receipt.trung_tam_bao_hanh_id;
        data.linh_kiens = [];
        let lk;
        for (let i = 0; i < this.receipt.linh_kiens.length; i++) {
            lk = this.receipt.linh_kiens[i];
            data.linh_kiens.push({'id': lk.id, 'linh_kien_id': lk.linh_kien_id,
            'so_luong_yc': lk.so_luong_yc,
            'so_luong_thuc': lk.so_luong_thuc,
            'loai_giao_dich': environment.loai_giao_dich.nhap,
            'don_gia' : lk.don_gia,
            'ghi_chu': lk.ghi_chu,
            'loai_ct': environment.loai_chung_tu.phieu_nhap_kho,
            'no_id': lk.no_id,
            'ngay_ct': data.ngay_ct});
        }
        return {'data': data };
    }

    onEditClick() {
        this.isInDisplayMode = false;
    }

    onSaveClick() {
        if (this.validateDocument()) {
            this.receipt.ma_ct_id = this.receipt.loai_chung_tu ? this.receipt.loai_chung_tu.id : null;
            this.receipt.kho_nhap_id = this.receipt.kho_nhap.id;

            if (this.receipt.id) {
                //edit
                this.chungTuService.update_ct(this.getDocumentData(),
                    this.isKhoTot).subscribe((res: any) => {
                    if (!res.error) {
                       this.close();
                    }
                });
            }else {
                //add new
                this.chungTuService.create_ct(this.getDocumentData(),
                    this.isKhoTot).subscribe((res: any) => {
                    if (!res.error) {
                        this.close();
                    }
                });
            }
        }else {
            alert('please input to (*) field');
        }
    }

    close() {
        if (!this.linh_kiens) {
            this.location.back();
        }else {
            this.onSaveDone.emit();
        }
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
            #add-receipt{
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
                #table-receipt th{
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
                .receipt-title{
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
                .receipt-content .logo a:hover {
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
                table#table-receipt * {
                  border-bottom: 0;
                }
                #table-receipt td{
                  border: 2px solid #dee2e6;
                
                }
                .receipt-content .invoice-wrapper {
                  background: #FFF;
                  border: 1px solid #CDD3E2;
                  box-shadow: 0px 0px 1px #CCC;
                  padding: 40px 40px 60px;
                  margin-top: 40px;
                  border-radius: 4px;
                }
                
                .receipt-content .invoice-wrapper .payment-details span {
                  display: block;
                }
                .receipt-content .invoice-wrapper .payment-details a {
                  display: inline-block;
                  margin-top: 5px;
                }
                
                .receipt-content .invoice-wrapper .line-items .print a {
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
                
                .receipt-content .invoice-wrapper .line-items .print a:hover {
                  text-decoration: none;
                  border-color: #333;
                  color: #333;
                }
                @media (min-width: 1200px) {
                  .receipt-content .container {width: 900px; }
                }
                
                .receipt-content .logo {
                  text-align: center;
                  margin-top: 50px;
                }
                
                .receipt-content .logo a {
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
                
                .receipt-content .invoice-wrapper .intro {
                  line-height: 25px;
                  color: #444;
                }
                
                .receipt-content .invoice-wrapper .payment-info {
                  margin-top: 25px;
                  padding-top: 15px;
                }
                
                
                
                .receipt-content .invoice-wrapper .payment-info strong {
                  display: block;
                  color: #444;
                  margin-top: 3px;
                }
                
                @media (max-width: 767px) {
                  .receipt-content .invoice-wrapper .payment-info .text-right {
                    text-align: left;
                    margin-top: 20px; }
                }
                .receipt-content .invoice-wrapper .payment-details {
                  border-top: 2px solid #EBECEE;
                  margin-top: 30px;
                  padding-top: 20px;
                  line-height: 22px;
                }
                
                
                @media (max-width: 767px) {
                  .receipt-content .invoice-wrapper .payment-details .text-right {
                    text-align: left;
                    margin-top: 20px; }
                }
                .receipt-content .invoice-wrapper .line-items {
                  margin-top: 40px;
                }
                .receipt-content .invoice-wrapper .line-items .headers {
                  color: #A9B0BB;
                  font-size: 13px;
                  letter-spacing: .3px;
                  border-bottom: 2px solid #EBECEE;
                  padding-bottom: 4px;
                }
                .receipt-content .invoice-wrapper .line-items .items {
                  margin-top: 8px;
                  border-bottom: 2px solid #EBECEE;
                  padding-bottom: 8px;
                }
                .receipt-content .invoice-wrapper .line-items .items .item {
                  padding: 10px 0;
                  color: #696969;
                  font-size: 15px;
                }
                @media (max-width: 767px) {
                  .receipt-content .invoice-wrapper .line-items .items .item {
                    font-size: 13px; }
                }
                .receipt-content .invoice-wrapper .line-items .items .item .amount {
                  letter-spacing: 0.1px;
                  color: #84868A;
                  font-size: 16px;
                }
                @media (max-width: 767px) {
                  .receipt-content .invoice-wrapper .line-items .items .item .amount {
                    font-size: 13px; }
                }
                
                .receipt-content .invoice-wrapper .line-items .total {
                  margin-top: 30px;
                }
                
                .receipt-content .invoice-wrapper .line-items .total .extra-notes {
                  float: left;
                  width: 40%;
                  text-align: left;
                  font-size: 13px;
                  color: #7A7A7A;
                  line-height: 20px;
                }
                
                @media (max-width: 767px) {
                  .receipt-content .invoice-wrapper .line-items .total .extra-notes {
                    width: 100%;
                    margin-bottom: 30px;
                    float: none; }
                }
                
                .receipt-content .invoice-wrapper .line-items .total .extra-notes strong {
                  display: block;
                  margin-bottom: 5px;
                  color: #454545;
                }
                
                .receipt-content .invoice-wrapper .line-items .total .field {
                  margin-bottom: 7px;
                  font-size: 14px;
                  color: #555;
                }
                
                .receipt-content .invoice-wrapper .line-items .total .field.grand-total {
                  margin-top: 10px;
                  font-size: 16px;
                  font-weight: 500;
                }
                
                .receipt-content .invoice-wrapper .line-items .total .field.grand-total span {
                  color: #20A720;
                  font-size: 16px;
                }
                
                .receipt-content .invoice-wrapper .line-items .total .field span {
                  display: inline-block;
                  margin-left: 20px;
                  min-width: 85px;
                  color: #84868A;
                  font-size: 15px;
                }
                
                .receipt-content .invoice-wrapper .line-items .print {
                  margin-top: 50px;
                  text-align: center;
                }
                
                
                
                .receipt-content .invoice-wrapper .line-items .print a i {
                  margin-right: 3px;
                  font-size: 14px;
                }
                
                .receipt-content .footer {
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
                div#receipt-tk {
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
