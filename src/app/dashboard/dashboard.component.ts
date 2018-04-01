import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {environment} from '../../environments/environment';
import {CompanyService} from '../shared/company.service';
import {AccountantService} from '../shared/accountant.service';
import {LoaiChungTuService} from '../shared/loai-chung-tu.service';
import {SoHieuChungTuService} from '../shared/so-hieu-chung-tu.service';
import {LoaiNguoiDungService} from '../shared/loai-nguoi-dung.service';
import {TrungTamBaoHanhService} from '../shared/trung-tam-bao-hanh.service';
import {TramBaoHanhService} from '../shared/tram-bao-hanh.service';
import {NganhHangService} from '../shared/nganh-hang.service';
import {SanPhamService} from '../shared/san-pham.service';
import {ModelService} from '../shared/model.service';
import {SerialService} from '../shared/serial.service';
import {TinhTrangHuHongService} from '../shared/tinh-trang-hu-hong.service';
import {NguyenNhanService} from '../shared/nguyen-nhan.service';
import {HuongKhacPhucService} from '../shared/huong-khac-phuc.service';

import {UserService} from '../shared/user.service';
import {ConfigService} from '../shared/config.service';
import {BangTinhCongSuaChuaService} from '../shared/bang-tinh-cong-sua-chua.service';
import {CustomerService} from '../shared/customer.service';
import {DoiTuongPhapNhanService} from '../shared/doi-tuong-phap-nhan.service';
import {KhoService} from '../shared/kho.service';
import {HpcallService} from '../shared/hpcall.service';
import {ActivatedRoute} from '@angular/router';
import {LinhKienService} from '../shared/linh-kien.service';
import {AuthService} from '../shared/auth.service';
import {ChiPhiDiLaiService} from '../shared/chi-phi-di-lai.service';
import {HeaderComponent} from './component/header/header.component';

import {ToastData, ToastOptions, ToastyService} from 'ng2-toasty';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild("header") header: HeaderComponent;

  leftMenu = {
    'baohanh': false,
    'linhkien': false,
    'kholinhkientot': false,
    'kholinhkienxac': false,
    'khothanhpham': false,
    'happycall': false,
    'baocao': false,
    'khachhang': false,
    'sanpham': false,
    'caidat': false,
    'giao_hang' : false
  };
  isOpenMenu = true;

  toChuc = environment.toChuc;
  alive = true;

  constructor(
    private companyService: CompanyService,
    private accountantService: AccountantService,
    private loaiChungTuService: LoaiChungTuService,
    private soHieuChungTuServe: SoHieuChungTuService,
    private loaiNguoiDungService: LoaiNguoiDungService,
    private trungTamBaoHanhService: TrungTamBaoHanhService,
    private tramBaoHanhService: TramBaoHanhService,
    private nganhHangService: NganhHangService,
    private sanPhamService: SanPhamService,
    private  modelService: ModelService,
    private serialService: SerialService,
    private tinTrangHuHongService: TinhTrangHuHongService,
    private ngyenNhanService: NguyenNhanService,
    private userService: UserService,
    private configService: ConfigService,
    private bangTinhCongSuaChuaService: BangTinhCongSuaChuaService,
    private customerService: CustomerService,
    private huongKhacPhucService: HuongKhacPhucService,
    // private taiKhoanService: TaiKhoanService,
    private doiTuongPhapNhanService: DoiTuongPhapNhanService,
    // private khoService: KhoService,
    private hpcallService: HpcallService,
    private route: ActivatedRoute,
    private linhkienService: LinhKienService,
    private authService: AuthService,
    private chiPhiDiLaiService: ChiPhiDiLaiService,
    private toastService: ToastyService,


  ) { }

  ngOnInit() {
    this.toChuc = this.route.snapshot.data['toChuc'];
    // this.authService.getToChuc().subscribe((res: any) => {});
      this.tramBaoHanhService.all().takeWhile(() => this.alive).subscribe(res => {
          this.tramBaoHanhService.setTramBaoHanhSource(res);
      }, err => console.log(err));
      this.tinTrangHuHongService.getAll().takeWhile(() => this.alive).subscribe(res => {
          this.tinTrangHuHongService.setTinTrangHuHongSource(res);
      }, err => console.log(err));

      this.configService.getCityProvince().takeWhile(() => this.alive).subscribe(res => {
          this.configService.setCitySource(res);
      }, err => console.log(err));

      this.configService.getDistrict().takeWhile(() => this.alive).subscribe(res => {
          this.configService.setDistrictSource(res);
      }, err => console.log(err));

      this.configService.getVillage().takeWhile(() => this.alive).subscribe(res => {
          this.configService.setVillageSource(res);
      }, err => console.log(err));

      this.authService.me().takeWhile(() => this.alive).subscribe(userInfo => {
          this.userService.setUserSource(userInfo);
          console.log(userInfo);
      });



  }

  refreshDoiTuongPhapNhan() {
      this.doiTuongPhapNhanService.all(this.toChuc.id).takeWhile(() => this.alive).subscribe(res => {
          this.doiTuongPhapNhanService.setDoiTuongPhapNhanSource(res);
      }, err => console.log(err));
  }

  initHeader() {
    this.header.ngOnInit();
  }

  onSelectMenu(type) {
    for (const key in this.leftMenu) {
      if (this.leftMenu.hasOwnProperty(key) && (key !== type)) {
        this.leftMenu[key] = false;
      }
    }
    this.leftMenu[type] = !this.leftMenu[type];
  }
  mouseOutMenu() {
    if (!this.isOpenMenu) {
      this.setFalseDefaultMenu();
    }
  }
  showMenuRange() {
    this.setFalseDefaultMenu();
    this.isOpenMenu = !this.isOpenMenu;
  }

  setFalseDefaultMenu() {
    for (const key in this.leftMenu) {
      if (this.leftMenu.hasOwnProperty(key)) {
        this.leftMenu[key] = false;
      }
    }
  }
  ngOnDestroy(): void {
      this.alive = false;
  }

  toastOptions(title, message): ToastOptions {
    return {
        title: title,
        msg: message,
        onAdd: (toast: ToastData) => {
            console.log('Toast ' + toast.id + ' has been added!');
        },
        onRemove: function(toast: ToastData) {
            // console.log('Toast ' + toast.id + ' has been removed!');
        }
    };
  }

  showLoading() {
    $('.loading').removeClass('hide');
  }
  hideLoading() {
    $('.loading').addClass('hide');
  }
}
