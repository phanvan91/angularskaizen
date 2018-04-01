import {Component, ElementRef, Host, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {TinhTrangHuHongService} from '../../../shared/tinh-trang-hu-hong.service';
import {environment} from '../../../../environments/environment';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {TramBaoHanhService} from '../../../shared/tram-bao-hanh.service';
import {AuthService} from '../../../shared/auth.service';
import {CustomerService} from '../../../shared/customer.service';
import {SelectComponent} from 'ng2-select';
import {ConfigService} from '../../../shared/config.service';
import {SerialService} from '../../../shared/serial.service';
import {NguyenNhanService} from '../../../shared/nguyen-nhan.service';
import {HuongKhacPhucService} from '../../../shared/huong-khac-phuc.service';
import {Ng2ImgMaxService} from 'ng2-img-max';
import {DomSanitizer} from '@angular/platform-browser';
import {PhieuSuaChuaService} from '../../../shared/phieu-sua-chua.service';
import {BangTinhCongSuaChuaService} from '../../../shared/bang-tinh-cong-sua-chua.service';
import {ActivatedRoute} from '@angular/router';
import {ChiPhiDiLaiService} from '../../../shared/chi-phi-di-lai.service';
import {DateService} from '../../../shared/date.service';
import {forEach} from '@angular/router/src/utils/collection';
import {LinhKienService} from '../../../shared/linh-kien.service';
import {KhoService} from '../../../shared/kho.service';
import {DashboardComponent} from "../../dashboard.component";
import {ToastyService} from "ng2-toasty";
import htmlString = JQuery.htmlString;
import {ChungTuService} from "../../../shared/chung-tu.service";
import {UserService} from "../../../shared/user.service";

@Component({
  selector: 'app-phieusc',
  templateUrl: './phieusc.component.html',
  styleUrls: ['./phieusc.component.scss']
})
export class PhieuscComponent implements OnInit, OnDestroy {

  private value: any = {};
  toChuc = environment.toChuc;
  sserverUrl = environment.server_url;
  alive = true;
  dateShow;
  tinhTrangHuHongs = [];
  isOpenDetailSerialCustomer;
  createPhieuSuaChuaForm;
  user: any = {};
  kenh_tiep_nhan = environment.kenh_tiep_nhan;
  uu_tien = environment.uu_tien;
  loai_hinh_dv = environment.loai_hinh_dv;
  noi_thuc_hien = environment.noi_thuc_hien;
  tramBaoHanhs = [];
  customers = [];
  // customer: any = {};
    customer;
  thanhPhos: any = {};
  quans: any = {};
  serials = [];
    villages: any = {};
    serial;
  customerModal = false;
  nguyenNhans = [];
  huongKhacPhucs = [];
  formData: FormData;
    formUpload: FormData;

    imgArray = [];
  linhKiens = [];
  sumTinhCongSuaChua = 0;
  query;
  danhSachChiPhiDiLai = [];
  sumChiPhiDiLai = 0;
  total = 0;
  showChiPhiDiLai = true;
  phieu_sua_chua_id;
  PhieuDeNghiLK= [];
  tram_bao_hanh_id;
  phieu_de_nghi_id;
    deleteIndex;
    openAddLK = false;
    status_phieu_de_nghi_lk = environment.status_phieu_de_nghi_lk;
    editIndex;
    options_kh;
    options_serial;
    ajaxOptions_kh;
    ajaxOptions_serial;
    city;
    dictrict;
    village;
    me;
    server_url = environment.server_url;
    trang_thai = 0;
    status_psc = environment.status_psc;
    openSerial = false;
    tong_cpnbh = 0;
    phieu_nhap_kho_id;
    visible = false;
    visible_hpcall = false;
    linhkienxac;
    LKXEditForm;
    ajaxOptions_lk;
    options_lk;
    data_lk;
    data_lk_map;
    editNLKIndex;
    openLKX = false;
    linhkienthuhoiEdit;
    today = new Date();
    editPDNIndex;
    phieu_tra_linh_kien;
    traLK = false;
    init_add_customer = false;
    init_add_serial = false;
    serial_add;
    serial_ma;
    phieu_sua_chua;
    options_tramBaoHanh;
    tramBaoHanhMap;
    @ViewChild('SelectCustomerId') public selectCustomer: SelectComponent;
  @ViewChild('SelectSerialId') public selectSerial: SelectComponent;
  @ViewChild('SelectNguyenNhanId') public selectNguyenNhan: SelectComponent;
  @ViewChild('SelectHuongKhacPhucId') public selectHuongKhacPhuc: SelectComponent;
  @ViewChild('selectLinhKienId') public selectLinhKien: SelectComponent;
  @ViewChild('uploadButton') uploadButton: ElementRef;

  constructor(
    private tinhTrangHuHongService: TinhTrangHuHongService,
    private tramBaoHanhService: TramBaoHanhService,
    private authService: AuthService,
    private customerService: CustomerService,
    private configService: ConfigService,
    private serialService: SerialService,
    private nguyenNhanService: NguyenNhanService,
    private huongKhacPhuc: HuongKhacPhucService,
    private ng2ImgMaxService: Ng2ImgMaxService,
    private sanitizer: DomSanitizer,
    private phieuSuaChuaService: PhieuSuaChuaService,
    private bangTinhCongSuaChuaService: BangTinhCongSuaChuaService,
    private route: ActivatedRoute,
    private chiPhiDiLaiService: ChiPhiDiLaiService,
    private dateService: DateService,
    private linhkien: LinhKienService,
    private khoService: KhoService,
    @Host() private parent: DashboardComponent,
    private toastService: ToastyService,
    private chungTuService: ChungTuService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute

  ) { }

  static initTinhTrangHuHong(id, ma, mo_ta) {
    return new FormGroup({
      id: new FormControl(id),
      ma: new FormControl(ma),
      mo_ta: new FormControl(mo_ta)
    });
  }

  static initNguyenNhan(id, ma_nguyen_nhan, mo_ta) {
    return new FormGroup({
      id: new FormControl(id),
      ma_nguyen_nhan: new FormControl(ma_nguyen_nhan),
      mo_ta: new FormControl(mo_ta)
    });
  }

  static initHuongKhacPhuc(id, ma_huong_khac_phuc, mo_ta, don_gia) {
    return new FormGroup({
      id: new FormControl(id),
      ma_huong_khac_phuc: new FormControl(ma_huong_khac_phuc),
      ten_huong_khac_phuc: new FormControl(mo_ta),
      don_gia: new FormControl(don_gia)
    });
  }

  static initNote(id, note, user_id) {
    return new FormGroup({
      id: new FormControl(id),
      note: new FormControl(note),
      user_id: new FormControl(user_id)
    });
  }

  static initDanhSachChiPhiDiLai(id, phieu_sua_chua_id, danh_sach_chi_phi_di_lai_id, lat, lng, tong_tien,
                                 created_at, updated_at, ghi_chu , address) {
    return new FormGroup({
      id: new FormControl(id),
      phieu_sua_chua_id: new FormControl(phieu_sua_chua_id),
      danh_sach_chi_phi_di_lai_id: new FormControl(danh_sach_chi_phi_di_lai_id),
      lat: new FormControl(lat),
      lng: new FormControl(lng),
      tong_tien: new FormControl(tong_tien),
      created_at: new FormControl(created_at),
      updated_at: new FormControl(updated_at),
      ghi_chu: new FormControl(ghi_chu),
        address: new FormControl(address),

    });
  }

  ngOnInit() {
      this.parent.showLoading();

      this.ajaxOptions_lk = {
          url: this.linhkien.searchUrl,
          dataType: 'json',
          delay: 250,
          cache: false,
          data: (params: any) => {
              if (params.term) {
                  if (params.term.length >= 3) {
                      return {
                          key_word: params.term,
                          kho_id: this.tram_bao_hanh_id
                      };
                  }
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



      this.ajaxOptions_kh = {
          url: this.server_url + '/api/v1/khach-hang-search',
          dataType: 'json',
          delay: 250,
          cache: false,
          data: (params: any) => {
              if (params.term) {
                  if (params.term.length >= 3) {
                      this.init_add_customer = true;

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

      this.ajaxOptions_serial = {
          url: this.server_url + '/api/v1/serial-search',
          dataType: 'json',
          delay: 250,
          cache: false,
          data: (params: any) => {
              if (params.term) {

                  if (params.term.length >= 3) {
                      this.init_add_serial = false;

                      setTimeout(() => {
                          this.init_add_serial = true;
                      }, 200);
                      this.serial_add = params.term;

                      return {
                          query: params.term,
                      };
                  }
              }
          },
          processResults: (data: any, params: any) => {
              return {
                  results: $.map(data, function (obj) {
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
      this.options_tramBaoHanh = {
          placeholder: {
              id: '0', // the value of the option
              text: 'Lựa chọn trạm'
          }
      };

      this.dateShow = new Date();

      this.LKXEditForm = new FormGroup({
          id: new FormControl(null, {
              validators: [ Validators.required]
          }),
          phieu_sua_chua_id: new FormControl(null, {
              validators: [ Validators.required]
          }),
          hoan_thanh_tra_xac: new FormControl(0, {
              validators: [ Validators.required]
          }),
          linh_kien_thu_hoi_id: new FormControl(null, {
              validators: [ Validators.required]
          }),
          ghi_chu: new FormControl(null, {
              validators: [ Validators.required]
          }),
      });

      this.createPhieuSuaChuaForm = new FormGroup({
      kenh_tiep_nhan: new FormControl(1, {
        validators: [ Validators.required]
      }),
      uu_tien: new FormControl(3, {
        validators: [ Validators.required]
      }),
      loai_hinh_dv: new FormControl(1, {
        validators: [ Validators.required]
      }),
      ngay_tiep_nhan: new FormControl(this.dateShow, {
        validators: [ Validators.required]
      }),
      noi_thuc_hien: new FormControl(1, {
        validators: [ Validators.required]
      }),
      ngay_hoan_tat_mong_muon: new FormControl(this.dateShow, {
        validators: [ Validators.required]
      }),
      thong_tin_dich_vu_ghi_chu: new FormControl(null),
      user_id: new FormControl(this.user.id, {
        validators: [ Validators.required]
      }),
      tram_bao_hanh_id: new FormControl(null, {
        validators: [ Validators.required, Validators.min(1)]
      }),
      tinh_trang_hu_hongs: new FormArray([]),
      ghi_chu: new FormControl(null),
      serial_id: new FormControl(null, {
        validators: [Validators.required]
      }),
      khach_hang_id: new FormControl(null, {
        validators: [Validators.required]
      }),
      nguyen_nhans: new FormArray([]),
      huong_khac_phucs: new FormArray([]),
      notes: new FormArray([]),
      id: new FormControl(null),
      danh_sach_chi_phi_di_lais: new FormArray([]),
        checked_fix: new FormControl(0, {
            validators: [ Validators.required]
        }),
    });
      this.userService.userInfo.takeWhile(() => this.alive).subscribe(res => {
          this.me = res;
          this.user = res;
          this.createPhieuSuaChuaForm.get('user_id').patchValue(this.user.id);

      });
      this.activatedRoute.queryParams.subscribe(params => {
          this.serial_ma = params['serial'];
          console.log( this.serial_ma);
      });


    this.formData = new FormData();


      this.tinhTrangHuHongService.tinhTrangHuHong.takeWhile(() => this.alive).subscribe((resHH: any) => {
          if (resHH.length) {
              this.tinhTrangHuHongs = resHH.map(item => {
                  item.text = item.ma_tinh_trang_hu_hong + '-' + item.mo_ta;
                  return item;
              });
          }
        this.configService.city.takeWhile(() => this.alive).subscribe(resCity => {
            if (resCity) {
                if (Object.keys(resCity).length) {
                    this.thanhPhos = resCity;
                }
                if (Object.getOwnPropertyNames(resCity).length) {
                    this.city = resCity;
                }
                this.configService.district.takeWhile(() => this.alive).subscribe((resDict: any) => {
                    if (resDict) {
                        if (Object.keys(resDict).length) {
                            this.quans = resDict;
                        }
                        if (Object.getOwnPropertyNames(resDict).length) {
                            this.dictrict = resDict;
                        }
                        this.configService.village.takeWhile(() => this.alive).subscribe((resVill: any) => {
                            if (resVill) {
                                if (Object.keys(resVill).length) {
                                    this.villages = resVill;
                                }
                                if (Object.getOwnPropertyNames(resVill).length) {
                                    this.village = resVill;
                                }
                                this.query = this.route.queryParams.takeWhile(() => this.alive).subscribe((val: any) => {

                                    this.phieu_sua_chua_id = val.id;
                                    if (val.id) {
                                        this.visible = true;
                                    }
                                    if (this.phieu_sua_chua_id > 0) {
                                        this.phieuSuaChuaService.show(val.id).takeWhile(() => this.alive).subscribe((res: any) => {
                                            this.phieu_sua_chua = res;
                                            console.log(res);

                                            this.createPhieuSuaChuaForm.get('kenh_tiep_nhan').patchValue(res.kenh_tiep_nhan);
                                            this.createPhieuSuaChuaForm.get('khach_hang_id').patchValue(res.khach_hang_id);
                                            this.createPhieuSuaChuaForm.get('serial_id').patchValue(res.serial_id);
                                            this.createPhieuSuaChuaForm.get('ngay_hoan_tat_mong_muon').patchValue(new Date(res.ngay_hoan_tat_mong_muon));
                                            this.createPhieuSuaChuaForm.get('ngay_tiep_nhan').patchValue(new Date(res.ngay_tiep_nhan));
                                            this.createPhieuSuaChuaForm.get('user_id').patchValue(res.user_id);
                                            this.createPhieuSuaChuaForm.get('tram_bao_hanh_id').patchValue(res.tram_bao_hanh_id);
                                            this.createPhieuSuaChuaForm.get('ghi_chu').patchValue(res.ghi_chu);
                                            this.createPhieuSuaChuaForm.get('id').patchValue(res.id);
                                            if (res.status === 6 || res.status === 1 || res.status === 7) {
                                                this.createPhieuSuaChuaForm.get('checked_fix').patchValue(1);
                                                this.visible_hpcall = true;
                                            }else {
                                                this.createPhieuSuaChuaForm.get('checked_fix').patchValue(0);
                                                this.visible_hpcall = false;

                                            }
                                            this.tram_bao_hanh_id = res.tram_bao_hanh_id;
                                            this.phieu_nhap_kho_id = res.phieu_nhap_kho_id;
                                            this.serial = res.serial;
                                            if (this.serial) {
                                                this.parent.hideLoading();

                                            }

                                            this.isOpenDetailSerialCustomer = true;
                                            this.customer =  res.customer;
                                            if ( this.customer) {
                                                this.createPhieuSuaChuaForm.get('khach_hang_id').patchValue(this.customer.id);
                                                this.tramBaoHanhService.get_tram_by_tinh(this.customer.tinh_tp).takeWhile(() => this.alive).subscribe((resTram: any) => {
                                                    if (resTram) {
                                                        if (resTram.find(x => x.id === this.tram_bao_hanh_id)) {
                                                            this.tramBaoHanhMap = resTram.find(x => x.id === this.tram_bao_hanh_id).ten;
                                                            console.log(this.tramBaoHanhMap);
                                                        }else {
                                                            this.createPhieuSuaChuaForm.get('tram_bao_hanh_id').patchValue( this.tramBaoHanhs[0].id);

                                                        }
                                                        this.tramBaoHanhs = resTram.map(item => {item.text = item.ten; return item; });

                                                    }
                                                });

                                            }

                                            res.danh_sach_tinh_trang_hu_hong.forEach((tVal: any) => {
                                                this.addTinhTrangHuHong(tVal.id, tVal.ma_tinh_trang_hu_hong, tVal.mo_ta);
                                            });
                                            res.danh_sach_chi_phi_di_lai.forEach((cpdlRes: any) => {
                                                this.addDanhSachChiPhiDiLai(cpdlRes.id, cpdlRes.phieu_sua_chua_id, cpdlRes.danh_sach_chi_phi_di_lai_id, cpdlRes.lat,
                                                    cpdlRes.lng, cpdlRes.tong_tien, cpdlRes.created_at, cpdlRes.updated_at, cpdlRes.ghi_chu,  cpdlRes.address);
                                                this.sumChiPhiDiLai += cpdlRes.tong_tien;
                                            });
                                            res.notes.forEach((noteValue: any) => {
                                                this.addNote(noteValue.id, noteValue.note);
                                            });
                                            res.danh_sach_bang_tinh_cong_sua_chua.forEach((hkpVal: any) => {
                                                this.addHuongKhacPhuc(hkpVal.id, hkpVal.ma_huong_khac_phuc, hkpVal.ten_huong_khac_phuc, hkpVal.don_gia);
                                                this.sumTinhCongSuaChua += hkpVal.don_gia;
                                            });
                                            res.danh_sach_nguyen_nhan.forEach((nhVal: any) => {
                                                this.addNguyenNhan(nhVal.id, nhVal.ma_nguyen_nhan, nhVal.mo_ta);
                                            });
                                            if ( res.hinh_anh) {
                                                this.imgArray = res.hinh_anh.split(',');


                                            }
                                            this.trang_thai = res.status;
                                            this.danhSachChiPhiDiLai = res.danh_sach_chi_phi_di_lai;
                                            this.total = this.sumTinhCongSuaChua + this.sumChiPhiDiLai;
                                            this.linhkien.getDeNghiCapLK(val.id).takeWhile(() => this.alive).subscribe((resDNLK: any) => {
                                                this.PhieuDeNghiLK = resDNLK;

                                            });

                                            this.linhkien.getLKXPSC(val.id).takeWhile(() => this.alive).subscribe((resLKX: any) => {
                                                this.linhkienxac = resLKX;
                                                console.log(this.linhkienxac);
                                            });
                                            this.linhkien.getPTlk(this.phieu_sua_chua_id).takeWhile(() => this.alive).subscribe((resTLK: any) => {
                                                if (resTLK) {
                                                    this.phieu_tra_linh_kien = resTLK;
                                                    for (let p = 0; p < this.phieu_tra_linh_kien.data.length; p++ ) {
                                                        this.tong_cpnbh += (this.phieu_tra_linh_kien.data[p].so_luong_cap -
                                                            this.phieu_tra_linh_kien.data[p].so_luong_tra) * this.phieu_tra_linh_kien.data[p].don_gia ;
                                                    }

                                                }

                                            });



                                        }, err => console.log(err));
                                    } else {
                                        this.phieu_sua_chua_id = 0;
                                        this.parent.hideLoading();
                                        this.visible = false;
                                        this.serial = null;
                                        this.customer =  null;

                                    }
                                });

                            }

                        });

                    }

                });

            }

        });


    });





  }


    add_phieu_de_nghi(id) {
        console.log(id);
        this.linhkien.getDeNghiCapLKByID(id).takeWhile(() => this.alive).subscribe((resDNLK: any) => {
            this.PhieuDeNghiLK.push(resDNLK);

            (<any>$('#add_de_nghi_lk')).modal('hide');

        });
    }
    edit_phieu_de_nghi(id) {
        this.linhkien.getDeNghiCapLKByID(id).takeWhile(() => this.alive).subscribe((resDNLK: any) => {
            this.PhieuDeNghiLK[this.editIndex] = resDNLK;

            (<any>$('#edit_de_nghi_lk')).modal('hide');
        });
      console.log(id);
    }
  addTinhTrangHuHong(id, ma, mo_ta) {
    const control = <FormArray>this.createPhieuSuaChuaForm.controls['tinh_trang_hu_hongs'];
    control.push(PhieuscComponent.initTinhTrangHuHong(id, ma, mo_ta));
  }

  addNguyenNhan(id, ma_nguyen_nhan, mo_ta) {
    const control = <FormArray>this.createPhieuSuaChuaForm.controls['nguyen_nhans'];
    control.push(PhieuscComponent.initNguyenNhan(id, ma_nguyen_nhan, mo_ta));
  }

  addHuongKhacPhuc(id, ma_nguyen_nhan, mo_ta, don_gia) {
    const control = <FormArray>this.createPhieuSuaChuaForm.controls['huong_khac_phucs'];
    control.push(PhieuscComponent.initHuongKhacPhuc(id, ma_nguyen_nhan, mo_ta, don_gia));
  }

  addNote(id, note) {
    const control = <FormArray>this.createPhieuSuaChuaForm.controls['notes'];
    control.push(PhieuscComponent.initNote(id, note, this.user.id));
  }

  addDanhSachChiPhiDiLai(id, phieu_sua_chua_id, danh_sach_chi_phi_di_lai_id, lat, lng,
                         tong_tien, created_at, updated_at, ghi_chu, address) {
    const control = <FormArray>this.createPhieuSuaChuaForm.controls['danh_sach_chi_phi_di_lais'];
    control.push(PhieuscComponent
      .initDanhSachChiPhiDiLai(id, phieu_sua_chua_id, danh_sach_chi_phi_di_lai_id, lat, lng,
          tong_tien, created_at, updated_at, ghi_chu , address));
  }

  selected(value: any): void {
    if (!this.createPhieuSuaChuaForm.get('tinh_trang_hu_hongs').value.find(o => o.id === value.id)) {
      const data = value.text.split('-');
      this.addTinhTrangHuHong(value.id, data[0], data[1]);
      console.log(this.createPhieuSuaChuaForm.get('tinh_trang_hu_hongs').value);
    }

  }

  removeTTHH(index) {
    this.createPhieuSuaChuaForm.controls.tinh_trang_hu_hongs.splice(index, 1);
  }

  removed(value: any): void {
    this.createPhieuSuaChuaForm.get('tinh_trang_hu_hong_id').patchValue(null);
  }



  nguyenNhanTyped(value: any) {
    this.nguyenNhanService.filter(value).takeWhile(() => this.alive).subscribe((res: any) => {
      this.nguyenNhans = res.map(item => {
        item.text = '[' + item.ma_nguyen_nhan + ']' + ' ' + item.mo_ta ;
        return item;
      });
      this.selectNguyenNhan.active = this.nguyenNhans;
    }, err => console.log(err));
  }

  nguyenNhanSelected(value: any) {
    if (!this.createPhieuSuaChuaForm.get('nguyen_nhans').value.find(o => o.id === value.id)) {
      const nh = this.nguyenNhans.find(o => o.id === value.id);
      this.addNguyenNhan(nh.id, nh.ma_nguyen_nhan, nh.mo_ta);
    }
  }

  huongKhacPhucTyped(value: any) {
          this.bangTinhCongSuaChuaService.filter(value).takeWhile(() => this.alive).subscribe((res: any) => {
              if (res.length) {
                  this.huongKhacPhucs = res.map(item => {
                      item.text = '[' + item.ma_huong_khac_phuc + ']' + ' ' + item.ten_huong_khac_phuc ;
                      return item;
                  });
                  if (this.selectHuongKhacPhuc) {
                      this.selectHuongKhacPhuc.active = this.huongKhacPhucs;

                  }
              }

          }, err => console.log(err));

  }

  huongKhacPhucSelected(value: any) {
    if (!this.createPhieuSuaChuaForm.get('huong_khac_phucs').value.find(o => o.id === value.id)) {
      const hkp = this.huongKhacPhucs.find(o => o.id === value.id);
      this.addHuongKhacPhuc(hkp.id, hkp.ma_huong_khac_phuc, hkp.ten_huong_khac_phuc, hkp.don_gia);
      this.sumTinhCongSuaChua += hkp.don_gia;
      this.total = this.sumTinhCongSuaChua + this.sumChiPhiDiLai;
    }
  }

  addTTDVGhiChu() {
    if (this.createPhieuSuaChuaForm.get('thong_tin_dich_vu_ghi_chu').value) {
      this.addNote(null, this.createPhieuSuaChuaForm.get('thong_tin_dich_vu_ghi_chu').value);
      this.createPhieuSuaChuaForm.get('thong_tin_dich_vu_ghi_chu').patchValue(null);
    }
  }

  uploadFiles(event) {
    const fileList: FileList = event.target.files;

    this.formUpload = new FormData();
    if (fileList.length > 0) {
      let file: File;
      const imgs = [];
      for (let i = 0; i < fileList.length; i++) {
        file = fileList[i];
        if (file.type.indexOf('image/') === 0) {
          imgs.push(file);
        }
      }
      const resizeImgs = [];
      this.ng2ImgMaxService.resize(imgs, 786, 378).subscribe((result) => {
        resizeImgs.push(result);
          this.formUpload.append('images[]', result, result.name);
          if (resizeImgs.length === imgs.length) {
              const data = this.createPhieuSuaChuaForm.value;
              this.formUpload.append('nguyen_nhans', JSON.stringify(data.nguyen_nhans));
              this.formUpload.append('huong_khac_phucs', JSON.stringify(data.huong_khac_phucs));
              this.formUpload.append('id', JSON.stringify(data.id));
              this.formUpload.append('notes', JSON.stringify(data.notes));
              this.phieuSuaChuaService.updateThongTinDichVu(this.formUpload).takeWhile(() => this.alive).subscribe((res: any) => {
                  if ( res.hinh_anh) {
                      this.imgArray = res.hinh_anh.split(',');

                  }
              }, err => console.log(err));
        }
      }, error => {
        console.log(error);
      });
    }
  }

  triggerUpload() {
    const el: HTMLElement = this.uploadButton.nativeElement as HTMLElement;
    el.click();
  }

  deleteImage(index) {
      const data: any = {};

      data.filename =  this.imgArray[index];
      this.imgArray.splice(index, 1);
      data.hinh_anh = this.imgArray;
      data.id = this.phieu_sua_chua_id;
      this.phieuSuaChuaService.updateImage(data).takeWhile(() => this.alive).subscribe((res: any) => {
          console.log(data);

          console.log(res);

      }, err => console.log(err));

  }
    openTraLinhKien() {
        this.traLK = true;

    }

  onSerialEdit(event) {
    this.serial = event;
    // console.log(event);
  }
    savePhieuTraLK () {
        const data_all: any = {};
        const data: any = {};
        data.phieu_sua_chua_id = this.phieu_sua_chua_id;



        for (let i = 0; i < this.phieu_tra_linh_kien.data.length; i ++) {
          const chi_tiet_de_nghi = this.phieu_tra_linh_kien.data;
          const name = 'slt_chi_tiet_' + chi_tiet_de_nghi[i].linh_kien_id;
            const slt = (document.getElementById(name) as HTMLTextAreaElement).value;
          chi_tiet_de_nghi[i].so_luong_thuc = slt;
          chi_tiet_de_nghi[i].kho_id = this.phieu_tra_linh_kien.kho_tram_id;




        }


        data.linh_kiens =  this.phieu_tra_linh_kien.data;
        data.kho_nhap_id =  this.phieu_tra_linh_kien.kho_tram_id;
        data.cong_ty_id = this.phieu_tra_linh_kien.cong_ty_id;
        data_all.data = data;
        data_all.user = this.me;
        console.log(data_all);

        this.chungTuService.tra_linh_kien(data_all).takeWhile(() => this.alive).subscribe((res: any) => {
            if (res) {
                this.phieu_tra_linh_kien = res;
                for (let p = 0; p < this.phieu_tra_linh_kien.data.length; p++ ) {
                    this.tong_cpnbh += (this.phieu_tra_linh_kien.data[p].so_luong_cap -
                        this.phieu_tra_linh_kien.data[p].so_luong_tra) * this.phieu_tra_linh_kien.data[p].don_gia ;
                }

            }

        });

        this.toastService.success(this.parent.toastOptions('Trả linh kiện thành công', ''));

    }
  onSubmit(event) {
    event.preventDefault();
      const data = this.createPhieuSuaChuaForm.value;
      data.tong_tien =  this.total + this.tong_cpnbh;
      data.user_log =   this.me.id;
      data.khach_hang_id = this.customer.id;
      data.serial_id = this.serial.id;
      data.user_id = this.me.id;
      this.createPhieuSuaChuaForm.controls.tinh_trang_hu_hongs.controls = [];
      this.createPhieuSuaChuaForm.controls.notes.controls = [];
      this.createPhieuSuaChuaForm.controls.danh_sach_chi_phi_di_lais.controls = [];
      this.createPhieuSuaChuaForm.controls.nguyen_nhans.controls = [];
      this.createPhieuSuaChuaForm.controls.huong_khac_phucs.controls = [];
      if ( !data.tram_bao_hanh_id) {
          data.tram_bao_hanh_id = this.tramBaoHanhs[0].id;

      }

      if (this.phieu_sua_chua_id > 0) {
        this.phieuSuaChuaService.update(data).takeWhile(() => this.alive).subscribe((resPSC: any) => {
            this.phieu_sua_chua_id = resPSC.id;
            this.phieu_sua_chua = resPSC;

            this.phieuSuaChuaService.show(this.phieu_sua_chua_id).takeWhile(() => this.alive).subscribe((res: any) => {
                this.createPhieuSuaChuaForm.get('kenh_tiep_nhan').patchValue(res.kenh_tiep_nhan);
                this.createPhieuSuaChuaForm.get('khach_hang_id').patchValue(res.khach_hang_id);
                this.createPhieuSuaChuaForm.get('serial_id').patchValue(res.serial_id);
                this.createPhieuSuaChuaForm.get('ngay_hoan_tat_mong_muon').patchValue(new Date(res.ngay_hoan_tat_mong_muon));
                this.createPhieuSuaChuaForm.get('ngay_tiep_nhan').patchValue(new Date(res.ngay_tiep_nhan));
                this.createPhieuSuaChuaForm.get('user_id').patchValue(res.user_id);
                this.createPhieuSuaChuaForm.get('tram_bao_hanh_id').patchValue(res.tram_bao_hanh_id);
                this.createPhieuSuaChuaForm.get('ghi_chu').patchValue(res.ghi_chu);
                this.createPhieuSuaChuaForm.get('id').patchValue(res.id);
                if (res.status === 6 || res.status === 1 || res.status === 7) {
                    this.createPhieuSuaChuaForm.get('checked_fix').patchValue(1);
                    this.visible_hpcall = true;

                }else {
                    this.createPhieuSuaChuaForm.get('checked_fix').patchValue(0);
                    this.visible_hpcall = true;

                }
                this.tram_bao_hanh_id = res.tram_bao_hanh_id;
                this.phieu_nhap_kho_id = res.phieu_nhap_kho_id;

                this.serial = res.serial;
                if (this.serial) {
                    this.parent.hideLoading();

                }

                this.isOpenDetailSerialCustomer = true;
                this.customerService.show(res.khach_hang_id).takeWhile(() => this.alive).subscribe((cRes: any) => {
                    this.customer = cRes;
                    this.createPhieuSuaChuaForm.get('khach_hang_id').patchValue(this.customer.id);
                    this.tramBaoHanhService.get_tram_by_tinh(this.customer.tinh_tp)
                        .takeWhile(() => this.alive).subscribe((resTram: any) => {
                        if (resTram) {
                            if (resTram.find(x => x.id === this.tram_bao_hanh_id)) {
                                this.tramBaoHanhMap = resTram.find(x => x.id === this.tram_bao_hanh_id).ten;
                                console.log(this.tramBaoHanhMap);
                            }else {
                                this.createPhieuSuaChuaForm.get('tram_bao_hanh_id').patchValue( this.tramBaoHanhs[0].id);

                            }
                            this.tramBaoHanhs = resTram.map(item => {item.text = item.ten; return item; });

                        }
                    });
                }, err => console.log(err));

                res.danh_sach_tinh_trang_hu_hong.forEach((tVal: any) => {
                    this.addTinhTrangHuHong(tVal.id, tVal.ma_tinh_trang_hu_hong, tVal.mo_ta);
                });
                res.danh_sach_chi_phi_di_lai.forEach((cpdlRes: any) => {
                    this.addDanhSachChiPhiDiLai(cpdlRes.id, cpdlRes.phieu_sua_chua_id, cpdlRes.danh_sach_chi_phi_di_lai_id, cpdlRes.lat,
                        cpdlRes.lng, cpdlRes.tong_tien, cpdlRes.created_at, cpdlRes.updated_at, cpdlRes.ghi_chu, cpdlRes.address);
                });
                res.notes.forEach((noteValue: any) => {
                    this.addNote(noteValue.id, noteValue.note);
                });
                res.danh_sach_bang_tinh_cong_sua_chua.forEach((hkpVal: any) => {
                    this.addHuongKhacPhuc(hkpVal.id, hkpVal.ma_huong_khac_phuc, hkpVal.ten_huong_khac_phuc, hkpVal.don_gia);
                });
                res.danh_sach_nguyen_nhan.forEach((nhVal: any) => {
                    this.addNguyenNhan(nhVal.id, nhVal.ma_nguyen_nhan, nhVal.mo_ta);
                });
                if ( res.hinh_anh) {
                    this.imgArray = res.hinh_anh.split(',');

                }
                this.trang_thai = res.status;

                this.danhSachChiPhiDiLai = res.danh_sach_chi_phi_di_lai;
                this.linhkien.getLKXPSC(this.phieu_sua_chua_id).takeWhile(() => this.alive).subscribe((resLKX: any) => {
                    this.linhkienxac = resLKX;
                    console.log(this.linhkienxac);
                });
                this.linhkien.getPTlk(this.phieu_sua_chua_id).takeWhile(() => this.alive).subscribe((resTLK: any) => {
                    if (resTLK) {
                        this.phieu_tra_linh_kien = resTLK;
                        // for (let p = 0; p < this.phieu_tra_linh_kien.data.length; p++ ) {
                        //     this.tong_cpnbh += (this.phieu_tra_linh_kien.data[p].so_luong_cap -
                        //         this.phieu_tra_linh_kien.data[p].so_luong_tra) * this.phieu_tra_linh_kien.data[p].don_gia ;
                        // }

                    }


                });

                this.toastService.success(this.parent.toastOptions('Lưu phiếu sửa chữa thành công', ''));





            }, err => console.log(err));

        }, err => console.log(err));

    }else {


          this.phieuSuaChuaService.create(data).takeWhile(() => this.alive).subscribe((resAdd: any) => {
            console.log(resAdd);
            if (resAdd) {
                this.phieu_sua_chua_id = resAdd.id;
                this.phieuSuaChuaService.show(this.phieu_sua_chua_id).takeWhile(() => this.alive).subscribe((res: any) => {
                    this.createPhieuSuaChuaForm.get('kenh_tiep_nhan').patchValue(res.kenh_tiep_nhan);
                    this.createPhieuSuaChuaForm.get('khach_hang_id').patchValue(res.khach_hang_id);
                    this.createPhieuSuaChuaForm.get('serial_id').patchValue(res.serial_id);
                    this.createPhieuSuaChuaForm.get('ngay_hoan_tat_mong_muon').patchValue(new Date(res.ngay_hoan_tat_mong_muon));
                    this.createPhieuSuaChuaForm.get('ngay_tiep_nhan').patchValue(new Date(res.ngay_tiep_nhan));
                    this.createPhieuSuaChuaForm.get('user_id').patchValue(res.user_id);
                    this.createPhieuSuaChuaForm.get('tram_bao_hanh_id').patchValue(res.tram_bao_hanh_id);
                    this.createPhieuSuaChuaForm.get('ghi_chu').patchValue(res.ghi_chu);
                    this.createPhieuSuaChuaForm.get('id').patchValue(res.id);
                    this.tram_bao_hanh_id = res.tram_bao_hanh_id;
                    this.phieu_nhap_kho_id = res.phieu_nhap_kho_id;

                    this.serialService.get_serial(res.serial_id).takeWhile(() => this.alive).subscribe((sRes: any) => {
                        this.serial = sRes;
                        this.isOpenDetailSerialCustomer = true;
                        this.customerService.show(res.khach_hang_id).takeWhile(() => this.alive).subscribe((cRes: any) => {
                            this.customer = cRes;
                            this.createPhieuSuaChuaForm.get('khach_hang_id').patchValue(this.customer.id);
                            this.tramBaoHanhService.get_tram_by_tinh(this.customer.tinh_tp)
                                .takeWhile(() => this.alive).subscribe((resTram: any) => {
                                if (resTram) {
                                    if (resTram.find(x => x.id === this.tram_bao_hanh_id)) {
                                        this.tramBaoHanhMap = resTram.find(x => x.id === this.tram_bao_hanh_id).ten;
                                        console.log(this.tramBaoHanhMap);
                                    }else {
                                        this.createPhieuSuaChuaForm.get('tram_bao_hanh_id').patchValue( this.tramBaoHanhs[0].id);

                                    }

                                    this.tramBaoHanhs = resTram.map(item => {item.text = item.ten; return item; });

                                }
                            });
                        }, err => console.log(err));
                    });
                    res.danh_sach_tinh_trang_hu_hong.forEach((tVal: any) => {
                        this.addTinhTrangHuHong(tVal.id, tVal.ma_tinh_trang_hu_hong, tVal.mo_ta);
                    });
                    res.danh_sach_chi_phi_di_lai.forEach((cpdlRes: any) => {
                        this.addDanhSachChiPhiDiLai(cpdlRes.id, cpdlRes.phieu_sua_chua_id, cpdlRes.danh_sach_chi_phi_di_lai_id, cpdlRes.lat,
                            cpdlRes.lng, cpdlRes.tong_tien, cpdlRes.created_at, cpdlRes.updated_at, cpdlRes.ghi_chu, cpdlRes.address);
                        this.sumChiPhiDiLai += cpdlRes.tong_tien;
                    });
                    res.notes.forEach((noteValue: any) => {
                        this.addNote(noteValue.id, noteValue.note);
                    });
                    res.danh_sach_bang_tinh_cong_sua_chua.forEach((hkpVal: any) => {
                        this.addHuongKhacPhuc(hkpVal.id, hkpVal.ma_huong_khac_phuc, hkpVal.ten_huong_khac_phuc, hkpVal.don_gia);
                        this.sumTinhCongSuaChua += hkpVal.don_gia;
                    });
                    res.danh_sach_nguyen_nhan.forEach((nhVal: any) => {
                        this.addNguyenNhan(nhVal.id, nhVal.ma_nguyen_nhan, nhVal.mo_ta);
                    });
                    if ( res.hinh_anh) {
                        this.imgArray = res.hinh_anh.split(',');

                    }
                    this.trang_thai = res.status;
                    this.toastService.success(this.parent.toastOptions('Tạo phiếu sửa chữa thành công', ''));

                }, err => console.log(err));


                }


        }, err => console.log(err));

    }
  }

  checkIn() {
        this.chiPhiDiLaiService.filter(this.createPhieuSuaChuaForm.get('tram_bao_hanh_id').value,
            this.customer.tinh_tp, this.customer.quan_huyen, this.customer.phuong_xa).takeWhile(() => this.alive)
          .subscribe((chiPhiRes: any) => {
            if ( chiPhiRes ) {
                if (chiPhiRes.id > 0) {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition((position) => {
                            const data: any = {};
                            data.khach_hang_id = this.createPhieuSuaChuaForm.get('khach_hang_id').value;
                            data.id = this.createPhieuSuaChuaForm.get('id').value;
                            data.tram_bao_hanh_id = this.createPhieuSuaChuaForm.get('tram_bao_hanh_id').value;
                            data.lat = position.coords.latitude;
                            data.lng = position.coords.longitude;
                            data.created_at = data.updated_at = new Date().toLocaleString();
                            console.log(data);
                            this.phieuSuaChuaService.checkIn(data).takeWhile(() => this.alive).subscribe((res: any) => {
                                console.log(res);

                                this.danhSachChiPhiDiLai.push(res.danh_sach_chi_phi_di_lai[0]);
                                this.sumChiPhiDiLai += res.danh_sach_chi_phi_di_lai[0].tong_tien;
                                this.total = this.sumTinhCongSuaChua + this.sumChiPhiDiLai;
                                this.addDanhSachChiPhiDiLai(res.danh_sach_chi_phi_di_lai[0].id, res.danh_sach_chi_phi_di_lai[0].phieu_sua_chua_id,
                                    res.danh_sach_chi_phi_di_lai[0].danh_sach_chi_phi_di_lai_id, res.danh_sach_chi_phi_di_lai[0].lat,
                                    res.danh_sach_chi_phi_di_lai[0].lng, res.danh_sach_chi_phi_di_lai[0].tong_tien, res.danh_sach_chi_phi_di_lai[0].created_at,
                                    res.danh_sach_chi_phi_di_lai[0].updated_at, res.danh_sach_chi_phi_di_lai[0].ghi_chu, res.danh_sach_chi_phi_di_lai[0].address );
                            }, err => console.log(err));


                        });
                    } else {
                        const data: any = {};

                        data.khach_hang_id = this.createPhieuSuaChuaForm.get('khach_hang_id').value;
                        data.id = this.createPhieuSuaChuaForm.get('id').value;
                        data.tram_bao_hanh_id = this.createPhieuSuaChuaForm.get('tram_bao_hanh_id').value;
                        data.created_at = data.updated_at = new Date().toLocaleString();
                        this.phieuSuaChuaService.checkIn(data).takeWhile(() => this.alive).subscribe((res: any) => {
                            console.log(res);

                            this.danhSachChiPhiDiLai.push(res.danh_sach_chi_phi_di_lai[0]);
                            this.sumChiPhiDiLai += res.danh_sach_chi_phi_di_lai[0].tong_tien;
                            this.total = this.sumTinhCongSuaChua + this.sumChiPhiDiLai;
                            this.addDanhSachChiPhiDiLai(res.danh_sach_chi_phi_di_lai[0].id, res.danh_sach_chi_phi_di_lai[0].phieu_sua_chua_id,
                                res.danh_sach_chi_phi_di_lai[0].danh_sach_chi_phi_di_lai_id, res.danh_sach_chi_phi_di_lai[0].lat,
                                res.danh_sach_chi_phi_di_lai[0].lng, res.danh_sach_chi_phi_di_lai[0].tong_tien, res.danh_sach_chi_phi_di_lai[0].created_at,
                                res.danh_sach_chi_phi_di_lai[0].updated_at, res.danh_sach_chi_phi_di_lai[0].ghi_chu, res.danh_sach_chi_phi_di_lai[0].address );
                        }, err => console.log(err));

                    }
                } else {
             this.toastService.error(this.parent.toastOptions('Check in thất bại', 'Chưa có thông tin chi phí đi lại của khách hàng. '));

                }


            }
          });

  }

  removeChiPhiDiLai(index) {
    const data: any = {};
    data.id = this.createPhieuSuaChuaForm.controls.danh_sach_chi_phi_di_lais.controls[index].value.id;

    this.phieuSuaChuaService.removeChiPhiDiLai(data).takeWhile(() => this.alive).subscribe((res: any) => {
      this.danhSachChiPhiDiLai.splice(index, 1);
      this.sumChiPhiDiLai -= res.tong_tien;
      this.total = this.sumTinhCongSuaChua + this.sumChiPhiDiLai;
      this.createPhieuSuaChuaForm.controls.danh_sach_chi_phi_di_lais.removeAt(index);
    }, err => console.log(err));
  }

  updateChiPhiDiLai(index) {
    const data: any = {};
    data.ghi_chu = this.createPhieuSuaChuaForm.controls.danh_sach_chi_phi_di_lais.controls[index].value.ghi_chu;
    data.id = this.createPhieuSuaChuaForm.controls.danh_sach_chi_phi_di_lais.controls[index].value.id;

    this.phieuSuaChuaService.updateChiPhiDiLai(data).takeWhile(() => this.alive).subscribe((res: any) => {
      this.createPhieuSuaChuaForm.controls.danh_sach_chi_phi_di_lais.controls[index].get('ghi_chu').patchValue(res.ghi_chu);
    }, err => console.log(err));
  }

  removeHuongKhacPhuc(index) {
    this.sumTinhCongSuaChua = this.sumTinhCongSuaChua - this.createPhieuSuaChuaForm.controls.huong_khac_phucs.controls[index].value.don_gia;
    this.total = this.sumTinhCongSuaChua + this.sumChiPhiDiLai;
    this.createPhieuSuaChuaForm.controls.huong_khac_phucs.removeAt(index);
  }

  updateThongTinDichVu() {
    const data = this.createPhieuSuaChuaForm.value;
    this.formData.append('nguyen_nhans', JSON.stringify(data.nguyen_nhans));
    this.formData.append('huong_khac_phucs', JSON.stringify(data.huong_khac_phucs));
    this.formData.append('id', JSON.stringify(data.id));
    this.formData.append('notes', JSON.stringify(data.notes));

    this.phieuSuaChuaService.updateThongTinDichVu(this.formData).takeWhile(() => this.alive).subscribe((res: any) => {
      console.log(res);
    }, err => console.log(err));
  }
    OpenAddLK() {
        this.openAddLK = false;
        this.phieu_de_nghi_id = null;
        setTimeout(() => {
            this.openAddLK = true;
            (<any>$('#add_edit_lk')).modal('show');
        }, 200);
        setTimeout(() => {
            (<any>$('#add_edit_lk')).modal('show');
        }, 400);


        setTimeout(() => {
            (<any>$('#add_edit_lk')).modal('show');
        }, 400);
    }
    openDNEdit(index) {
        this.phieu_de_nghi_id = this.PhieuDeNghiLK[index].id;
        this.phieu_sua_chua_id = this.PhieuDeNghiLK[index].phieu_sua_chua_id;
        this.openAddLK = false;
        this.editIndex = index;

        setTimeout(() => {
            this.openAddLK = true;
            (<any>$('#add_edit_lk')).modal('show');
        }, 200);
        setTimeout(() => {
            (<any>$('#add_edit_lk')).modal('show');
        }, 400);


        setTimeout(() => {
            (<any>$('#add_edit_lk')).modal('show');
        }, 400);
    }
    onDeleteDNSubmit() {
        const data: any = {};
        data.id = this.PhieuDeNghiLK[this.deleteIndex].id;
        this.linhkien.deletePDN(data).takeWhile(() => this.alive).subscribe((res: any) => {
            this.PhieuDeNghiLK.splice(this.deleteIndex, 1);
            (<any>$('#delete_lk')).modal('hide');
        }, err => console.log(err));
    }

    onChangeValue(e, type) {
        // console.log(e.value);
        const id = e.value;
        if (type === 'khachhang') {
            this.customerService.get_customer(id).takeWhile(() => this.alive).subscribe((res: any) => {
                this.customer = res;
                this.createPhieuSuaChuaForm.get('khach_hang_id').patchValue(res.id);
                this.tramBaoHanhService.get_tram_by_tinh(this.customer.tinh_tp)
                    .takeWhile(() => this.alive).subscribe((resTram: any) => {
                    if (resTram) {
                        if (resTram.find(x => x.id === this.tram_bao_hanh_id)) {
                            this.tramBaoHanhMap = resTram.find(x => x.id === this.tram_bao_hanh_id).ten;
                            console.log(this.tramBaoHanhMap);
                        } else {
                            this.createPhieuSuaChuaForm.get('tram_bao_hanh_id').patchValue( this.tramBaoHanhs[0].id);

                        }
                        this.tramBaoHanhs = resTram.map(item => {item.text = item.ten; return item; });


                    }
                });

            });

        }
        if (type === 'serial') {

            this.phieuSuaChuaService.checkPSC(id).takeWhile(() => this.alive).subscribe((val: any) => {
               if (val.id > 0) {
                   console.log(val);
                   if (val.id) {
                       this.visible = true;
                       this.phieu_sua_chua_id = val.id;
                   }
                   if (this.phieu_sua_chua_id > 0) {
                       this.phieuSuaChuaService.show(val.id).takeWhile(() => this.alive).subscribe((res: any) => {
                           this.phieu_sua_chua = res;

                           this.createPhieuSuaChuaForm.get('kenh_tiep_nhan').patchValue(res.kenh_tiep_nhan);
                           this.createPhieuSuaChuaForm.get('khach_hang_id').patchValue(res.khach_hang_id);
                           this.createPhieuSuaChuaForm.get('serial_id').patchValue(res.serial_id);
                           this.createPhieuSuaChuaForm.get('ngay_hoan_tat_mong_muon').patchValue(new Date(res.ngay_hoan_tat_mong_muon));
                           this.createPhieuSuaChuaForm.get('ngay_tiep_nhan').patchValue(new Date(res.ngay_tiep_nhan));
                           this.createPhieuSuaChuaForm.get('user_id').patchValue(res.user_id);
                           this.createPhieuSuaChuaForm.get('tram_bao_hanh_id').patchValue(res.tram_bao_hanh_id);
                           this.createPhieuSuaChuaForm.get('ghi_chu').patchValue(res.ghi_chu);
                           this.createPhieuSuaChuaForm.get('id').patchValue(res.id);
                           if (res.status === 6 || res.status === 1 || res.status === 7) {
                               this.createPhieuSuaChuaForm.get('checked_fix').patchValue(1);
                               this.visible_hpcall = true;
                           }else {
                               this.createPhieuSuaChuaForm.get('checked_fix').patchValue(0);
                               this.visible_hpcall = false;

                           }
                           this.tram_bao_hanh_id = res.tram_bao_hanh_id;
                           this.phieu_nhap_kho_id = res.phieu_nhap_kho_id;
                           this.serial = res.serial;
                           if (this.serial) {
                               this.parent.hideLoading();

                           }

                           this.isOpenDetailSerialCustomer = true;
                           this.customer =  res.customer;
                           if ( this.customer) {
                               this.createPhieuSuaChuaForm.get('khach_hang_id').patchValue(this.customer.id);
                               this.tramBaoHanhService.get_tram_by_tinh(this.customer.tinh_tp)
                                   .takeWhile(() => this.alive).subscribe((resTram: any) => {
                                   if (resTram) {
                                       if (resTram.find(x => x.id === this.tram_bao_hanh_id)) {
                                           this.tramBaoHanhMap = resTram.find(x => x.id === this.tram_bao_hanh_id).ten;
                                           console.log(this.tramBaoHanhMap);
                                       }else {
                                           this.createPhieuSuaChuaForm.get('tram_bao_hanh_id').patchValue( this.tramBaoHanhs[0].id);

                                       }
                                       this.tramBaoHanhs = resTram.map(item => {item.text = item.ten; return item; });

                                   }
                               });

                           }

                           res.danh_sach_tinh_trang_hu_hong.forEach((tVal: any) => {
                               this.addTinhTrangHuHong(tVal.id, tVal.ma_tinh_trang_hu_hong, tVal.mo_ta);
                           });
                           res.danh_sach_chi_phi_di_lai.forEach((cpdlRes: any) => {
                     this.addDanhSachChiPhiDiLai(cpdlRes.id, cpdlRes.phieu_sua_chua_id, cpdlRes.danh_sach_chi_phi_di_lai_id, cpdlRes.lat,
                       cpdlRes.lng, cpdlRes.tong_tien, cpdlRes.created_at, cpdlRes.updated_at, cpdlRes.ghi_chu,  cpdlRes.address);
                               this.sumChiPhiDiLai += cpdlRes.tong_tien;
                           });
                           res.notes.forEach((noteValue: any) => {
                               this.addNote(noteValue.id, noteValue.note);
                           });
                           res.danh_sach_bang_tinh_cong_sua_chua.forEach((hkpVal: any) => {
                               this.addHuongKhacPhuc(hkpVal.id, hkpVal.ma_huong_khac_phuc, hkpVal.ten_huong_khac_phuc, hkpVal.don_gia);
                               this.sumTinhCongSuaChua += hkpVal.don_gia;
                           });
                           res.danh_sach_nguyen_nhan.forEach((nhVal: any) => {
                               this.addNguyenNhan(nhVal.id, nhVal.ma_nguyen_nhan, nhVal.mo_ta);
                           });
                           if ( res.hinh_anh) {
                               this.imgArray = res.hinh_anh.split(',');


                           }
                           this.trang_thai = res.status;
                           this.danhSachChiPhiDiLai = res.danh_sach_chi_phi_di_lai;
                           this.total = this.sumTinhCongSuaChua + this.sumChiPhiDiLai;
                           this.linhkien.getDeNghiCapLK(val.id).takeWhile(() => this.alive).subscribe((resDNLK: any) => {
                               this.PhieuDeNghiLK = resDNLK;
                           });

                           this.linhkien.getLKXPSC(val.id).takeWhile(() => this.alive).subscribe((resLKX: any) => {
                               this.linhkienxac = resLKX;
                               console.log(this.linhkienxac);
                           });
                           this.linhkien.getPTlk(this.phieu_sua_chua_id).takeWhile(() => this.alive).subscribe((resTLK: any) => {
                               if (resTLK) {
                                   this.phieu_tra_linh_kien = resTLK;
                                   for (let p = 0; p < this.phieu_tra_linh_kien.data.length; p++ ) {
                                       this.tong_cpnbh += (this.phieu_tra_linh_kien.data[p].so_luong_cap -
                                           this.phieu_tra_linh_kien.data[p].so_luong_tra) * this.phieu_tra_linh_kien.data[p].don_gia ;
                                   }

                               }

                           });



                       }, err => console.log(err));
                   }
               } else {
                   this.phieu_sua_chua_id = null;
                   this.visible = false;

                   this.serialService.get_serial(id).takeWhile(() => this.alive).subscribe((res: any) => {
                       if (res) {
                           this.serial = res;
                           console.log(this.serial);
                           if (res.khach_hang_id > 0) {
                               this.customerService.get_customer(res.khach_hang_id).takeWhile(() => this.alive).subscribe((res: any) => {
                                   this.customer = res;
                                   this.createPhieuSuaChuaForm.get('khach_hang_id').patchValue(res.id);
                               });
                           }
                           this.createPhieuSuaChuaForm.get('serial_id').patchValue(res.id);

                       }

                   });

               }

            });

        }
    }
    openEditSerial() {
        this.openSerial = false;
        setTimeout(() => {
            this.openSerial = true;
            (<any>$('#edit_serial')).modal('show');
        }, 200);
        setTimeout(() => {
            (<any>$('#edit_serial')).modal('show');
        }, 400);


        setTimeout(() => {
            (<any>$('#edit_serial')).modal('show');
        }, 400);

    }
    openEditCustomer() {
        this.customerModal = false;
        setTimeout(() => {
            this.customerModal = true;
            (<any>$('#edit_customer')).modal('show');
        }, 200);
        setTimeout(() => {
            (<any>$('#edit_customer')).modal('show');
        }, 400);


        setTimeout(() => {
            (<any>$('#edit_customer')).modal('show');
        }, 400);

    }
    checked_fix(type) {
      if (type === 'checked') {
          this.createPhieuSuaChuaForm.get('checked_fix').patchValue(1);
          (<any>$('#checked_fix')).modal('hide');
          (<any>$('#unchecked_fix')).modal('hide');


      } else {
          this.createPhieuSuaChuaForm.get('checked_fix').patchValue(0);
          this.visible_hpcall = false;
          (<any>$('#checked_fix')).modal('hide');
          (<any>$('#unchecked_fix')).modal('hide');

      }

    }
    openEditLKX(index) {
        this.openLKX = false;
        this.editNLKIndex = index;

        setTimeout(() => {
            this.openLKX = true;
        }, 200);
        setTimeout(() => {
            (<any>$('#edit_LKX')).modal('show');
        }, 400);
        this.editNLKIndex = index;
        this.linhkienthuhoiEdit = this.linhkienxac[index].linh_kien_thu_hoi;
        this.LKXEditForm.get('id').patchValue(this.linhkienxac[index].id);
        this.LKXEditForm.get('phieu_sua_chua_id').patchValue(this.linhkienxac[index].phieu_sua_chua_id);
        this.LKXEditForm.get('linh_kien_thu_hoi_id').patchValue(this.linhkienxac[index].linh_kien_thu_hoi_id);
        this.LKXEditForm.get('hoan_thanh_tra_xac').patchValue(this.linhkienxac[index].hoan_thanh_tra_xac);
        this.LKXEditForm.get('ghi_chu').patchValue(this.linhkienxac[index].ghi_chu);

    }
    changeLinhKien(e: any) {
        const id = e.value;
        this.LKXEditForm.get('linh_kien_thu_hoi_id').patchValue(id);

    }

    onEditLKXSubmit(event) {
        event.preventDefault();
        const data = this.LKXEditForm.value;
        this.linhkien.updateLKX(data).takeWhile(() => this.alive).subscribe((res: any) => {
            console.log(res);
            if (res) {
                (<any>$('#edit_LKX')).modal('hide');

                this.linhkienxac[this.editNLKIndex] = res;

            }

        });
    }
    tramBaoHanhCreateEditValueChanged(event) {
        this.createPhieuSuaChuaForm.get('tram_bao_hanh_id').patchValue(event.value);

    }

    ngOnDestroy(): void {
    this.alive = false;
  }

}

