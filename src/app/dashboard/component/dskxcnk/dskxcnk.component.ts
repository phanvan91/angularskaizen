import { element } from 'protractor';
import { Component, OnInit, Host } from '@angular/core';
import { TramBaoHanhService } from '../../../shared/tram-bao-hanh.service';
import { UserService } from '../../../shared/user.service';
import {DateService} from "../../../shared/date.service";
import {LinhKienService} from "../../../shared/linh-kien.service";
import {Router} from '@angular/router';

import {ToastyService} from 'ng2-toasty';
import {DashboardComponent} from '../../dashboard.component';

@Component({
  selector: 'app-dskxcnk',
  templateUrl: './dskxcnk.component.html',
  styleUrls: ['./dskxcnk.component.scss']
})
export class DskxcnkComponent implements OnInit {

  constructor(
    private tramService: TramBaoHanhService, private userService: UserService,
    private dateService: DateService, private linhKienService: LinhKienService,
    private toastService: ToastyService,@Host() private parent: DashboardComponent,
    private router: Router
  ) { }

  loai_nhan_vien_bao_hanh = 4;

  searchForm;
  startDate;
  endDate;
  openNhapKho = false;
  arrItemChecked;

  data_nhanvien_map;
  data_tram_map;
  listChoLinhKienXac;

  checkChoLinhKienXac = [];

  optionTram;
  ajaxOptionTram;
  optionsNhanVien;
  ajaxOptionNhanVien;

  ngOnInit() {
    this.listChoLinhKienXac = [];
    this.ajaxOptionTram = {
      url: this.tramService.searchUrl,
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
          this.data_tram_map = new Object();
          if (res.length > 0) {
              for (let i = 0; i < res.length; i++) {
                  this.data_tram_map[res[i].id] = res[i];
              }
          }
          return {
              results: $.map(res, function (obj) {
                  // console.log('data', obj);
                  return { id: obj.id, text: obj.ten };
              })
          };
      },
    };
    this.optionTram = {
      ajax: this.ajaxOptionTram,
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

    this.ajaxOptionNhanVien = {
      url: this.userService.searchNhanVienUrl,
      dataType: 'json',
      delay: 250,
      cache: false,
      data: (params: any) => {
          return {
              key_word: params.term,
              type: this.loai_nhan_vien_bao_hanh,
              token: JSON.parse(localStorage.getItem('sstoken')).access_token
          };
      },
      processResults: (res: any, params: any) => {
          this.data_nhanvien_map = new Object();
          if (res.length > 0) {
              for (let i = 0; i < res.length; i++) {
                  this.data_nhanvien_map[res[i].id] = res[i];
              }
          }
          return {
              results: $.map(res, function (obj) {
                  // console.log('data', obj);
                  return { id: obj.id, text: obj.name };
              })
          };
      },
    };

    this.optionsNhanVien = {
      ajax: this.ajaxOptionNhanVien,
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

    this.searchForm = {
      startDate: '', endDate: '',
      tram_bao_hanh_id: '', user_id: '', so_phieu: '', trang_thai: ''
    }

    this.search(null);
  }

  search(event) {
    if (this.startDate && this.endDate) {
      this.searchForm.startDate = this.dateService.getDateString(this.startDate);
      this.searchForm.endDate = this.dateService.getDateString(this.endDate);
    }
    this.linhKienService.getDsChoNhapKho(this.searchForm).subscribe((res: any) => {
      this.listChoLinhKienXac = res;
      this.listChoLinhKienXac.forEach(element => {
        this.checkChoLinhKienXac[element.id] = 
          element.trang_thai == 1 ? { select: 0, da_tra_xac: 0} :  { select: 0, da_tra_xac: 1};
      });
    }, err => {
      this.toastService.error(this.parent.toastOptions('Thao tác thất bại', err.error));
    });
  }

  openPhieuSuaChua(id){
    this.router.navigateByUrl('/dashboard/tao-phieu-sua-chua?id='+ id.toString());
  }
  openPhieuNhapKho(){
    this.openNhapKho = true;
  }
  checkChoLinhKien(id) {
    if (id == 'all') {
      this.checkChoLinhKienXac.forEach(element => {
        if (element.da_tra_xac != 1) {
          element.select = !element.select;
        }
      });
      return;
    }
    if (this.checkChoLinhKienXac[id].da_tra_xac != 1) {
      this.checkChoLinhKienXac[id].select = !this.checkChoLinhKienXac[id].select;
    }

  }
  changeTram(event){
    this.searchForm.tram_bao_hanh_id = event.value;
  }
  changeNhanVien(event){
    this.searchForm.user_id = event.value;
  }

  getIdCheckChoLinhKien() {
    this.arrItemChecked = [];
    for (const key in this.checkChoLinhKienXac) {
      if (this.checkChoLinhKienXac.hasOwnProperty(key) && this.checkChoLinhKienXac[key].select) {
        this.arrItemChecked.push(this.listChoLinhKienXac.find(x => x.id == key));
      }
    }
    console.log(this.arrItemChecked);
    this.openPhieuNhapKho();
  }

  saveDone(event) {
    (<any>$('#open_nhap_kho')).modal('hide');
    this.ngOnInit();
  }

}
