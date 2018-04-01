import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CompanyService} from './company.service';
import {AccountantService} from './accountant.service';
import {LoaiChungTuService} from './loai-chung-tu.service';
import {SoHieuChungTuService} from './so-hieu-chung-tu.service';
import {LoaiNguoiDungService} from './loai-nguoi-dung.service';
import {TrungTamBaoHanhService} from './trung-tam-bao-hanh.service';
import {TramBaoHanhService} from './tram-bao-hanh.service';
import {NganhHangService} from './nganh-hang.service';
import {SanPhamService} from './san-pham.service';
import {ModelService} from './model.service';
import {SerialService} from './serial.service';
import {TinhTrangHuHongService} from './tinh-trang-hu-hong.service';
import {UserService} from './user.service';
import {ConfigService} from './config.service';
import {KeysPipe} from './pipe/keys.pipe';
import {ChiPhiDiLaiService} from './chi-phi-di-lai.service';
import {BangTinhCongSuaChuaService} from './bang-tinh-cong-sua-chua.service';
import {CurrencyNumberPipe} from './pipe/currency-number.pipe';
import {DoiTuongPhapNhanService} from './doi-tuong-phap-nhan.service';
import {NguyenNhanService} from './nguyen-nhan.service';
import {ChungTuService} from './chung-tu.service';
import {KhoService} from './kho.service';
import {TaiKhoanService} from './tai-khoan.service';
import {CustomerService} from './customer.service';
import {HuongKhacPhucService} from './huong-khac-phuc.service';
import {HpcallService} from './hpcall.service';
import {DonDatHangService} from './don-dat-hang.service';
import {LinhKienService} from './linh-kien.service';
import {AuthService} from './auth.service';
import {ToChucResolverService} from './to-chuc-resolver.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthHttpInterceptor} from './auth-http-interceptor';
import 'rxjs/add/operator/shareReplay';
import {PhieuSuaChuaService} from './phieu-sua-chua.service';
import { SelectModule } from 'ng2-select';
import {DateService} from './date.service';
import {PhieuDeNghiService} from './phieu-de-nghi.service';
import {ToastyConfig, ToastyModule, ToastyService} from 'ng2-toasty';
import {CongViecService} from "./cong-viec.service";
import { DatetimePipe } from './pipe/datetime.pipe';
import {AuthGuard} from './guard/auth.guard';
import { FilterPipe } from './pipe/search.pipe';
@NgModule({
  imports: [
    CommonModule,
    ToastyModule.forRoot()
  ],

  providers: [
    CompanyService,
    AccountantService,
    LoaiChungTuService,
    SoHieuChungTuService,
    LoaiNguoiDungService,
    TrungTamBaoHanhService,
    TramBaoHanhService,
    NganhHangService,
    SanPhamService,
    ModelService,
    SerialService,
    UserService,
    ConfigService,
    ChiPhiDiLaiService,
    BangTinhCongSuaChuaService,
    TinhTrangHuHongService,
    DoiTuongPhapNhanService,
    NguyenNhanService,
    LinhKienService,
    TaiKhoanService,
    ChungTuService,
    KhoService,
    CustomerService,
    HuongKhacPhucService,
    CustomerService,
    HuongKhacPhucService,
    HpcallService,
    CustomerService,
    HuongKhacPhucService,
    AuthService,
    ToChucResolverService,
      CongViecService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true
    },
    DonDatHangService,
    LinhKienService,
    PhieuSuaChuaService,
    DateService,
    PhieuDeNghiService,
    AuthGuard
  ],
  declarations: [KeysPipe, CurrencyNumberPipe, DatetimePipe,FilterPipe],
  exports: [KeysPipe, CurrencyNumberPipe, ToastyModule, DatetimePipe,FilterPipe],
})

export class SharedModule {
  constructor(private toastyService: ToastyService, private toastyConfig: ToastyConfig) {
    this.toastyConfig.theme = 'bootstrap';
    this.toastyConfig.position = 'top-right';
    this.toastyConfig.showClose = true;
  }
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule
    };
  }
}
